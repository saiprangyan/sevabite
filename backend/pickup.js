const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

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

// Get all claimed listings (available for volunteer pickup)
router.get('/available', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT fl.*, u.name as donor_name 
       FROM food_listings fl
       JOIN users u ON fl.donor_id = u.id
       WHERE fl.status = 'claimed'
       ORDER BY fl.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteer assigns themselves to a pickup
router.post('/assign', verifyToken, async (req, res) => {
  const { listing_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pickups (listing_id, volunteer_id, status) VALUES ($1, $2, $3) RETURNING *',
      [listing_id, req.user.id, 'assigned']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pickup status
router.patch('/status', verifyToken, async (req, res) => {
  const { pickup_id, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE pickups SET status = $1 WHERE id = $2 AND volunteer_id = $3 RETURNING *',
      [status, pickup_id, req.user.id]
    );
    if (status === 'delivered') {
      const pickup = result.rows[0];
      await pool.query(
        'INSERT INTO impact_log (listing_id, kg_saved, meals) VALUES ($1, $2, $3)',
        [pickup.listing_id, 5, 10]
      );
      await pool.query(
        "UPDATE food_listings SET status = 'expired' WHERE id = $1",
        [pickup.listing_id]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get volunteer's own pickups
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, fl.item_name, fl.quantity, fl.lat, fl.lng
       FROM pickups p
       JOIN food_listings fl ON p.listing_id = fl.id
       WHERE p.volunteer_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;