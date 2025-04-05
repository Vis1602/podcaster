import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      
      try {
        // Decode the token to get user information
        const decodedToken = jwtDecode(token);
        setUser({
          id: decodedToken.id,
          email: decodedToken.email
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        // If token is invalid, clear it
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
      }
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 