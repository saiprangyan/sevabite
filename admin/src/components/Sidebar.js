import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/listings', label: 'Listings', icon: '🍱' },
    { path: '/pickups', label: 'Pickups', icon: '🚚' },
  ];

  return (
    <div style={{
      width: '240px', minHeight: '100vh', background: '#1a1a1a',
      display: 'flex', flexDirection: 'column', position: 'fixed',
      left: 0, top: 0, zIndex: 100
    }}>
      <div style={{
        padding: '1.5rem', borderBottom: '1px solid #333',
        display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <span style={{ fontSize: '24px' }}>🍱</span>
        <div>
          <div style={{ color: '#F97316', fontWeight: '800', fontSize: '16px' }}>SevaBite</div>
          <div style={{ color: '#666', fontSize: '12px' }}>Admin Panel</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 1.5rem', cursor: 'pointer',
              background: location.pathname === item.path ? '#F97316' : 'transparent',
              color: location.pathname === item.path ? 'white' : '#aaa',
              fontWeight: location.pathname === item.path ? '600' : '400',
              fontSize: '15px', transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid #333' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '10px', background: '#333',
            color: '#aaa', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontWeight: '600', fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;