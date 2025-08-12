const express = require('express');
const router = express.Router();
const authenticateToken = require('./middleware/auth');

module.exports = (pool) => {
  // Create budget
  router.post('/', authenticateToken, async (req, res) => {
    const { user_id, name, amount, period } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO budgets (user_id, name, amount, period) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, name, amount, period]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all budgets for a user
  router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM budgets WHERE user_id = $1', [req.params.userId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get budget by id
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM budgets WHERE id = $1', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Budget not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update budget
  router.put('/:id', authenticateToken, async (req, res) => {
    const { name, amount, period } = req.body;
    try {
      const result = await pool.query(
        'UPDATE budgets SET name = $1, amount = $2, period = $3 WHERE id = $4 RETURNING *',
        [name, amount, period, req.params.id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Budget not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete budget
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('DELETE FROM budgets WHERE id = $1 RETURNING id', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Budget not found' });
      res.json({ message: 'Budget deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}; 