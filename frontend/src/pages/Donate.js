import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Donate() {
  const [form, setForm] = useState({ item_name: '', quantity: '', expiry_time: '', lat: '', lng: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`${API_URL}/food/upload`, form, {
        headers: { authorization: token }
      });
      setMessage('Food listed successfully!');
      setForm({ item_name: '', quantity: '', expiry_time: '', lat: '', lng: '' });
    } catch (err) {
      setMessage('Error posting listing. Please try again.');
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm({ ...form, lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: '#F97316', fontSize: '24px', fontWeight: '700', margin: 0 }}>SevaBite</h1>
        </a>
      </nav>

      <div style={{ maxWidth: '480px', margin: '3rem auto', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '1.5rem', color: '#1a1a1a' }}>Donate Food</h2>
        {message && <p style={{ color: '#16A34A', marginBottom: '1rem' }}>{message}</p>}
        <input type="text" placeholder="Food item name" value={form.item_name} onChange={e => setForm({ ...form, item_name: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <input type="text" placeholder="Quantity (e.g. 5kg, 20 plates)" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <input type="datetime-local" value={form.expiry_time} onChange={e => setForm({ ...form, expiry_time: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <button onClick={getLocation}
          style={{ width: '100%', padding: '10px', background: '#16A34A', color: 'white', border: 'none', borderRadius: '8px', marginBottom: '1rem', cursor: 'pointer' }}>
          Use My Location
        </button>
        {form.lat && <p style={{ color: '#666', marginBottom: '1rem', fontSize: '14px' }}>Location: {form.lat}, {form.lng}</p>}
        <button onClick={handleSubmit}
          style={{ width: '100%', padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Post Listing
        </button>
      </div>
    </div>
  );
}

export default Donate;