import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config/config';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post(`${config.apiUrl}/api/auth/register`, { email, password });
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            if (err.code === 'ECONNABORTED') {
                setError('Request timed out. Please check your internet connection.');
            } else if (err.code === 'ERR_NETWORK') {
                setError('Network error. Please check if the server is running.');
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            backgroundColor: '#121212', 
            color: 'white', 
            minHeight: '100vh', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'rgba(30, 30, 30, 0.9)',
                borderRadius: '10px',
                padding: '30px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 8px 32px rgba(0, 0, 255, 0.2)'
            }}>
                <h1 style={{ 
                    color: '#4169E1', 
                    textAlign: 'center',
                    marginBottom: '30px',
                    fontSize: '28px',
                    fontWeight: 'bold'
                }}>
                    Create Account
                </h1>
                
                {error && (
                    <div style={{ 
                        backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                        color: '#ff6b6b', 
                        padding: '10px', 
                        borderRadius: '5px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px',
                            color: '#a0a0a0',
                            fontSize: '14px'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ 
                                display: 'block', 
                                width: '100%', 
                                padding: '12px 15px',
                                backgroundColor: '#2a2a2a',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '5px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4169E1'}
                            onBlur={(e) => e.target.style.borderColor = '#444'}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px',
                            color: '#a0a0a0',
                            fontSize: '14px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ 
                                display: 'block', 
                                width: '100%', 
                                padding: '12px 15px',
                                backgroundColor: '#2a2a2a',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '5px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4169E1'}
                            onBlur={(e) => e.target.style.borderColor = '#444'}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px',
                            color: '#a0a0a0',
                            fontSize: '14px'
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ 
                                display: 'block', 
                                width: '100%', 
                                padding: '12px 15px',
                                backgroundColor: '#2a2a2a',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '5px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4169E1'}
                            onBlur={(e) => e.target.style.borderColor = '#444'}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#2a4080' : '#4169E1',
                            color: 'white',
                            padding: '14px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            width: '100%',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s',
                            boxShadow: '0 4px 12px rgba(65, 105, 225, 0.3)'
                        }}
                        onMouseOver={(e) => {
                            if (!loading) e.target.style.backgroundColor = '#3154c4'
                        }}
                        onMouseOut={(e) => {
                            if (!loading) e.target.style.backgroundColor = '#4169E1'
                        }}
                    >
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
                
                <div style={{ 
                    marginTop: '25px', 
                    textAlign: 'center',
                    color: '#a0a0a0',
                    fontSize: '14px'
                }}>
                    Already have an account? <Link to="/login" style={{ 
                        color: '#4169E1', 
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
