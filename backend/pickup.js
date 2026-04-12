const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('./db');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all claimed listings for volunteers
router.get('/available', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('food_listings')
      .select('*, users(name)')
      .eq('status', 'claimed')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const formatted = data.map(item => ({
      ...item,
      donor_name: item.users?.name
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteer assigns themselves to a pickup
router.post('/assign', verifyToken, async (req, res) => {
  const { listing_id } = req.body;
  try {
    const { data, error } = await supabase
      .from('pickups')
      .insert([{ listing_id, volunteer_id: req.user.id, status: 'assigned' }])
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pickup status
router.patch('/status', verifyToken, async (req, res) => {
  const { pickup_id, status } = req.body;
  try {
    const { data, error } = await supabase
      .from('pickups')
      .update({ status })
      .eq('id', pickup_id)
      .eq('volunteer_id', req.user.id)
      .select()
      .single();
    if (error) throw error;
    if (status === 'delivered') {
      await supabase
        .from('impact_log')
        .insert([{ listing_id: data.listing_id, kg_saved: 5, meals: 10 }]);
      await supabase
        .from('food_listings')
        .update({ status: 'expired' })
        .eq('id', data.listing_id);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get volunteer's own pickups
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pickups')
      .select('*, food_listings(item_name, quantity, lat, lng)')
      .eq('volunteer_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const formatted = data.map(item => ({
      ...item,
      item_name: item.food_listings?.item_name,
      quantity: item.food_listings?.quantity
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;