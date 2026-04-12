const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'ok', message: 'SevaBite backend connected to database!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes
app.use('/auth', require('./auth'));
app.use('/food', require('./food'));
app.use('/pickup', require('./pickup'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SevaBite backend running on port ${PORT}`);
});