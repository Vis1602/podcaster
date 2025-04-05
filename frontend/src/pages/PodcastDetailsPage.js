import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSign from '../components/LoadingSign';
import { AuthContext } from '../context/AuthContext';
import config from '../config/config';

function PodcastDetailsPage() {
  const { podcastId } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUserPodcast, setIsUserPodcast] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { token, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcastData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // First try to fetch as a user podcast
        const response = await fetch(`${config.apiUrl}/api/podcasts/${podcastId}`);
        if (response.ok) {
          const data = await response.json();
          setPodcast(data);
          setEpisodes(data.episodes || []);
          setIsUserPodcast(true);
          // Check if the current user is the owner of the podcast
          setIsOwner(isAuthenticated && user && data.userId === user.id);
          setLoading(false);
          return;
        }
        
        // If not found as user podcast, try iTunes
        const iTunesResponse = await fetch(`https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode`);
        if (!iTunesResponse.ok) throw new Error(`HTTP error! status: ${iTunesResponse.status}`);
        const iTunesData = await iTunesResponse.json();

        if (iTunesData.results && iTunesData.results.length > 0) {
          const [podcastDetails, ...podcastEpisodes] = iTunesData.results;
          setPodcast(podcastDetails);
          setEpisodes(podcastEpisodes);
          setIsUserPodcast(false);
        } else {
          throw new Error('No podcast data found');
        }

        setLoading(false);
      } catch (error) {
        console.error('There was an error!', error);
        setError('Failed to load podcast');
        setLoading(false);
      }
    };

    fetchPodcastData();
  }, [podcastId]);

  const handleDeletePodcast = async () => {
    if (!isAuthenticated || !isUserPodcast) return;
    
    if (!window.confirm('Are you sure you want to delete this podcast?')) return;
    
    try {
      const response = await fetch(`${config.apiUrl}/api/podcasts/${podcastId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete podcast');
      }
      
      navigate('/home');
    } catch (error) {
      console.error('Error deleting podcast:', error);
      setError('Failed to delete podcast');
    }
  };

  const handleAddEpisode = () => {
    navigate(`/podcast/${podcastId}/add-episode`);
  };

  // Helper function to format duration
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return "--:--";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-900 text-white p-4 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (loading || !podcast) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <LoadingSign />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Podcast Summary - Left Column */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <img 
                src={isUserPodcast ? podcast.imageUrl : podcast.artworkUrl600} 
                alt={isUserPodcast ? podcast.title : podcast.collectionName} 
                className="w-full rounded-lg mb-4"
                style={{ imageRendering: 'high-quality' }}
              />
              <h2 className="text-xl font-bold text-blue-400 mb-1">
                {isUserPodcast ? podcast.title : podcast.collectionName}
              </h2>
              <p className="text-gray-400 mb-4">
                by {isUserPodcast ? podcast.author : podcast.artistName}
              </p>
              <div className="border-t border-gray-700 my-4"></div>
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Description:</h3>
              <p className="text-gray-300 text-sm">
                {isUserPodcast ? podcast.description : (
                  <div dangerouslySetInnerHTML={{ __html: podcast.collectionDescription || 'No description available.' }} />
                )}
              </p>
              
              {/* User podcast actions */}
              {isUserPodcast && isOwner && (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleAddEpisode}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Add New Episode
                  </button>
                  <button
                    onClick={handleDeletePodcast}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Delete Podcast
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Episodes - Right Column */}
          <div>
            <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
              <h3 className="text-xl font-bold text-blue-400">Episodes: {episodes.length}</h3>
            </div>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gray-700 p-3 text-gray-300 font-medium">
                <div className="col-span-1">Title</div>
                <div className="col-span-1 text-right">Date</div>
                <div className="col-span-1 text-right">Duration</div>
              </div>
              
              {/* Episodes List */}
              <div>
                {episodes.map((episode, index) => (
                  <Link 
                    to={`/podcast/${podcastId}/episode/${isUserPodcast ? episode._id : episode.trackId}`}
                    key={isUserPodcast ? episode._id : episode.trackId} 
                    className={`grid grid-cols-3 p-3 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700 cursor-pointer transition duration-200`}
                  >
                    <div className="col-span-1 text-blue-400 truncate pr-2">
                      {isUserPodcast ? episode.title : episode.trackName}
                    </div>
                    <div className="col-span-1 text-right text-gray-400">
                      {new Date(isUserPodcast ? episode.releaseDate : episode.releaseDate).toLocaleDateString()}
                    </div>
                    <div className="col-span-1 text-right text-gray-400">
                      {isUserPodcast ? formatDuration(episode.duration * 1000) : formatDuration(episode.trackTimeMillis)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PodcastDetailsPage;
