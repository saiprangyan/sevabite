import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Volunteer() {
  const [listings, setListings] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAvailable();
    fetchMyPickups();
  }, []);

  const fetchAvailable = async () => {
    try {
      const res = await axios.get('http://localhost:5000/pickup/available', {
        headers: { authorization: token }
      });
      setListings(res.data);
    } catch (err) {
      setMessage('Error fetching listings.');
    }
  };

  const fetchMyPickups = async () => {
    try {
      const res = await axios.get('http://localhost:5000/pickup/mine', {
        headers: { authorization: token }
      });
      setMyPickups(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssign = async (listing_id) => {
    try {
      await axios.post('http://localhost:5000/pickup/assign', { listing_id }, {
        headers: { authorization: token }
      });
      setMessage('Pickup accepted!');
      fetchAvailable();
      fetchMyPickups();
    } catch (err) {
      setMessage('Error accepting pickup.');
    }
  };

  const handleStatusUpdate = async (pickup_id, status) => {
    try {
      await axios.patch('http://localhost:5000/pickup/status', { pickup_id, status }, {
        headers: { authorization: token }
      });
      setMessage(`Status updated to ${status}!`);
      fetchMyPickups();
    } catch (err) {
      setMessage('Error updating status.');
    }
  };

  const statusColor = (status) => {
    if (status === 'assigned') return '#F97316';
    if (status === 'picked_up') return '#3B82F6';
    if (status === 'delivered') return '#16A34A';
    return '#666';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: '#F97316', fontSize: '24px', fontWeight: '700', margin: 0 }}>SevaBite</h1>
        </a>
        <a href="/browse" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '500' }}>Browse Food</a>
      </nav>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        {message && <p style={{ color: '#16A34A', marginBottom: '1rem' }}>{message}</p>}

        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '1rem', color: '#1a1a1a' }}>Available Pickups</h2>
        {listings.length === 0 ? (
          <p style={{ color: '#666', marginBottom: '2rem' }}>No pickups available right now.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {listings.map(listing => (
              <div key={listing.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.5rem' }}>{listing.item_name}</h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>Quantity: {listing.quantity}</p>
                <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '14px' }}>Donor: {listing.donor_name}</p>
                <p style={{ color: '#666', marginBottom: '1rem', fontSize: '14px' }}>
                  Expires: {new Date(listing.expiry_time).toLocaleString()}
                </p>
                <button onClick={() => handleAssign(listing.id)}
                  style={{ width: '100%', padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                  Accept Pickup
                </button>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '1rem', color: '#1a1a1a' }}>My Pickups</h2>
        {myPickups.length === 0 ? (
          <p style={{ color: '#666' }}>You have no active pickups.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {myPickups.map(pickup => (
              <div key={pickup.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.5rem' }}>{pickup.item_name}</h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>Quantity: {pickup.quantity}</p>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: statusColor(pickup.status), color: 'white', borderRadius: '20px', fontSize: '13px', marginBottom: '1rem' }}>
                  {pickup.status}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {pickup.status === 'assigned' && (
                    <button onClick={() => handleStatusUpdate(pickup.id, 'picked_up')}
                      style={{ flex: 1, padding: '8px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      Mark Picked Up
                    </button>
                  )}
                  {pickup.status === 'picked_up' && (
                    <button onClick={() => handleStatusUpdate(pickup.id, 'delivered')}
                      style={{ flex: 1, padding: '8px', background: '#16A34A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      Mark Delivered
                    </button>
                  )}
                  {pickup.status === 'delivered' && (
                    <p style={{ color: '#16A34A', fontWeight: '500' }}>✅ Delivered!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Volunteer;