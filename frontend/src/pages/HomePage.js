import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import LoadingSign from "../components/LoadingSign";
import { AuthContext } from "../context/AuthContext";
import "../styles/HomePage.css";

function HomePage() {
  const [itunesPodcasts, setItunesPodcasts] = useState([]);
  const [userPodcasts, setUserPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      
      // Fetch iTunes podcasts
      const lastFetch = localStorage.getItem('lastFetch');
      const podcastsData = localStorage.getItem('podcastsData');

      // Use cached data if it exists and is less than 24 hours old
      if (lastFetch && podcastsData && Date.now() - parseInt(lastFetch) < 24 * 60 * 60 * 1000) {
        try {
          setItunesPodcasts(JSON.parse(podcastsData));
          console.log('Using cached iTunes podcast data');
        } catch (error) {
          console.error('Error parsing cached data:', error);
          // If there's an error with cached data, we'll try to fetch fresh data
        }
      } else {
        // Fetch fresh data
        const targetUrl = encodeURIComponent("https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json");
        try {
          const response = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          
          if (data && data.contents) {
            const parsedData = JSON.parse(data.contents);
            localStorage.setItem('podcastsData', JSON.stringify(parsedData.feed.entry));
            localStorage.setItem('lastFetch', Date.now().toString());
            setItunesPodcasts(parsedData.feed.entry);
          } else {
            throw new Error('API response is missing contents');
          }
        } catch (error) {
          console.error('There was an error fetching iTunes podcasts!', error);
          
          // If we have cached data but it's old, use it as a fallback
          if (podcastsData) {
            try {
              setItunesPodcasts(JSON.parse(podcastsData));
              console.log('Using old cached data as fallback');
            } catch (parseError) {
              console.error('Error parsing old cached data:', parseError);
            }
          }
        }
      }
      
      // Fetch user-uploaded podcasts
      try {
        const response = await fetch('http://localhost:5000/api/podcasts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserPodcasts(data.podcasts || []);
      } catch (error) {
        console.error('There was an error fetching user podcasts!', error);
      }
      
      setLoading(false);
    };

    fetchPodcasts();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const filteredItunesPodcasts = itunesPodcasts.filter((podcast) =>
    podcast.title.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUserPodcasts = userPodcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageError = (event) => {
    event.target.src = "/path/to/default-image.jpg";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <LoadingSign />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="home-page">
        <h1>Welcome to the Home Page</h1>
        <p>Explore the latest podcasts and episodes!</p>
        
        {/* Search and Count Bar */}
        <div className="search-bar">
          <div className="podcast-count">
            {filteredItunesPodcasts.length + filteredUserPodcasts.length} podcasts
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter podcasts..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
        
        {/* Upload Podcast Button */}
        {isAuthenticated && (
          <div className="mb-8">
            <Link 
              to="/upload-podcast" 
              className="upload-button"
            >
              Upload Your Own Podcast
            </Link>
          </div>
        )}

        {/* User Podcasts Section */}
        {filteredUserPodcasts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">User Uploaded Podcasts</h2>
            <div className="podcast-grid">
              {filteredUserPodcasts.map((podcast) => (
                <Link 
                  to={`/podcast/${podcast._id}`}
                  key={podcast._id} 
                  className="podcast-card"
                >
                  <img 
                    src={podcast.imageUrl} 
                    alt={podcast.title} 
                    className="podcast-image"
                    onError={handleImageError}
                  />
                  <div className="podcast-info">
                    <h2 className="podcast-title">{podcast.title}</h2>
                    <p className="podcast-author">by {podcast.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* iTunes Podcasts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-blue-400">iTunes Podcasts</h2>
          <div className="podcast-grid">
            {filteredItunesPodcasts.map((podcast) => {
              const title = podcast.title.label.split(' - ')[0];
              return (
                <Link 
                  to={`/podcast/${podcast.id.attributes['im:id']}`}
                  key={podcast.id.attributes['im:id']} 
                  className="podcast-card"
                >
                  <img 
                    src={podcast['im:image'][2].label} 
                    alt={podcast.title.label} 
                    className="podcast-image"
                    onError={handleImageError}
                  />
                  <div className="podcast-info">
                    <h2 className="podcast-title">{title}</h2>
                    <p className="podcast-author">by {podcast['im:artist'].label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
