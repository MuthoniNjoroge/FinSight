const express = require('express');
const router = express.Router();
const authenticateToken = require('./middleware/auth');

module.exports = (pool) => {
  // Create goal
  router.post('/', authenticateToken, async (req, res) => {
    const { user_id, name, target_amount, current_amount, deadline } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO goals (user_id, name, target_amount, current_amount, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, name, target_amount, current_amount || 0, deadline]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all goals for a user
  router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM goals WHERE user_id = $1', [req.params.userId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get goal by id
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM goals WHERE id = $1', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Goal not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update goal
  router.put('/:id', authenticateToken, async (req, res) => {
    const { name, target_amount, current_amount, deadline } = req.body;
    try {
      const result = await pool.query(
        'UPDATE goals SET name = $1, target_amount = $2, current_amount = $3, deadline = $4 WHERE id = $5 RETURNING *',
        [name, target_amount, current_amount, deadline, req.params.id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Goal not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete goal
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('DELETE FROM goals WHERE id = $1 RETURNING id', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Goal not found' });
      res.json({ message: 'Goal deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}; 