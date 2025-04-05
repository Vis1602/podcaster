import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import config from '../config';

function UploadPodcastPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const imageInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImageUrl(''); // Clear the URL when file is selected
    } else {
      alert('Please select an image file');
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      let finalImageUrl = imageUrl;

      // Upload image file if selected
      if (imageFile) {
        try {
          setUploadProgress(30);
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          
          const imageUploadResponse = await fetch(`${config.apiUrl}/api/upload/image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: imageFormData
          });
          
          if (!imageUploadResponse.ok) {
            const errorData = await imageUploadResponse.json();
            throw new Error(errorData.message || 'Failed to upload image file');
          }
          
          const imageData = await imageUploadResponse.json();
          finalImageUrl = imageData.fileUrl;
          setUploadProgress(70);
        } catch (error) {
          throw new Error(`Failed to upload image: ${error.message}`);
        }
      }
      
      // Create the podcast
      try {
        const response = await fetch(`${config.apiUrl}/api/podcasts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            author,
            description,
            imageUrl: finalImageUrl,
            episodes: []
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create podcast');
        }

        const data = await response.json();
        setUploadProgress(100);
        setSuccess('Podcast series created successfully! You can now add episodes.');
        
        // Reset form
        setTitle('');
        setAuthor('');
        setDescription('');
        setImageUrl('');
        setImageFile(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } catch (error) {
        throw new Error(`Failed to create podcast: ${error.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create Your Podcast Series</h1>
        
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900 text-white p-4 rounded-md mb-4">
            {success}
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {uploadProgress < 70 ? 'Uploading image...' : 'Creating podcast series...'}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Podcast Series Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Podcast Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              ref={imageInputRef}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imageFile && (
              <p className="mt-2 text-sm text-gray-400">
                Selected image: {imageFile.name}
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">OR</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || (!imageFile && !imageUrl)}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                loading || (!imageFile && !imageUrl) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Podcast Series'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadPodcastPage; 