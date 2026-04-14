import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const API_URL = 'https://sevabite-backend.onrender.com';

function Pickups() {
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) window.location.href = '/';
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_URL}/admin/pickups`, {
        headers: { authorization: token }
      });
      setPickups(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const statusColor = (status) => {
    if (status === 'assigned') return '#F97316';
    if (status === 'picked_up') return '#3B82F6';
    if (status === 'delivered') return '#16A34A';
    return '#666';
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Segoe UI, sans-serif', background: '#0f0f0f', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', margin: 0 }}>Pickups</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{pickups.length} total pickups</p>
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '16px', border: '1px solid #333', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                {['Food Item', 'Volunteer', 'Status', 'Created'].map((h) => (
                  <th key={h} style={{
                    padding: '1rem 1.5rem', textAlign: 'left',
                    color: '#666', fontSize: '13px', fontWeight: '600'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pickups.map((pickup) => (
                <tr key={pickup.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: '500' }}>
                    {pickup.item_name || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#aaa', fontSize: '14px' }}>
                    {pickup.volunteer_name || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      background: statusColor(pickup.status) + '20',
                      color: statusColor(pickup.status),
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '600'
                    }}>{pickup.status}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#666', fontSize: '13px' }}>
                    {new Date(pickup.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Pickups;