const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('./db');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, lat, lng } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role, lat, lng }])
      .select('id, name, email, role')
      .single();
    if (error) throw error;
    const token = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET);
    res.json({ token, user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error || !data) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) return res.status(401).json({ error: 'Wrong password' });
    const token = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: data.id, name: data.name, email: data.email, role: data.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;