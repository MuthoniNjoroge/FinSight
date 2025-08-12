require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration for Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    console.log('Setting up Neon database...');
    
    // Read the create-tables SQL file (more comprehensive)
    const setupSQL = fs.readFileSync(path.join(__dirname, 'create-tables.sql'), 'utf8');
    
    // Split the SQL into individual statements
    const statements = setupSQL.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await pool.query(statement);
      }
    }
    
    console.log('✅ Neon database setup completed successfully!');
    console.log('Tables created:');
    console.log('  - users');
    console.log('  - goals (savings goals)');
    console.log('  - budgets');
    console.log('  - expenses (income & expenses)');
    console.log('  - user_settings');
    console.log('  - Performance indexes');
    
  } catch (error) {
    console.error('❌ Neon database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 