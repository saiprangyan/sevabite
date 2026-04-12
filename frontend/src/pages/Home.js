import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_URL from '../config';




function Home() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchLatestListings();
  }, []);

  const fetchLatestListings = async () => {
    try {
      const res = await axios.get(`${API_URL}/food/nearby`);
      setListings(res.data.slice(0, 3));
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 3rem', background: 'white',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', background: '#F97316',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '18px' }}>🍱</span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#F97316' }}>SevaBite</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="/" style={{ color: '#F97316', textDecoration: 'none', fontWeight: '600' }}>Home</a>
          <a href="#how-it-works" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>About</a>
          <a href="/donate" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Donate</a>
          <a href="/browse" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Request</a>
          <a href="/volunteer" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Volunteer</a>
          <a href="/map" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Map</a>
          {user ? (
            <>
              <span style={{ color: '#555', fontWeight: '500' }}>Hi, {user.name}!</span>
              <button onClick={handleLogout} style={{
                padding: '8px 20px', border: '2px solid #F97316', borderRadius: '25px',
                background: 'transparent', color: '#F97316', fontWeight: '600', cursor: 'pointer'
              }}>Logout</button>
            </>
          ) : (
            <>
              <a href="/login">
                <button style={{
                  padding: '8px 20px', border: '2px solid #F97316', borderRadius: '25px',
                  background: 'transparent', color: '#F97316', fontWeight: '600', cursor: 'pointer'
                }}>Login</button>
              </a>
              <a href="/register">
                <button style={{
                  padding: '8px 20px', border: 'none', borderRadius: '25px',
                  background: '#F97316', color: 'white', fontWeight: '600', cursor: 'pointer'
                }}>Sign Up</button>
              </a>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #fff5f0 0%, #fff 60%)',
        minHeight: '560px', display: 'flex', alignItems: 'center'
      }}>
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(249,115,22,0.15)', borderRadius: '50%', top: '-100px', left: '-100px' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(249,115,22,0.1)', borderRadius: '50%', bottom: '-80px', left: '200px' }} />
        <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(249,115,22,0.12)', borderRadius: '50%', top: '50px', right: '100px' }} />
        <div style={{ position: 'absolute', width: '120px', height: '120px', background: '#F97316', borderRadius: '50%', bottom: '-30px', right: '50px', opacity: 0.3 }} />

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '3rem 5rem', width: '100%', position: 'relative', zIndex: 1
        }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ maxWidth: '520px' }}>
            <div style={{
              display: 'inline-block', background: '#fff5f0', color: '#F97316',
              padding: '6px 16px', borderRadius: '20px', fontSize: '14px',
              fontWeight: '600', marginBottom: '1rem', border: '1px solid #fed7aa'
            }}>
              🌟 Fighting food waste, one meal at a time
            </div>
            <h1 style={{ fontSize: '52px', fontWeight: '900', lineHeight: '1.2', color: '#F97316', margin: '0 0 1rem' }}>
              Share Food,<br />Spread Happiness
            </h1>
            <p style={{ fontSize: '17px', color: '#666', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '420px' }}>
              Connecting surplus food with those in need. Every meal shared builds a stronger, hunger-free community.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/donate">
                <button style={{
                  padding: '14px 32px', background: '#F97316', color: 'white',
                  border: 'none', borderRadius: '30px', fontSize: '16px',
                  fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(249,115,22,0.4)'
                }}>🍽️ Donate Now</button>
              </a>
              <a href="/browse">
                <button style={{
                  padding: '14px 32px', background: '#16A34A', color: 'white',
                  border: 'none', borderRadius: '30px', fontSize: '16px',
                  fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(22,163,74,0.3)'
                }}>🙏 Request Food</button>
              </a>
            </div>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', background: '#fff5f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✅</div>
                <span style={{ color: '#555', fontSize: '14px', fontWeight: '500' }}>Free to use</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', background: '#fff5f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
                <span style={{ color: '#555', fontSize: '14px', fontWeight: '500' }}>Real-time alerts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', background: '#fff5f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤝</div>
                <span style={{ color: '#555', fontSize: '14px', fontWeight: '500' }}>Community driven</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            style={{ width: '420px', height: '400px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src={require('../hero.png')}
              alt="Volunteers sharing food"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </motion.div>
        </div>
      </div>

      {/* LIVE LISTINGS SECTION */}
      {listings.length > 0 && (
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ padding: '3rem 5rem', background: '#fff' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
              🔴 Live Food Listings
            </h2>
            <a href="/browse" style={{
              color: '#F97316', textDecoration: 'none', fontWeight: '600',
              fontSize: '15px', border: '2px solid #F97316', padding: '8px 20px', borderRadius: '20px'
            }}>View All →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'white', borderRadius: '16px', padding: '1.5rem',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0',
                  borderLeft: '4px solid #F97316'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{listing.item_name}</h3>
                  <span style={{ background: '#dcfce7', color: '#16A34A', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Available</span>
                </div>
                <p style={{ color: '#666', fontSize: '14px', margin: '0.5rem 0' }}>📦 {listing.quantity}</p>
                <p style={{ color: '#999', fontSize: '13px', margin: '0.5rem 0' }}>
                  ⏰ Expires: {new Date(listing.expiry_time).toLocaleString()}
                </p>
                <a href="/browse">
                  <button style={{
                    width: '100%', marginTop: '0.75rem', padding: '8px',
                    background: '#F97316', color: 'white', border: 'none',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
                  }}>Claim This Food</button>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* HOW IT WORKS */}
      <motion.div
        id="how-it-works"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        style={{ padding: '4rem 5rem', background: '#f8fafc' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#F97316', fontWeight: '600', marginBottom: '0.5rem' }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
            Simple steps to make a difference
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { icon: '🤲', title: 'Donate Food', desc: 'Donors post surplus food listings with details, quantity, and pickup location in minutes.', color: '#fff5f0' },
            { icon: '🚚', title: 'Collect & Deliver', desc: 'Volunteers pick up food from donors and deliver it directly to NGOs and those in need.', color: '#f0fdf4' },
            { icon: '🏘️', title: 'Distribute Hope', desc: 'NGOs and receivers claim food listings and distribute meals to hungry communities.', color: '#eff6ff' }
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
              style={{
                background: 'white', borderRadius: '16px', padding: '2rem',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0',
                cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              <div style={{
                width: '64px', height: '64px', background: card.color,
                borderRadius: '16px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '32px', marginBottom: '1.5rem'
              }}>{card.icon}</div>
              <div style={{
                width: '28px', height: '28px', background: '#F97316', color: 'white',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '13px', fontWeight: '700',
                marginBottom: '0.75rem'
              }}>{i + 1}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '0.75rem', color: '#1a1a1a' }}>{card.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ROLES SECTION */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        style={{ padding: '4rem 5rem', background: 'white' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#F97316', fontWeight: '600', marginBottom: '0.5rem' }}>JOIN US</div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
            Who can use SevaBite?
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { icon: '👨‍🍳', title: 'Donors', desc: 'Restaurants, hotels, households with surplus food. Post listings in 2 minutes.', link: '/register', btn: 'Start Donating', color: '#F97316' },
            { icon: '🏥', title: 'NGOs & Receivers', desc: 'Organizations and individuals in need. Browse and claim food listings nearby.', link: '/register', btn: 'Request Food', color: '#16A34A' },
            { icon: '🛵', title: 'Volunteers', desc: 'Help pick up and deliver food from donors to receivers. Make a real difference.', link: '/register', btn: 'Volunteer Now', color: '#3B82F6' }
          ].map((role, i) => (
            <div key={i} style={{
              background: '#f8fafc', borderRadius: '16px', padding: '2rem',
              textAlign: 'center', border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>{role.icon}</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '0.75rem', color: '#1a1a1a' }}>{role.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '1.5rem' }}>{role.desc}</p>
              <a href={role.link}>
                <button style={{
                  padding: '10px 24px', background: role.color, color: 'white',
                  border: 'none', borderRadius: '25px', fontWeight: '600',
                  cursor: 'pointer', fontSize: '15px'
                }}>{role.btn}</button>
              </a>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA SECTION */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        style={{
          background: 'linear-gradient(135deg, #F97316, #ea6c0a)',
          padding: '5rem', textAlign: 'center', color: 'white'
        }}
      >
        <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '1rem' }}>
          Ready to make a difference?
        </h2>
        <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
          Join donors, volunteers and NGOs on SevaBite today. Every bite is an act of seva.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/register">
            <button style={{
              padding: '14px 40px', background: 'white', color: '#F97316',
              border: 'none', borderRadius: '30px', fontSize: '16px',
              fontWeight: '700', cursor: 'pointer'
            }}>Get Started Free</button>
          </a>
          <a href="/browse">
            <button style={{
              padding: '14px 40px', background: 'transparent', color: 'white',
              border: '2px solid white', borderRadius: '30px', fontSize: '16px',
              fontWeight: '700', cursor: 'pointer'
            }}>Browse Food</button>
          </a>
        </div>
      </motion.div>

      {/* FOOTER */}
      <footer style={{
        background: '#1a1a1a', color: '#aaa',
        padding: '2.5rem 5rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🍱</span>
          <span style={{ color: '#F97316', fontWeight: '800', fontSize: '20px' }}>SevaBite</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px' }}>© 2025 SevaBite. Every bite, an act of seva.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/donate" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Donate</a>
          <a href="/browse" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Browse</a>
          <a href="/volunteer" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Volunteer</a>
        </div>
      </footer>

    </div>
  );
}

export default Home;