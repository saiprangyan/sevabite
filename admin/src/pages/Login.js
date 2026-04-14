import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://sevabite-backend.onrender.com';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.user.role !== 'admin') {
        setError('Access denied. Admin only.');
        return;
      }
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        background: '#1a1a1a', padding: '2.5rem', borderRadius: '16px',
        width: '380px', border: '1px solid #333'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '40px' }}>🍱</span>
          <h1 style={{ color: '#F97316', fontSize: '24px', fontWeight: '800', margin: '0.5rem 0 0' }}>
            SevaBite Admin
          </h1>
          <p style={{ color: '#666', margin: '0.5rem 0 0', fontSize: '14px' }}>
            Restricted access — admins only
          </p>
        </div>

        {error && (
          <div style={{
            background: '#2a1a1a', color: '#f87171', padding: '10px',
            borderRadius: '8px', marginBottom: '1rem', fontSize: '14px',
            textAlign: 'center'
          }}>{error}</div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#aaa', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sevabite.com"
            style={{
              width: '100%', padding: '12px', background: '#252525',
              border: '1px solid #333', borderRadius: '8px', color: 'white',
              fontSize: '15px', boxSizing: 'border-box', outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#aaa', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: '100%', padding: '12px', background: '#252525',
              border: '1px solid #333', borderRadius: '8px', color: 'white',
              fontSize: '15px', boxSizing: 'border-box', outline: 'none'
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: '100%', padding: '14px', background: '#F97316',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '16px', fontWeight: '700', cursor: 'pointer'
          }}
        >
          Login to Admin Panel
        </button>
      </div>
    </div>
  );
}

export default Login;