import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <h1 style={{ color: '#F97316', fontSize: '24px', fontWeight: '700', margin: 0 }}>SevaBite</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="/browse" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '500' }}>Browse Food</a>
          <a href="/donate" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '500' }}>Donate Food</a>
          {user ? (
            <>
              <span style={{ color: '#666' }}>Hi, {user.name}</span>
              <button onClick={handleLogout}
                style={{ padding: '8px 16px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <a href="/login">
              <button style={{ padding: '8px 16px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Login
              </button>
            </a>
          )}
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
          Every bite, an act of <span style={{ color: '#F97316' }}>seva</span>
        </h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '2rem' }}>
          Connecting food donors with NGOs and volunteers to reduce waste and feed communities.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/donate">
            <button style={{ padding: '12px 28px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
              Donate Food
            </button>
          </a>
          <a href="/browse">
            <button style={{ padding: '12px 28px', background: '#16A34A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
              Browse Listings
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;