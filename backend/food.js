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

// Post a food listing
router.post('/upload', verifyToken, async (req, res) => {
  const { item_name, quantity, expiry_time, lat, lng, photo_url } = req.body;
  try {
    const { data, error } = await supabase
      .from('food_listings')
      .insert([{ donor_id: req.user.id, item_name, quantity, expiry_time, lat, lng, photo_url }])
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get nearby food listings
router.get('/nearby', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('food_listings')
      .select('*')
      .eq('status', 'available')
      .gt('expiry_time', new Date().toISOString())
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept a food listing
router.post('/accept', verifyToken, async (req, res) => {
  const { listing_id } = req.body;
  try {
    const { error: reqError } = await supabase
      .from('requests')
      .insert([{ listing_id, receiver_id: req.user.id }]);
    if (reqError) throw reqError;
    const { error: updateError } = await supabase
      .from('food_listings')
      .update({ status: 'claimed' })
      .eq('id', listing_id);
    if (updateError) throw updateError;
    res.json({ message: 'Listing claimed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;