import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(response.data.token);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
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
                    Welcome Back
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
                
                <form onSubmit={handleLogin}>
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
                    
                    <div style={{ marginBottom: '25px' }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <label style={{ 
                                color: '#a0a0a0',
                                fontSize: '14px'
                            }}>
                                Password
                            </label>
                            <a href="#" style={{ 
                                color: '#4169E1', 
                                textDecoration: 'none',
                                fontSize: '14px'
                            }}>
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter your password"
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
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
                
                <div style={{ 
                    marginTop: '25px', 
                    textAlign: 'center',
                    color: '#a0a0a0',
                    fontSize: '14px'
                }}>
                    Don't have an account? <Link to="/register" style={{ 
                        color: '#4169E1', 
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
