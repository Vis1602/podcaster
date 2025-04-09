import React, { useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';

function Header() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Don't show header on login and register pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo Section */}
                <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center space-x-2">
                    <img 
                        src="/logo.png" 
                        alt="Podcaster Logo"
                        className="header-logo"
                    />
                </Link>

                {/* Navigation Links */}
                <nav className="header-nav">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/home"
                                className="header-link"
                            >
                                Home
                            </Link>
                            <Link
                                to="/upload-podcast"
                                className="header-link"
                            >
                                Upload
                            </Link>
                            <Link
                                to="/about"
                                className="header-link"
                            >
                                About
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="header-button header-button-danger"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/about"
                                className="header-link"
                            >
                                About
                            </Link>
                            <Link
                                to="/login"
                                className="header-button header-button-primary"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
