import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

function Volunteer() {
  const [listings, setListings] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAvailable();
    fetchMyPickups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAvailable = async () => {
    try {
      const res = await axios.get(`${API_URL}/pickup/available`, { headers: { authorization: token } });
      setListings(res.data);
    } catch (err) {
      setMessage('Error fetching listings.');
    }
  };

  const fetchMyPickups = async () => {
    try {
      const res = await axios.get(`${API_URL}/pickup/mine`, { headers: { authorization: token } });
      setMyPickups(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssign = async (listing_id) => {
    try {
      await axios.post(`${API_URL}/pickup/assign`, { listing_id }, { headers: { authorization: token } });
      setMessage('Pickup accepted!');
      fetchAvailable();
      fetchMyPickups();
    } catch (err) {
      setMessage('Error accepting pickup.');
    }
  };

  const handleStatusUpdate = async (pickup_id, status) => {
    try {
      await axios.patch(`${API_URL}/pickup/status`, { pickup_id, status }, { headers: { authorization: token } });
      setMessage(`Status updated to ${status}!`);
      fetchMyPickups();
    } catch (err) {
      setMessage('Error updating status.');
    }
  };

  const getAccentColor = (index) => {
    const colors = [
      'linear-gradient(90deg,#F97316,#fbbf24)',
      'linear-gradient(90deg,#16A34A,#4ade80)',
      'linear-gradient(90deg,#3B82F6,#818cf8)',
      'linear-gradient(90deg,#ef4444,#f87171)',
    ];
    return colors[index % colors.length];
  };

  const statusConfig = {
    assigned:  { label: '● Assigned',  bg: '#fff7ed', color: '#ea580c' },
    picked_up: { label: '● Picked Up', bg: '#eff6ff', color: '#2563eb' },
    delivered: { label: '✓ Delivered', bg: '#f0fdf4', color: '#16A34A' },
  };

  const cardStyle = {
    background: 'white', borderRadius: '16px', overflow: 'hidden',
    border: '1px solid #f0f0f0',
  };

  const btnStyle = (bg) => ({
    width: '100%', padding: '10px', background: bg, color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontWeight: '700', fontSize: '14px',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: 'white', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🍱</span>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#F97316' }}>SevaBite</span>
        </a>
        <a href="/browse" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>Browse Food</a>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #16A34A 100%)', padding: '2.5rem', color: 'white' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Volunteer Portal</h2>
        <p style={{ opacity: 0.88, fontSize: '15px' }}>Accept pickups, deliver food, make an impact in your community</p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '600' }}>
            📦 {listings.length} Available Pickup{listings.length !== 1 ? 's' : ''}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '600' }}>
            🚴 {myPickups.filter(p => p.status !== 'delivered').length} Active
          </div>
          <div style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '600' }}>
            ✅ {myPickups.filter(p => p.status === 'delivered').length} Delivered
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Message */}
        {message && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', marginBottom: '1.25rem',
            background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
            color: message.includes('Error') ? '#dc2626' : '#16A34A',
            border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`
          }}>
            {message.includes('Error') ? '❌ ' : '✅ '}{message}
          </div>
        )}

        {/* Available Pickups */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>Available Pickups</h2>
          {listings.length > 0 && (
            <span style={{ background: '#F97316', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '700' }}>
              {listings.length}
            </span>
          )}
        </div>

        {listings.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', color: '#888', marginBottom: '2.5rem', border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>📭</div>
            <p style={{ fontWeight: '600' }}>No pickups available right now</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {listings.map((listing, i) => (
              <div key={listing.id} style={cardStyle}>
                <div style={{ height: '6px', background: getAccentColor(i) }} />
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>{listing.item_name}</h3>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>📦 {listing.quantity}</p>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>👤 {listing.donor_name}</p>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '14px' }}>⏰ {new Date(listing.expiry_time).toLocaleString()}</p>
                  <button onClick={() => handleAssign(listing.id)} style={btnStyle('linear-gradient(135deg,#F97316,#ef4444)')}>
                    Accept Pickup
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Pickups */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>My Pickups</h2>
          {myPickups.length > 0 && (
            <span style={{ background: '#16A34A', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '700' }}>
              {myPickups.length}
            </span>
          )}
        </div>

        {myPickups.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', color: '#888', border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🚴</div>
            <p style={{ fontWeight: '600' }}>No active pickups yet</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Accept a pickup above to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem' }}>
            {myPickups.map((pickup, i) => {
              const sc = statusConfig[pickup.status] || {};
              return (
                <div key={pickup.id} style={cardStyle}>
                  <div style={{ height: '6px', background: getAccentColor(i) }} />
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>{pickup.item_name}</h3>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>📦 {pickup.quantity}</p>
                    <span style={{ display: 'inline-block', padding: '4px 12px', background: sc.bg, color: sc.color, borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '14px' }}>
                      {sc.label}
                    </span>
                    {pickup.status === 'assigned' && (
                      <button onClick={() => handleStatusUpdate(pickup.id, 'picked_up')} style={btnStyle('#3B82F6')}>
                        Mark Picked Up
                      </button>
                    )}
                    {pickup.status === 'picked_up' && (
                      <button onClick={() => handleStatusUpdate(pickup.id, 'delivered')} style={btnStyle('#16A34A')}>
                        Mark Delivered
                      </button>
                    )}
                    {pickup.status === 'delivered' && (
                      <div style={{ textAlign: 'center', color: '#16A34A', fontWeight: '700', fontSize: '14px', padding: '8px' }}>
                        🎉 Delivered! Thank you!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Volunteer;