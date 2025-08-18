require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkUser10() {
  try {
    console.log('🔍 Checking data for User ID 10...\n');
    
    // Check if user 10 exists
    console.log('📋 Checking if user 10 exists...');
    const userResult = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = 10');
    if (userResult.rows.length === 0) {
      console.log('❌ User ID 10 does not exist in the database!');
      console.log('This explains why the frontend is getting empty data.');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('✅ User 10 found:', user);
    
    // Check goals for user 10
    console.log('\n🎯 Goals for user 10:');
    const goalsResult = await pool.query('SELECT id, name, target_amount, current_amount, deadline FROM goals WHERE user_id = 10');
    console.log(`Found ${goalsResult.rows.length} goals for user 10`);
    goalsResult.rows.forEach(goal => {
      console.log(`  - ID: ${goal.id}, Name: ${goal.name}, Target: $${goal.target_amount}, Current: $${goal.current_amount}, Deadline: ${goal.deadline}`);
    });
    
    // Check budgets for user 10
    console.log('\n💰 Budgets for user 10:');
    const budgetsResult = await pool.query('SELECT id, name, amount, period FROM budgets WHERE user_id = 10');
    console.log(`Found ${budgetsResult.rows.length} budgets for user 10`);
    budgetsResult.rows.forEach(budget => {
      console.log(`  - ID: ${budget.id}, Name: ${budget.name}, Amount: $${budget.amount}, Period: ${budget.period}`);
    });
    
    // Check expenses for user 10
    console.log('\n💸 Expenses for user 10:');
    const expensesResult = await pool.query('SELECT id, amount, description, category, type, date FROM expenses WHERE user_id = 10');
    console.log(`Found ${expensesResult.rows.length} expenses for user 10`);
    expensesResult.rows.forEach(expense => {
      console.log(`  - ID: ${expense.id}, Amount: $${expense.amount}, Description: ${expense.description}, Category: ${expense.category}, Type: ${expense.type}, Date: ${expense.date}`);
    });
    
    // Check settings for user 10
    console.log('\n⚙️ Settings for user 10:');
    const settingsResult = await pool.query('SELECT id, currency, monthly_income_target FROM user_settings WHERE user_id = 10');
    if (settingsResult.rows.length === 0) {
      console.log('❌ No settings found for user 10');
    } else {
      const setting = settingsResult.rows[0];
      console.log(`  - Currency: ${setting.currency}, Monthly Income: $${setting.monthly_income_target}`);
    }
    
    console.log('\n📊 Summary for User 10:');
    console.log(`- Goals: ${goalsResult.rows.length}`);
    console.log(`- Budgets: ${budgetsResult.rows.length}`);
    console.log(`- Expenses: ${expensesResult.rows.length}`);
    console.log(`- Settings: ${settingsResult.rows.length > 0 ? 'Configured' : 'Not configured'}`);
    
    if (goalsResult.rows.length === 0 && budgetsResult.rows.length === 0 && expensesResult.rows.length === 0) {
      console.log('\n❌ User 10 has no data! This explains the empty arrays in the frontend.');
      console.log('The frontend is authenticated as user 10, but user 10 has no data.');
      console.log('User 11 has data, but the frontend is not authenticated as user 11.');
    } else {
      console.log('\n✅ User 10 has data. The issue might be elsewhere.');
    }
    
  } catch (error) {
    console.error('❌ Error checking user 10:', error);
  } finally {
    await pool.end();
  }
}

checkUser10();
