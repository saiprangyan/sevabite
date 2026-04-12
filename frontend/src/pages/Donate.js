import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Donate() {
  const [form, setForm] = useState({ item_name: '', quantity: '', expiry_time: '', lat: '', lng: '', address: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      setLoading(true);
      await axios.post(`${API_URL}/food/upload`, form, {
        headers: { authorization: token }
      });
      setMessage('Food listed successfully!');
      setForm({ item_name: '', quantity: '', expiry_time: '', lat: '', lng: '', address: '' });
    } catch (err) {
      setMessage('Error posting listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        const address = data.display_name || `${lat}, ${lng}`;
        setForm({ ...form, lat, lng, address });
      } catch (err) {
        setForm({ ...form, lat, lng });
      }
    });
  };

  const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '1rem',
    borderRadius: '8px', border: '1px solid #ddd',
    boxSizing: 'border-box', fontSize: '15px', outline: 'none'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff5f0', fontFamily: 'Segoe UI, sans-serif' }}>
      <nav style={{
        background: 'white', padding: '1rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🍱</span>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#F97316' }}>SevaBite</span>
        </a>
        <a href="/browse" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '600' }}>Browse Food</a>
      </nav>

      <div style={{ maxWidth: '520px', margin: '3rem auto', background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>🍱</div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>Donate Food</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Fill in the details of the food you want to donate</p>
        </div>

        {message && (
          <div style={{
            background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
            color: message.includes('Error') ? '#dc2626' : '#16A34A',
            padding: '12px', borderRadius: '8px', marginBottom: '1rem',
            fontWeight: '500', textAlign: 'center'
          }}>{message}</div>
        )}

        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Food Item Name</label>
        <input
          type="text" placeholder="e.g. Biryani, Bread, Vegetables"
          value={form.item_name} onChange={e => setForm({ ...form, item_name: e.target.value })}
          style={inputStyle}
        />

        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Quantity</label>
        <input
          type="text" placeholder="e.g. 5kg, 20 plates, 10 packets"
          value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
          style={inputStyle}
        />

        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Expiry Time</label>
        <input
          type="datetime-local" value={form.expiry_time}
          onChange={e => setForm({ ...form, expiry_time: e.target.value })}
          style={inputStyle}
        />

        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Pickup Address</label>
        <input
          type="text" placeholder="Enter full pickup address"
          value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
          style={inputStyle}
        />

        <button onClick={getLocation} style={{
          width: '100%', padding: '10px', background: '#f0fdf4',
          color: '#16A34A', border: '2px solid #16A34A',
          borderRadius: '8px', marginBottom: '1rem', cursor: 'pointer',
          fontWeight: '600', fontSize: '15px'
        }}>
          📍 Auto-detect My Location
        </button>

        {form.lat && (
          <div style={{
            background: '#f0fdf4', padding: '10px', borderRadius: '8px',
            marginBottom: '1rem', fontSize: '13px', color: '#16A34A'
          }}>
            ✅ Location detected! Address auto-filled above.
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '14px', background: loading ? '#ccc' : '#F97316',
          color: 'white', border: 'none', borderRadius: '10px',
          fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 15px rgba(249,115,22,0.3)'
        }}>
          {loading ? 'Posting...' : '🍽️ Post Food Listing'}
        </button>
      </div>
    </div>
  );
}

export default Donate;