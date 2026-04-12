import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import API_URL from '../config';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapView() {
  const [listings, setListings] = useState([]);
  const [center, setCenter] = useState([20.5937, 78.9629]);

  useEffect(() => {
    fetchListings();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_URL}/food/nearby`);
      setListings(res.data.filter((l) => l.lat && l.lng));
    } catch (err) {
      console.log(err);
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
          <a href="/browse" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: '600' }}>Browse Food</a>
          <a href="/donate" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Donate Food</a>
        </div>
      </nav>

      <div style={{ padding: '1.5rem 3rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
            Food Map
          </h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            {listings.length} listing{listings.length !== 1 ? 's' : ''} on map
          </p>
        </div>

        <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: '600px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap contributors'
            />
            {listings.map((listing) => (
              <Marker key={listing.id} position={[listing.lat, listing.lng]}>
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <h3 style={{ margin: '0 0 8px', color: '#F97316', fontSize: '16px' }}>
                      {listing.item_name}
                    </h3>
                    <p style={{ margin: '0 0 4px', fontSize: '14px' }}>
                      Quantity: {listing.quantity}
                    </p>
                    {listing.address && (
                      <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#666' }}>
                        {listing.address}
                      </p>
                    )}
                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#F97316', fontWeight: '600' }}>
                      {getTimeLeft(listing.expiry_time)}
                    </p>
                    <a href="/browse" style={{
                      display: 'block', textAlign: 'center', padding: '8px',
                      background: '#F97316', color: 'white', borderRadius: '8px',
                      textDecoration: 'none', fontWeight: '600', fontSize: '14px'
                    }}>
                      Claim This Food
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default MapView;