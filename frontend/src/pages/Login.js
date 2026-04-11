import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '360px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h1 style={{ color: '#F97316', fontSize: '28px', fontWeight: '700', marginBottom: '0.25rem' }}>SevaBite</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Login to your account</p>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <button onClick={handleLogin}
          style={{ width: '100%', padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Login
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
          Don't have an account? <a href="/register" style={{ color: '#F97316' }}>Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;