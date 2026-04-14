import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const CLOUDINARY_CLOUD_NAME = 'dgbyma7jw';
const CLOUDINARY_UPLOAD_PRESET = 'sevabite_uploads';

function Donate() {
  const [form, setForm] = useState({ item_name: '', quantity: '', expiry_time: '', lat: '', lng: '', address: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoUrl('');
  };

  const uploadToCloudinary = async () => {
    if (!photoFile) return null;
    setPhotoUploading(true);
    try {
      const data = new FormData();
      data.append('file', photoFile);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      setPhotoUrl(result.secure_url);
      return result.secure_url;
    } catch (err) {
      setMessage('Error uploading photo. Please try again.');
      return null;
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      setLoading(true);

      let uploadedPhotoUrl = photoUrl;
      if (photoFile && !photoUrl) {
        uploadedPhotoUrl = await uploadToCloudinary();
        if (!uploadedPhotoUrl) { setLoading(false); return; }
      }

      await axios.post(`${API_URL}/food/upload`, { ...form, photo_url: uploadedPhotoUrl }, {
        headers: { authorization: token }
      });
      setMessage('Food listed successfully!');
      setForm({ item_name: '', quantity: '', expiry_time: '', lat: '', lng: '', address: '' });
      setPhotoFile(null);
      setPhotoPreview(null);
      setPhotoUrl('');
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

          {/* Photo Upload */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Food Photo (Optional)
            </label>
            {photoPreview ? (
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <img src={photoPreview} alt="preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', border: '1.5px solid #f0f0f0' }} />
                <button
                  onClick={() => { setPhotoFile(null); setPhotoPreview(null); setPhotoUrl(''); }}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}
                >✕</button>
                {photoUrl && (
                  <div style={{ marginTop: '6px', background: '#f0fdf4', color: '#16A34A', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                    ✅ Photo uploaded to Cloudinary!
                  </div>
                )}
                {photoUploading && (
                  <div style={{ marginTop: '6px', background: '#fff7ed', color: '#ea580c', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                    ⏳ Uploading photo...
                  </div>
                )}
              </div>
            ) : (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '130px', border: '2px dashed #fed7aa', borderRadius: '12px',
                background: '#fff7ed', cursor: 'pointer', color: '#F97316',
                fontSize: '14px', fontWeight: '600', gap: '8px'
              }}>
                <span style={{ fontSize: '32px' }}>📷</span>
                Click to upload a photo
                <span style={{ fontSize: '12px', color: '#aaa', fontWeight: '400' }}>JPG, PNG up to 5MB</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Other Fields */}
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
            disabled={loading || photoUploading}
            style={{ width: '100%', padding: '13px', background: (loading || photoUploading) ? '#ccc' : 'linear-gradient(135deg, #F97316, #ef4444)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: (loading || photoUploading) ? 'not-allowed' : 'pointer' }}
          >
            {photoUploading ? '📷 Uploading photo...' : loading ? '⏳ Posting...' : '🍽️ Post Food Listing'}
          </button>

        </div>
      </div>
    </div>
  );
}

export default Donate;