import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

function AddEpisodePage() {
  const { podcastId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [podcast, setPodcast] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/podcasts/${podcastId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPodcast(data);
        
        // Check if the current user is the owner
        if (!user || data.userId !== user.id) {
          setError('You do not have permission to add episodes to this podcast');
          return;
        }
      } catch (error) {
        console.error('Error fetching podcast:', error);
        setError('Failed to fetch podcast details');
      }
    };

    fetchPodcast();
  }, [podcastId, user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setAudioUrl(''); // Clear the URL input when a file is selected
        
        // Get audio duration
        const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener('loadedmetadata', () => {
          setDuration(Math.round(audio.duration));
        });
      } else {
        alert('Please select an audio file');
        e.target.value = null;
      }
    }
  };

  const handleUrlChange = (e) => {
    setAudioUrl(e.target.value);
    setAudioFile(null); // Clear the file input when a URL is entered
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadAudioFile = async () => {
    if (!audioFile) return null;
    
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    try {
      const response = await fetch(`http://localhost:5000/api/upload/audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload audio file');
        } else {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error('Server error while uploading audio file');
        }
      }
      
      const data = await response.json();
      console.log('Audio upload successful:', data);
      return data.fileUrl;
    } catch (err) {
      console.error('Audio upload error:', err);
      throw new Error(`Error uploading audio file: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      let finalAudioUrl = audioUrl;
      
      // If a file was selected, upload it first
      if (audioFile) {
        setUploadProgress(30);
        finalAudioUrl = await uploadAudioFile();
        setUploadProgress(70);
      }
      
      // Create the episode with the audio URL
      const response = await fetch(`http://localhost:5000/api/podcasts/${podcastId}/episodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          audioUrl: finalAudioUrl,
          duration: parseInt(duration, 10)
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add episode');
      }

      setUploadProgress(100);
      setSuccess('Episode added successfully!');
      
      // Redirect back to podcast details page after 2 seconds
      setTimeout(() => {
        navigate(`/podcast/${podcastId}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error && !podcast) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-900 text-white p-4 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Add Episode to {podcast?.title}</h1>
        
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
              {uploadProgress < 30 ? 'Preparing...' : 
               uploadProgress < 70 ? 'Uploading audio file...' : 
               'Creating episode...'}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Episode Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Audio File</label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {audioFile && (
              <p className="mt-2 text-sm text-gray-400">
                Selected file: {audioFile.name}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">Upload an audio file (MP3, WAV, etc.)</p>
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
            <label className="block text-sm font-medium mb-2">Audio URL</label>
            <input
              type="url"
              value={audioUrl}
              onChange={handleUrlChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/audio.mp3"
            />
            <p className="text-xs text-gray-400 mt-1">Provide a direct link to an audio file</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Duration (in seconds)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="180"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Duration will be automatically detected if you upload a file</p>
          </div>
          
          <div className="pt-4 flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/podcast/${podcastId}`)}
              className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!audioFile && !audioUrl)}
              className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                (loading || (!audioFile && !audioUrl)) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding...' : 'Add Episode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEpisodePage; 