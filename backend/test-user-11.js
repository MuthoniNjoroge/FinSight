const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3001/api';

async function testUser11API() {
  console.log('🔍 Testing API Endpoints for User ID 11...\n');
  
  try {
    // Test 1: Login to get token for user 11
    console.log('🔐 Test 1: Logging in as user 11...');
    const loginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'msoo@gmail.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginResponse.status, loginData);
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginData.error);
      return;
    }
    
    const token = loginData.token;
    const userId = loginData.user.id;
    console.log('✅ Login successful! User ID:', userId);
    
    // Test 2: Fetch goals for user 11
    console.log('\n🎯 Test 2: Fetching goals for user 11...');
    const goalsResponse = await fetch(`${API_BASE}/goals/user/11`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const goals = await goalsResponse.json();
    console.log('Goals response:', goalsResponse.status, goals);
    console.log(`Found ${goals.length} goals for user 11`);
    
    // Test 3: Fetch budgets for user 11
    console.log('\n💰 Test 3: Fetching budgets for user 11...');
    const budgetsResponse = await fetch(`${API_BASE}/budgets/user/11`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const budgets = await budgetsResponse.json();
    console.log('Budgets response:', budgetsResponse.status, budgets);
    console.log(`Found ${budgets.length} budgets for user 11`);
    
    // Test 4: Fetch expenses for user 11
    console.log('\n💸 Test 4: Fetching expenses for user 11...');
    const expensesResponse = await fetch(`${API_BASE}/expenses/user/11`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const expenses = await expensesResponse.json();
    console.log('Expenses response:', expensesResponse.status, expenses);
    console.log(`Found ${expenses.length} expenses for user 11`);
    
    // Test 5: Fetch settings for user 11
    console.log('\n⚙️ Test 5: Fetching settings for user 11...');
    const settingsResponse = await fetch(`${API_BASE}/settings/user/11`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const settings = await settingsResponse.json();
    console.log('Settings response:', settingsResponse.status, settings);
    
    // Summary
    console.log('\n📊 User 11 API Test Summary:');
    console.log(`- User ID: ${userId}`);
    console.log(`- Goals: ${goals.length}`);
    console.log(`- Budgets: ${budgets.length}`);
    console.log(`- Expenses: ${expenses.length}`);
    console.log(`- Settings: ${settings ? 'Configured' : 'Not configured'}`);
    
    if (goals.length > 0 || budgets.length > 0 || expenses.length > 0) {
      console.log('\n✅ API endpoints are working and returning data for user 11!');
      console.log('The frontend should be able to load this data.');
    } else {
      console.log('\n❌ No data found for user 11. This explains why the frontend shows empty.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUser11API();
