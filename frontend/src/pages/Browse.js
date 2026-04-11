import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

function Browse() {
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchListings();
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
      if (!token) {
        window.location.href = '/login';
        return;
      }
      await axios.post(`${API_URL}/food/accept`, { listing_id }, {
        headers: { authorization: token }
      });
      setMessage('Listing claimed successfully!');
      fetchListings();
    } catch (err) {
      setMessage('Error claiming listing.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: '#F97316', fontSize: '24px', fontWeight: '700', margin: 0 }}>SevaBite</h1>
        </a>
        <a href="/donate" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '500' }}>Donate Food</a>
      </nav>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '1.5rem', color: '#1a1a1a' }}>Available Food Nearby</h2>
        {message && <p style={{ color: '#16A34A', marginBottom: '1rem' }}>{message}</p>}
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p style={{ fontSize: '18px' }}>No listings available right now.</p>
            <a href="/donate">
              <button style={{ marginTop: '1rem', padding: '10px 24px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Be the first to donate!
              </button>
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {listings.map(listing => (
              <div key={listing.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>{listing.item_name}</h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>Quantity: {listing.quantity}</p>
                <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '14px' }}>
                  Expires: {new Date(listing.expiry_time).toLocaleString()}
                </p>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: '#dcfce7', color: '#16A34A', borderRadius: '20px', fontSize: '13px', marginBottom: '1rem' }}>
                  {listing.status}
                </span>
                <br />
                <button onClick={() => handleClaim(listing.id)}
                  style={{ width: '100%', padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
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