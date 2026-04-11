import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError('Registration failed. Email may already exist.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '360px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h1 style={{ color: '#F97316', fontSize: '28px', fontWeight: '700', marginBottom: '0.25rem' }}>SevaBite</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Create your account</p>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
          <option value="donor">Donor</option>
          <option value="receiver">Receiver / NGO</option>
          <option value="volunteer">Volunteer</option>
        </select>
        <button onClick={handleRegister}
          style={{ width: '100%', padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Register
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
          Already have an account? <a href="/login" style={{ color: '#F97316' }}>Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;