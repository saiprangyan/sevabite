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
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') {
        window.location.href = 'https://sevabite-9nys.vercel.app';
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', width: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '40px' }}>🍱</span>
          <h1 style={{ color: '#F97316', fontSize: '24px', fontWeight: '800', margin: '0.5rem 0 0' }}>SevaBite</h1>
          <p style={{ color: '#666', margin: '0.5rem 0 0', fontSize: '14px' }}>Login to your account</p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', color: '#dc2626', padding: '10px',
            borderRadius: '8px', marginBottom: '1rem', fontSize: '14px', textAlign: 'center'
          }}>{error}</div>
        )}

        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Email</label>
        <input
          type="email" placeholder="Enter your email" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '15px' }}
        />

        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Password</label>
        <input
          type="password" placeholder="Enter your password" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '1.5rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '15px' }}
        />

        <button onClick={handleLogin} style={{
          width: '100%', padding: '12px', background: '#F97316', color: 'white',
          border: 'none', borderRadius: '10px', fontSize: '16px',
          fontWeight: '700', cursor: 'pointer', marginBottom: '1rem'
        }}>
          Login
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
          <span style={{ color: '#aaa', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
        </div>

        <a href="https://sevabite-9nys.vercel.app" target="_blank" rel="noopener noreferrer">
          <button style={{
            width: '100%', padding: '12px', background: '#1a1a1a', color: 'white',
            border: 'none', borderRadius: '10px', fontSize: '15px',
            fontWeight: '600', cursor: 'pointer'
          }}>
            🔐 Login as Admin
          </button>
        </a>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '14px' }}>
          Don't have an account? <a href="/register" style={{ color: '#F97316', fontWeight: '600' }}>Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;