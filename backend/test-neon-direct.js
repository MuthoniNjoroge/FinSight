require('dotenv').config();
const { Pool } = require('pg');

// Test direct connection to Neon database
async function testNeonConnection() {
  console.log('🔍 Testing direct Neon database connection...\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test 1: Check connection
    console.log('📡 Test 1: Checking database connection...');
    const connectionResult = await pool.query('SELECT NOW() as current_time, current_database() as db_name, current_user as db_user');
    console.log('✅ Connected to database:', connectionResult.rows[0]);
    
    // Test 2: Check if we're actually on Neon
    console.log('\n🌐 Test 2: Verifying Neon connection...');
    const neonResult = await pool.query("SELECT version() as db_version");
    console.log('Database version:', neonResult.rows[0].db_version);
    
    // Test 3: Create a test record
    console.log('\n📝 Test 3: Creating test record...');
    const testUser = {
      name: 'Neon Test User',
      email: 'neon.test@example.com',
      password: 'test123'
    };
    
    const insertResult = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [testUser.name, testUser.email, testUser.password]
    );
    
    console.log('✅ Test user created:', insertResult.rows[0]);
    const testUserId = insertResult.rows[0].id;
    
    // Test 4: Create test data
    console.log('\n💰 Test 4: Creating test budget...');
    const budgetResult = await pool.query(
      'INSERT INTO budgets (user_id, name, amount, period) VALUES ($1, $2, $3, $4) RETURNING *',
      [testUserId, 'Neon Test Budget', 1000, 'monthly']
    );
    console.log('✅ Test budget created:', budgetResult.rows[0]);
    
    // Test 5: Create test expense
    console.log('\n💸 Test 5: Creating test expense...');
    const expenseResult = await pool.query(
      'INSERT INTO expenses (user_id, amount, description, category, type, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [testUserId, 50, 'Neon test expense', 'Test', 'expense', new Date()]
    );
    console.log('✅ Test expense created:', expenseResult.rows[0]);
    
    // Test 6: Create test goal
    console.log('\n🎯 Test 6: Creating test goal...');
    const goalResult = await pool.query(
      'INSERT INTO goals (user_id, name, target_amount, current_amount, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [testUserId, 'Neon Test Goal', 5000, 1000, '2025-12-31']
    );
    console.log('✅ Test goal created:', goalResult.rows[0]);
    
    // Test 7: Verify all data exists
    console.log('\n📊 Test 7: Verifying all test data...');
    
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users WHERE email = $1', [testUser.email]);
    const budgetCount = await pool.query('SELECT COUNT(*) as count FROM budgets WHERE user_id = $1', [testUserId]);
    const expenseCount = await pool.query('SELECT COUNT(*) as count FROM expenses WHERE user_id = $1', [testUserId]);
    const goalCount = await pool.query('SELECT COUNT(*) as count FROM goals WHERE user_id = $1', [testUserId]);
    
    console.log('📈 Data verification results:');
    console.log(`- Users with test email: ${userCount.rows[0].count}`);
    console.log(`- Budgets for test user: ${budgetCount.rows[0].count}`);
    console.log(`- Expenses for test user: ${expenseCount.rows[0].count}`);
    console.log(`- Goals for test user: ${goalCount.rows[0].count}`);
    
    // Test 8: Clean up test data
    console.log('\n🧹 Test 8: Cleaning up test data...');
    await pool.query('DELETE FROM expenses WHERE user_id = $1', [testUserId]);
    await pool.query('DELETE FROM budgets WHERE user_id = $1', [testUserId]);
    await pool.query('DELETE FROM goals WHERE user_id = $1', [testUserId]);
    await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 All tests passed! Data is being saved to Neon database successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pool.end();
  }
}

testNeonConnection(); 