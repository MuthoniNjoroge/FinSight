const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3001/api';

async function testFrontendAPI() {
  console.log('🔍 Testing Frontend API Endpoints...\n');
  
  try {
    // Test 1: Login to get token
    console.log('🔐 Test 1: Logging in...');
    const loginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.doe@test.com',
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
    
    // Test 2: Fetch goals
    console.log('\n🎯 Test 2: Fetching goals...');
    const goalsResponse = await fetch(`${API_BASE}/goals/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const goals = await goalsResponse.json();
    console.log('Goals response:', goalsResponse.status, goals);
    console.log(`Found ${goals.length} goals`);
    
    // Test 3: Fetch budgets
    console.log('\n💰 Test 3: Fetching budgets...');
    const budgetsResponse = await fetch(`${API_BASE}/budgets/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const budgets = await budgetsResponse.json();
    console.log('Budgets response:', budgetsResponse.status, budgets);
    console.log(`Found ${budgets.length} budgets`);
    
    // Test 4: Fetch expenses
    console.log('\n💸 Test 4: Fetching expenses...');
    const expensesResponse = await fetch(`${API_BASE}/expenses/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const expenses = await expensesResponse.json();
    console.log('Expenses response:', expensesResponse.status, expenses);
    console.log(`Found ${expenses.length} expenses`);
    
    // Test 5: Fetch settings
    console.log('\n⚙️ Test 5: Fetching settings...');
    const settingsResponse = await fetch(`${API_BASE}/settings/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const settings = await settingsResponse.json();
    console.log('Settings response:', settingsResponse.status, settings);
    
    // Summary
    console.log('\n📊 Frontend API Test Summary:');
    console.log(`- User ID: ${userId}`);
    console.log(`- Goals: ${goals.length}`);
    console.log(`- Budgets: ${budgets.length}`);
    console.log(`- Expenses: ${expenses.length}`);
    console.log(`- Settings: ${settings ? 'Configured' : 'Not configured'}`);
    
    if (goals.length > 0 || budgets.length > 0 || expenses.length > 0) {
      console.log('\n✅ API endpoints are working and returning data!');
      console.log('The frontend should be able to load this data.');
    } else {
      console.log('\n❌ No data found. This might be why the frontend shows empty.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFrontendAPI(); 