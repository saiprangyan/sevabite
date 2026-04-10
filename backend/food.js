const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware to verify token
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
    const result = await pool.query(
      'INSERT INTO food_listings (donor_id, item_name, quantity, expiry_time, lat, lng, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, item_name, quantity, expiry_time, lat, lng, photo_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get nearby food listings
router.get('/nearby', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM food_listings WHERE status = 'available' AND expiry_time > NOW() ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept a food listing
router.post('/accept', verifyToken, async (req, res) => {
  const { listing_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO requests (listing_id, receiver_id) VALUES ($1, $2)',
      [listing_id, req.user.id]
    );
    await pool.query(
      "UPDATE food_listings SET status = 'claimed' WHERE id = $1",
      [listing_id]
    );
    res.json({ message: 'Listing claimed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;