import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import HomePage from './pages/HomePage';
import PodcastDetailsPage from './pages/PodcastDetailsPage';
import EpisodeDetailsPage from './pages/EpisodeDetailsPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token'); // Remove expired token
            return <Navigate to="/login" />;
        }
    } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token'); // Remove invalid token
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="/podcast/:podcastId" element={<PodcastDetailsPage />} />
                <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodeDetailsPage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </Router>
    );
}

export default App;