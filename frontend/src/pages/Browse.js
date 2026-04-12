import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

function Browse() {
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_URL}/food/nearby`);
      setListings(res.data);
    } catch (err) {
      setMessage('Error fetching listings.');
    }
  };

  const handleClaim = async (listing_id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { window.location.href = '/login'; return; }
      await axios.post(`${API_URL}/food/accept`, { listing_id }, {
        headers: { authorization: token }
      });
      setMessage('Listing claimed successfully!');
      fetchListings();
    } catch (err) {
      setMessage('Error claiming listing.');
    }
  };

  const getTimeLeft = (expiry) => {
    const diff = new Date(expiry) - new Date();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 0) return hours + 'h ' + mins + 'm left';
    return mins + 'm left';
  };

  const getUrgencyColor = (expiry) => {
    const diff = new Date(expiry) - new Date();
    const hours = diff / 3600000;
    if (hours < 1) return '#dc2626';
    if (hours < 3) return '#F97316';
    return '#16A34A';
  };

  const openMaps = (lat, lng) => {
    window.open('https://www.google.com/maps?q=' + lat + ',' + lng, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      <nav style={{
        background: 'white', padding: '1rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🍱</span>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#F97316' }}>SevaBite</span>
        </a>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/donate" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '600' }}>Donate Food</a>
          <a href="/volunteer" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Volunteer</a>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
            Available Food Nearby
          </h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            {listings.length} listing{listings.length !== 1 ? 's' : ''} available right now
          </p>
        </div>

        {message && (
          <div style={{
            background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
            color: message.includes('Error') ? '#dc2626' : '#16A34A',
            padding: '12px', borderRadius: '8px', marginBottom: '1rem',
            fontWeight: '500'
          }}>{message}</div>
        )}

        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
            <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🍱</div>
            <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '0.5rem' }}>No listings available right now</p>
            <p style={{ marginBottom: '2rem' }}>Be the first to donate food in your area!</p>
            <a href="/donate">
              <button style={{
                padding: '12px 28px', background: '#F97316', color: 'white',
                border: 'none', borderRadius: '25px', cursor: 'pointer',
                fontWeight: '700', fontSize: '16px'
              }}>Donate Food Now</button>
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {listings.map((listing) => (
              <div key={listing.id} style={{
                background: 'white', borderRadius: '16px', padding: '1.5rem',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0',
                borderTop: '4px solid ' + getUrgencyColor(listing.expiry_time)
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                    {listing.item_name}
                  </h3>
                  <span style={{
                    background: '#f0fdf4', color: '#16A34A',
                    padding: '3px 10px', borderRadius: '12px',
                    fontSize: '12px', fontWeight: '600'
                  }}>Available</span>
                </div>

                <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '15px' }}>
                  Quantity: {listing.quantity}
                </p>

                {listing.address && (
                  <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '14px' }}>
                    Address: {listing.address}
                  </p>
                )}

                <p style={{
                  color: getUrgencyColor(listing.expiry_time),
                  fontWeight: '600', fontSize: '14px', marginBottom: '1rem'
                }}>
                  Expires: {getTimeLeft(listing.expiry_time)}
                </p>

                {listing.lat && listing.lng && (
                  <button
                    onClick={() => openMaps(listing.lat, listing.lng)}
                    style={{
                      width: '100%', padding: '8px', background: '#f0fdf4',
                      color: '#16A34A', border: '1px solid #16A34A',
                      borderRadius: '8px', cursor: 'pointer',
                      fontWeight: '600', fontSize: '14px', marginBottom: '0.75rem'
                    }}
                  >
                    Open in Google Maps
                  </button>
                )}

                <button
                  onClick={() => handleClaim(listing.id)}
                  style={{
                    width: '100%', padding: '10px', background: '#F97316',
                    color: 'white', border: 'none', borderRadius: '8px',
                    cursor: 'pointer', fontWeight: '700', fontSize: '15px'
                  }}
                >
                  Claim This Food
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;