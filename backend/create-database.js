require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTables() {
  try {
    console.log('Creating database tables...');
    
    // Read the SQL file
    const sqlFile = fs.readFileSync(path.join(__dirname, 'create-tables.sql'), 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlFile.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await pool.query(statement);
      }
    }
    
    console.log('✅ All tables created successfully!');
    console.log('Tables created:');
    console.log('  - users');
    console.log('  - goals (savings goals)');
    console.log('  - budgets');
    console.log('  - expenses (income & expenses)');
    console.log('  - user_settings');
    console.log('  - Performance indexes');
    
  } catch (error) {
    console.error('❌ Failed to create tables:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

createTables(); 