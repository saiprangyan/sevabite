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

  const steps = [
    { label: 'Login', done: true },
    { label: 'Food Details', active: !!(form.item_name || form.quantity) },
    { label: 'Location', active: !!form.lat },
    { label: 'Submit', active: false },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff7f0', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: 'white', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🍱</span>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#F97316' }}>SevaBite</span>
        </a>
        <a href="/browse" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>Browse Food</a>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #F97316 0%, #ef4444 100%)', padding: '2.5rem', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: '44px', marginBottom: '10px' }}>🍱</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Donate Food</h2>
        <p style={{ opacity: 0.88, fontSize: '15px' }}>Every meal shared is a life touched — fill in the details below</p>
      </div>

      <div style={{ maxWidth: '520px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>

        {/* Step Tracker */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
          {['Login', 'Food Details', 'Location', 'Submit'].map((s, i) => {
            const isDone = i === 0;
            const isActive = (i === 1 && (form.item_name || form.quantity)) || (i === 2 && form.lat) || (i === 3 && loading);
            return (
              <div key={s} style={{
                flex: 1, textAlign: 'center', padding: '10px 6px', borderRadius: '10px',
                fontSize: '12px', fontWeight: '700',
                background: isDone ? '#f0fdf4' : isActive ? '#fff7ed' : '#f9fafb',
                color: isDone ? '#16A34A' : isActive ? '#ea580c' : '#aaa',
                border: isActive ? '1.5px solid #F97316' : '1.5px solid transparent',
              }}>
                {isDone ? '✓ ' : isActive ? '● ' : '○ '}{s}
              </div>
            );
          })}
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', marginBottom: '1.25rem', textAlign: 'center',
            background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
            color: message.includes('Error') ? '#dc2626' : '#16A34A',
            border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`
          }}>
            {message.includes('Error') ? '❌ ' : '✅ '}{message}
          </div>
        )}

        {/* Form Card */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #f0f0f0', boxShadow: '0 4px 24px rgba(249,115,22,0.08)' }}>

          {[
            { label: 'Food Item Name', key: 'item_name', type: 'text', placeholder: 'e.g. Biryani, Bread, Vegetables' },
            { label: 'Quantity', key: 'quantity', type: 'text', placeholder: 'e.g. 5kg, 20 plates, 10 packets' },
            { label: 'Expiry Time', key: 'expiry_time', type: 'datetime-local', placeholder: '' },
            { label: 'Pickup Address', key: 'address', type: 'text', placeholder: 'Enter full pickup address' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#F97316'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          ))}

          <button onClick={getLocation} style={{ width: '100%', padding: '11px', background: '#f0fdf4', color: '#16A34A', border: '1.5px solid #16A34A', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', marginBottom: '10px' }}>
            📍 Auto-detect My Location
          </button>

          {form.lat && (
            <div style={{ background: '#f0fdf4', color: '#16A34A', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
              ✅ Location detected! Address auto-filled above.
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '13px', background: loading ? '#ccc' : 'linear-gradient(135deg, #F97316, #ef4444)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⏳ Posting...' : '🍽️ Post Food Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Donate;