const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = (pool) => {
  // Register
  router.post('/register', async (req, res) => {
    console.log('Register endpoint hit', req.body); // Log when endpoint is hit
    const { name, email, password } = req.body;
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      if (err.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'Email already exists.' });
      }
      console.error('Register error:', err); // Log the error
      res.status(500).json({ error: err.message });
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all users
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, name, email FROM users');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get user by id
  router.get('/:id', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update user
  router.put('/:id', async (req, res) => {
    const { name, email } = req.body;
    try {
      const result = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
        [name, email, req.params.id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete user
  router.delete('/:id', async (req, res) => {
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}; 