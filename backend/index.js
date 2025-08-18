require('dotenv').config();
// Only log JWT_SECRET in development
if (process.env.NODE_ENV !== 'production') {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
}
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const usersRouter = require('./users');
const budgetsRouter = require('./budgets');
const expensesRouter = require('./expenses');
const goalsRouter = require('./goals');
const settingsRouter = require('./settings');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
    : true,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Use Neon database connection from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Example query
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    console.error('Please check your database connection and credentials');
  } else {
    console.log('PostgreSQL connected:', res.rows[0]);
  }
});

// Add error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Use routers
app.use('/api/users', usersRouter(pool));
app.use('/api/budgets', budgetsRouter(pool));
app.use('/api/expenses', expensesRouter(pool));
app.use('/api/goals', goalsRouter(pool));
app.use('/api/settings', settingsRouter(pool));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
console.log('Environment PORT:', process.env.PORT);
console.log('Final PORT:', PORT);
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)); 