import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const API_URL = 'https://sevabite-backend.onrender.com';

function Users() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) window.location.href = '/';
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { authorization: token }
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/admin/users/${id}`, {
        headers: { authorization: token }
      });
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setMessage('Error deleting user.');
    }
  };

  const roleColor = (role) => {
    if (role === 'donor') return '#F97316';
    if (role === 'receiver') return '#3B82F6';
    if (role === 'volunteer') return '#16A34A';
    if (role === 'admin') return '#8B5CF6';
    return '#666';
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Segoe UI, sans-serif', background: '#0f0f0f', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', margin: 0 }}>Users</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{users.length} total users</p>
        </div>

        {message && (
          <div style={{
            background: message.includes('Error') ? '#2a1a1a' : '#1a2a1a',
            color: message.includes('Error') ? '#f87171' : '#4ade80',
            padding: '12px', borderRadius: '8px', marginBottom: '1rem'
          }}>{message}</div>
        )}

        <div style={{ background: '#1a1a1a', borderRadius: '16px', border: '1px solid #333', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                {['Name', 'Email', 'Role', 'Joined', 'Action'].map((h) => (
                  <th key={h} style={{
                    padding: '1rem 1.5rem', textAlign: 'left',
                    color: '#666', fontSize: '13px', fontWeight: '600'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: '500' }}>
                    {user.name}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#aaa', fontSize: '14px' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      background: roleColor(user.role) + '20',
                      color: roleColor(user.role),
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '600'
                    }}>{user.role}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#666', fontSize: '13px' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        padding: '6px 16px', background: '#2a1a1a',
                        color: '#f87171', border: '1px solid #f8717120',
                        borderRadius: '8px', cursor: 'pointer',
                        fontSize: '13px', fontWeight: '600'
                      }}
                    >
                      Delete
                    </button>
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

export default Users;