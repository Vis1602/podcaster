import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import PodcastDetailsPage from './pages/PodcastDetailsPage';
import EpisodeDetailsPage from './pages/EpisodeDetailsPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import UploadPodcastPage from './pages/UploadPodcastPage';
import AddEpisodePage from './pages/AddEpisodePage';

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
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/upload-podcast" element={
                        <ProtectedRoute>
                            <UploadPodcastPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/podcast/:podcastId" element={
                        <ProtectedRoute>
                            <PodcastDetailsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/podcast/:podcastId/episode/:episodeId" element={
                        <ProtectedRoute>
                            <EpisodeDetailsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/podcast/:podcastId/add-episode" element={
                        <ProtectedRoute>
                            <AddEpisodePage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;