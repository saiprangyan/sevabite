const express = require('express');
const cors = require('cors');
const supabase = require('./db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count');
    if (error) throw error;
    res.json({ status: 'ok', message: 'SevaBite backend connected to database!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes
app.use('/auth', require('./auth'));
app.use('/food', require('./food'));
app.use('/pickup', require('./pickup'));
app.use('/admin', require('./admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SevaBite backend running on port ${PORT}`);
});