const express = require('express');
const router = express.Router();
const authenticateToken = require('./middleware/auth');

module.exports = (pool) => {
  // Get user settings
  router.get('/user/:userId', authenticateToken, async (req, res) => {
    console.log('🔧 Backend: Settings GET request received for user:', req.params.userId);
    console.log('🔧 Backend: Auth user:', req.user);
    
    try {
      const result = await pool.query(
        'SELECT * FROM user_settings WHERE user_id = $1',
        [req.params.userId]
      );
      console.log('🔧 Backend: Database query result:', result.rows);
      
      if (result.rows.length === 0) {
        // Create default settings if none exist
        console.log('🔧 Backend: No settings found, creating defaults...');
        const defaultSettings = await pool.query(
          'INSERT INTO user_settings (user_id, currency, monthly_income_target) VALUES ($1, $2, $3) RETURNING *',
          [req.params.userId, 'USD', 0]
        );
        console.log('🔧 Backend: Default settings created:', defaultSettings.rows[0]);
        res.json(defaultSettings.rows[0]);
      } else {
        console.log('🔧 Backend: Returning existing settings:', result.rows[0]);
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error('🔧 Backend: Settings GET error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Update user settings
  router.put('/user/:userId', authenticateToken, async (req, res) => {
    console.log('🔧 Backend: Settings update request received');
    console.log('🔧 Backend: User ID from params:', req.params.userId);
    console.log('🔧 Backend: Request body:', req.body);
    console.log('🔧 Backend: Auth user:', req.user);
    
    const { currency, monthly_income_target } = req.body;
    console.log('🔧 Backend: Extracted data:', { currency, monthly_income_target });
    
    try {
      // First check if settings exist
      console.log('🔧 Backend: Checking if settings exist for user:', req.params.userId);
      const existingSettings = await pool.query(
        'SELECT * FROM user_settings WHERE user_id = $1',
        [req.params.userId]
      );
      console.log('🔧 Backend: Existing settings found:', existingSettings.rows.length > 0);
      
      if (existingSettings.rows.length === 0) {
        // Create new settings
        console.log('🔧 Backend: Creating new settings...');
        const result = await pool.query(
          'INSERT INTO user_settings (user_id, currency, monthly_income_target) VALUES ($1, $2, $3) RETURNING *',
          [req.params.userId, currency, monthly_income_target]
        );
        console.log('🔧 Backend: Settings created successfully:', result.rows[0]);
        res.json(result.rows[0]);
      } else {
        // Update existing settings
        console.log('🔧 Backend: Updating existing settings...');
        const result = await pool.query(
          'UPDATE user_settings SET currency = $2, monthly_income_target = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *',
          [req.params.userId, currency, monthly_income_target]
        );
        console.log('🔧 Backend: Settings updated successfully:', result.rows[0]);
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error('🔧 Backend: Settings update error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}; 