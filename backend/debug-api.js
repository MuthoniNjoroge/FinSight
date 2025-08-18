const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3001/api';

async function debugAPI() {
  console.log('🔍 Debugging API endpoints...\n');
  
  try {
    // Test 1: Check if we can access the goals endpoint without auth
    console.log('🔐 Test 1: Testing goals endpoint without auth...');
    try {
      const goalsResponse = await fetch(`${API_BASE}/goals/user/11`);
      console.log('Goals response (no auth):', goalsResponse.status, goalsResponse.statusText);
      if (goalsResponse.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('❌ Should require authentication');
      }
    } catch (error) {
      console.log('❌ Error testing goals endpoint:', error.message);
    }
    
    // Test 2: Check if we can access the budgets endpoint without auth
    console.log('\n💰 Test 2: Testing budgets endpoint without auth...');
    try {
      const budgetsResponse = await fetch(`${API_BASE}/budgets/user/11`);
      console.log('Budgets response (no auth):', budgetsResponse.status, budgetsResponse.statusText);
      if (budgetsResponse.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('❌ Should require authentication');
      }
    } catch (error) {
      console.log('❌ Error testing budgets endpoint:', error.message);
    }
    
    // Test 3: Check if we can access the expenses endpoint without auth
    console.log('\n💸 Test 3: Testing expenses endpoint without auth...');
    try {
      const expensesResponse = await fetch(`${API_BASE}/expenses/user/11`);
      console.log('Expenses response (no auth):', expensesResponse.status, expensesResponse.statusText);
      if (expensesResponse.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('❌ Should require authentication');
      }
    } catch (error) {
      console.log('❌ Error testing expenses endpoint:', error.message);
    }
    
    // Test 4: Check if we can access the settings endpoint without auth
    console.log('\n⚙️ Test 4: Testing settings endpoint without auth...');
    try {
      const settingsResponse = await fetch(`${API_BASE}/settings/user/11`);
      console.log('Settings response (no auth):', settingsResponse.status, settingsResponse.statusText);
      if (settingsResponse.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('❌ Should require authentication');
      }
    } catch (error) {
      console.log('❌ Error testing settings endpoint:', error.message);
    }
    
    console.log('\n📊 API Debug Summary:');
    console.log('All endpoints should return 401 (Unauthorized) when accessed without authentication');
    console.log('If any endpoint returns data without auth, that\'s a security issue');
    console.log('If any endpoint returns 404, that means the route doesn\'t exist');
    console.log('If any endpoint returns 500, that means there\'s a server error');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugAPI();
