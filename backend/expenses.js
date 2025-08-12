const express = require('express');
const router = express.Router();
const authenticateToken = require('./middleware/auth');

module.exports = (pool) => {
  // Create expense
  router.post('/', authenticateToken, async (req, res) => {
    const { user_id, budget_id, amount, description, date, category, type } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO expenses (user_id, budget_id, amount, description, date, category, type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [user_id, budget_id, amount, description, date, category, type || 'expense']
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all expenses for a user
  router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [req.params.userId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get expense by id
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Expense not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update expense
  router.put('/:id', authenticateToken, async (req, res) => {
    const { amount, description, date, category, type } = req.body;
    try {
      const result = await pool.query(
        'UPDATE expenses SET amount = $1, description = $2, date = $3, category = $4, type = $5 WHERE id = $6 RETURNING *',
        [amount, description, date, category, type, req.params.id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Expense not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete expense
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING id', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Expense not found' });
      res.json({ message: 'Expense deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}; 