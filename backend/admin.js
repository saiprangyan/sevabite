const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('./db');
require('dotenv').config();

const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: totalListings } = await supabase.from('food_listings').select('*', { count: 'exact', head: true });
    const { count: totalPickups } = await supabase.from('pickups').select('*', { count: 'exact', head: true });
    const { count: totalDelivered } = await supabase.from('pickups').select('*', { count: 'exact', head: true }).eq('status', 'delivered');
    res.json({ totalUsers, totalListings, totalPickups, totalDelivered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all listings
router.get('/listings', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('food_listings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete listing
router.delete('/listings/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('food_listings').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all pickups
router.get('/pickups', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pickups')
      .select('*, food_listings(item_name), users(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const formatted = data.map((p) => ({
      ...p,
      item_name: p.food_listings?.item_name,
      volunteer_name: p.users?.name
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;