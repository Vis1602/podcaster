import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSign from '../components/LoadingSign';
import { AuthContext } from '../context/AuthContext';
import config from '../config';

function EpisodeDetailsPage() {
  const { podcastId, episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isUserPodcast, setIsUserPodcast] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEpisodeData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // First try to fetch as a user podcast
        const podcastResponse = await fetch(`${config.apiUrl}/api/podcasts/${podcastId}`);
        if (podcastResponse.ok) {
          const podcastData = await podcastResponse.json();
          setCurrentPodcast(podcastData);
          setIsUserPodcast(true);
          // Check if the current user is the owner
          setIsOwner(isAuthenticated && user && podcastData.userId === user.id);
          
          // Find the episode in the podcast's episodes array
          const foundEpisode = podcastData.episodes.find(ep => ep._id === episodeId);
          if (foundEpisode) {
            setEpisode(foundEpisode);
            setLoading(false);
            return;
          } else {
            throw new Error('Episode not found');
          }
        }
        
        // If not found as user podcast, try iTunes
        const response = await fetch(`https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const foundEpisode = data.results.find(ep => ep.trackId.toString() === episodeId);

        if (foundEpisode) {
          setEpisode(foundEpisode);
          
          // Get the podcast details from the first result which contains the artwork
          const podcastDetails = data.results[0];
          if (podcastDetails) {
            setCurrentPodcast(podcastDetails);
            setIsUserPodcast(false);
          } else {
            throw new Error('Podcast not found');
          }
        } else {
          throw new Error('Episode not found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('There was an error!', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEpisodeData();
  }, [podcastId, episodeId]);

  const handleDeleteEpisode = async () => {
    if (!isOwner || !window.confirm('Are you sure you want to delete this episode?')) {
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/api/podcasts/${podcastId}/episodes/${episodeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete episode');
      }

      navigate(`/podcast/${podcastId}`);
    } catch (error) {
      console.error('Error deleting episode:', error);
      setError('Failed to delete episode');
    }
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

  if (loading || !episode || !currentPodcast) {
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
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Podcast Summary - Left Column */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <img 
              src={isUserPodcast ? currentPodcast.imageUrl : currentPodcast.artworkUrl600} 
              alt={isUserPodcast ? currentPodcast.title : currentPodcast.collectionName} 
              className="w-full rounded-lg mb-4"
              style={{ imageRendering: 'high-quality' }}
            />
            <h2 className="text-xl font-bold text-blue-400 mb-1">
              {isUserPodcast ? currentPodcast.title : currentPodcast.collectionName}
            </h2>
            <p className="text-gray-400 mb-4">
              by {isUserPodcast ? currentPodcast.author : currentPodcast.artistName}
            </p>
            <div className="border-t border-gray-700 my-4"></div>
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Description:</h3>
            <p className="text-gray-300 text-sm">
              {isUserPodcast ? currentPodcast.description : (
                <div dangerouslySetInnerHTML={{ __html: currentPodcast.collectionDescription || 'No description available.' }} />
              )}
            </p>
          </div>
        </div>
        
        {/* Episode Details - Right Column */}
        <div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-blue-400 mb-4">
              {isUserPodcast ? episode.title : episode.trackName}
            </h2>
            <div className="text-gray-300 mb-6 text-sm leading-relaxed">
              {isUserPodcast ? episode.description : (
                <div dangerouslySetInnerHTML={{ __html: episode.description }} />
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">Listen Now</h3>
              <audio 
                controls 
                src={isUserPodcast ? episode.audioUrl : episode.previewUrl}
                className="w-full h-12 mt-2 focus:outline-none bg-gray-800 text-white"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <div className="mt-6 text-sm text-gray-400">
              <p>Released: {new Date(isUserPodcast ? episode.releaseDate : episode.releaseDate).toLocaleDateString()}</p>
              {isUserPodcast ? (
                <p>Duration: {formatDuration(episode.duration * 1000)}</p>
              ) : (
                episode.trackTimeMillis && <p>Duration: {formatDuration(episode.trackTimeMillis)}</p>
              )}
            </div>

            {/* Delete Episode Button - Only shown to podcast owners */}
            {isOwner && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={handleDeleteEpisode}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                >
                  Delete Episode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format duration
function formatDuration(milliseconds) {
  if (!milliseconds) return "--:--";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default EpisodeDetailsPage;
