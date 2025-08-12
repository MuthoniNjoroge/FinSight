require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n');
    
    // Check users table
    console.log('📋 Users table:');
    const usersResult = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    console.log(`Found ${usersResult.rows.length} users:`);
    usersResult.rows.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Created: ${user.created_at}`);
    });
    
    // Check goals table
    console.log('\n🎯 Goals table:');
    const goalsResult = await pool.query('SELECT id, user_id, name, target_amount, current_amount, deadline FROM goals ORDER BY id');
    console.log(`Found ${goalsResult.rows.length} goals:`);
    goalsResult.rows.forEach(goal => {
      console.log(`  - ID: ${goal.id}, User: ${goal.user_id}, Name: ${goal.name}, Target: $${goal.target_amount}, Current: $${goal.current_amount}, Deadline: ${goal.deadline}`);
    });
    
    // Check budgets table
    console.log('\n💰 Budgets table:');
    const budgetsResult = await pool.query('SELECT id, user_id, name, amount, period FROM budgets ORDER BY id');
    console.log(`Found ${budgetsResult.rows.length} budgets:`);
    budgetsResult.rows.forEach(budget => {
      console.log(`  - ID: ${budget.id}, User: ${budget.user_id}, Name: ${budget.name}, Amount: $${budget.amount}, Period: ${budget.period}`);
    });
    
    // Check expenses table
    console.log('\n💸 Expenses table:');
    const expensesResult = await pool.query('SELECT id, user_id, amount, description, category, type, date FROM expenses ORDER BY id');
    console.log(`Found ${expensesResult.rows.length} expenses:`);
    expensesResult.rows.forEach(expense => {
      console.log(`  - ID: ${expense.id}, User: ${expense.user_id}, Amount: $${expense.amount}, Description: ${expense.description}, Category: ${expense.category}, Type: ${expense.type}, Date: ${expense.date}`);
    });
    
    // Check settings table
    console.log('\n⚙️ Settings table:');
    const settingsResult = await pool.query('SELECT id, user_id, currency, monthly_income_target FROM user_settings ORDER BY id');
    console.log(`Found ${settingsResult.rows.length} settings:`);
    settingsResult.rows.forEach(setting => {
      console.log(`  - ID: ${setting.id}, User: ${setting.user_id}, Currency: ${setting.currency}, Monthly Income: $${setting.monthly_income_target}`);
    });
    
    console.log('\n✅ Database check completed!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await pool.end();
  }
}

checkDatabase(); 