import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const API_URL = 'https://sevabite-backend.onrender.com';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalPickups: 0,
    totalDelivered: 0
  });
  

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) window.location.href = '/';
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_URL}/admin/stats`, {
        headers: { authorization: token }
      });
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#3B82F6' },
    { label: 'Food Listings', value: stats.totalListings, icon: '🍱', color: '#F97316' },
    { label: 'Total Pickups', value: stats.totalPickups, icon: '🚚', color: '#8B5CF6' },
    { label: 'Delivered', value: stats.totalDelivered, icon: '✅', color: '#16A34A' },
  ];

  return (
    <div style={{ display: 'flex', fontFamily: 'Segoe UI, sans-serif', background: '#0f0f0f', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Welcome back, Admin</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map((card, i) => (
            <div key={i} style={{
              background: '#1a1a1a', borderRadius: '16px', padding: '1.5rem',
              border: '1px solid #333'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: '#666', fontSize: '13px', margin: '0 0 0.5rem', fontWeight: '600' }}>
                    {card.label}
                  </p>
                  <p style={{ color: 'white', fontSize: '32px', fontWeight: '800', margin: 0 }}>
                    {card.value}
                  </p>
                </div>
                <div style={{
                  width: '48px', height: '48px', background: card.color + '20',
                  borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '24px'
                }}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: '#1a1a1a', borderRadius: '16px', padding: '2rem',
          border: '1px solid #333', textAlign: 'center', color: '#666'
        }}>
          <p style={{ fontSize: '18px', margin: 0 }}>
            Use the sidebar to manage users, listings and pickups
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;