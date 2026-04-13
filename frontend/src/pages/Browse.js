import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

function Browse() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings, filter, search]);

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
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };

  const getUrgency = (expiry) => {
    const hours = (new Date(expiry) - new Date()) / 3600000;
    if (hours < 1) return 'urgent';
    if (hours < 3) return 'soon';
    return 'fresh';
  };

  const openMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const applyFilters = () => {
    let result = [...listings];
    if (filter === 'Urgent') result = result.filter(l => getUrgency(l.expiry_time) === 'urgent');
    else if (filter === 'Expiring Soon') result = result.filter(l => getUrgency(l.expiry_time) === 'soon');
    else if (filter === 'Fresh') result = result.filter(l => getUrgency(l.expiry_time) === 'fresh');
    if (search.trim()) {
      result = result.filter(l =>
        l.item_name.toLowerCase().includes(search.toLowerCase()) ||
        (l.address && l.address.toLowerCase().includes(search.toLowerCase()))
      );
    }
    setFiltered(result);
  };

  const urgentCount = listings.filter(l => getUrgency(l.expiry_time) === 'urgent').length;

  const styles = {
    page: { minHeight: '100vh', background: '#f0fdf4', fontFamily: 'Segoe UI, sans-serif' },

    // Nav
    nav: { background: 'white', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' },
    navBrand: { textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' },
    navBrandText: { fontSize: '22px', fontWeight: '800', color: '#F97316' },
    navLinks: { display: 'flex', gap: '1.5rem', alignItems: 'center' },

    // Hero
    heroBar: { background: 'linear-gradient(135deg, #16A34A 0%, #F97316 100%)', padding: '2.5rem 2.5rem 2rem', color: 'white' },
    heroTitle: { fontSize: '30px', fontWeight: '800', marginBottom: '6px' },
    heroSub: { fontSize: '15px', opacity: 0.88 },
    statsRow: { display: 'flex', gap: '12px', marginTop: '1.5rem', flexWrap: 'wrap' },
    statPill: { background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '600', color: 'white' },

    // Body
    body: { maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' },

    // Filters
    filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' },

    // Search
    searchRow: { display: 'flex', gap: '10px', marginBottom: '2rem' },
    searchInput: { flex: 1, padding: '11px 16px', borderRadius: '12px', border: '1.5px solid #d1fae5', fontSize: '14px', background: 'white', outline: 'none', color: '#1a1a1a' },

    // Grid
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))', gap: '1.25rem' },

    // Card
    card: { background: 'white', borderRadius: '18px', overflow: 'hidden', border: '1px solid #f0f0f0', transition: 'transform 0.18s, box-shadow 0.18s', cursor: 'default' },
    cardBody: { padding: '1.25rem' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
    cardTitle: { fontSize: '17px', fontWeight: '700', color: '#1a1a1a' },
    metaRow: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555' },

    // Buttons
    btnMap: { width: '100%', padding: '10px', background: '#f0fdf4', color: '#16A34A', border: '1.5px solid #16A34A', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', marginBottom: '8px' },
    btnClaim: { width: '100%', padding: '11px', background: 'linear-gradient(135deg, #F97316, #ef4444)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },

    // Empty state
    empty: { textAlign: 'center', padding: '5rem 2rem', color: '#888' },
  };

  const getTopBarColor = (urgency) => {
    if (urgency === 'urgent') return 'linear-gradient(90deg, #dc2626, #f87171)';
    if (urgency === 'soon') return 'linear-gradient(90deg, #F97316, #fbbf24)';
    return 'linear-gradient(90deg, #16A34A, #4ade80)';
  };

  const getExpiryStyle = (urgency) => {
    if (urgency === 'urgent') return { background: '#fef2f2', color: '#dc2626', fontWeight: '700', fontSize: '13px', padding: '5px 12px', borderRadius: '8px', display: 'inline-block', marginBottom: '14px' };
    if (urgency === 'soon') return { background: '#fff7ed', color: '#ea580c', fontWeight: '700', fontSize: '13px', padding: '5px 12px', borderRadius: '8px', display: 'inline-block', marginBottom: '14px' };
    return { background: '#f0fdf4', color: '#16A34A', fontWeight: '700', fontSize: '13px', padding: '5px 12px', borderRadius: '8px', display: 'inline-block', marginBottom: '14px' };
  };

  const getPillStyle = (label) => ({
    padding: '7px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
    border: '1.5px solid',
    borderColor: filter === label ? '#16A34A' : '#d1fae5',
    background: filter === label ? '#16A34A' : 'white',
    color: filter === label ? 'white' : '#16A34A',
    fontWeight: '600',
  });

  return (
    <div style={styles.page}>

      {/* Nav */}
      <nav style={styles.nav}>
        <a href="/" style={styles.navBrand}>
          <span style={{ fontSize: '24px' }}>🍱</span>
          <span style={styles.navBrandText}>SevaBite</span>
        </a>
        <div style={styles.navLinks}>
          <a href="/donate" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '600' }}>Donate Food</a>
          <a href="/volunteer" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Volunteer</a>
        </div>
      </nav>

      {/* Hero Bar */}
      <div style={styles.heroBar}>
        <h2 style={styles.heroTitle}>Available Food Nearby</h2>
        <p style={styles.heroSub}>Help rescue food and feed those in need — claim a listing below</p>
        <div style={styles.statsRow}>
          <div style={styles.statPill}>🟢 {listings.length} Active Listing{listings.length !== 1 ? 's' : ''}</div>
          {urgentCount > 0 && <div style={styles.statPill}>⚡ {urgentCount} Expiring Soon</div>}
        </div>
      </div>

      <div style={styles.body}>

        {/* Filter Pills */}
        <div style={styles.filterRow}>
          {['All', 'Urgent', 'Expiring Soon', 'Fresh'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={getPillStyle(f)}>{f}</button>
          ))}
        </div>

        {/* Search */}
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search by food name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

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

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🍱</div>
            <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '0.5rem', color: '#1a1a1a' }}>No listings found</p>
            <p style={{ marginBottom: '2rem', color: '#888' }}>
              {search || filter !== 'All' ? 'Try a different filter or search term.' : 'Be the first to donate food in your area!'}
            </p>
            <a href="/donate">
              <button style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#F97316,#ef4444)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>
                Donate Food Now
              </button>
            </a>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((listing) => {
              const urgency = getUrgency(listing.expiry_time);
              return (
                <div key={listing.id} style={styles.card}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Urgency top bar */}
                  <div style={{ height: '8px', background: getTopBarColor(urgency) }} />

                  <div style={styles.cardBody}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>{listing.item_name}</h3>
                      <span style={{ background: '#f0fdf4', color: '#16A34A', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                        Available
                      </span>
                    </div>

                    <div style={styles.metaRow}>
                      <div style={styles.metaItem}><span>📦</span> {listing.quantity}</div>
                      {listing.address && <div style={styles.metaItem}><span>📍</span> {listing.address}</div>}
                    </div>

                    <div style={getExpiryStyle(urgency)}>
                      ⏰ {getTimeLeft(listing.expiry_time)}
                    </div>

                    {listing.lat && listing.lng && (
                      <button onClick={() => openMaps(listing.lat, listing.lng)} style={styles.btnMap}>
                        Open in Google Maps
                      </button>
                    )}

                    <button onClick={() => handleClaim(listing.id)} style={styles.btnClaim}>
                      Claim This Food
                    </button>
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

export default Browse;