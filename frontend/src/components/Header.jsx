import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';

function Header() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
