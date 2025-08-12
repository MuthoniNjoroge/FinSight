const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3001/api';

async function testTokenExpiration() {
  console.log('🔍 Testing JWT Token Expiration...\n');
  
  try {
    // Step 1: Login to get a fresh token
    console.log('🔐 Step 1: Logging in to get fresh token...');
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
    
    // Step 2: Test token immediately
    console.log('\n🎯 Step 2: Testing token immediately...');
    const goalsResponse = await fetch(`${API_BASE}/goals/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Goals response status:', goalsResponse.status);
    if (!goalsResponse.ok) {
      const errorData = await goalsResponse.json();
      console.log('❌ Token test failed:', errorData);
      return;
    }
    
    const goals = await goalsResponse.json();
    console.log('✅ Token works! Found goals:', goals.length);
    
    // Step 3: Test all endpoints with fresh token
    console.log('\n📊 Step 3: Testing all endpoints with fresh token...');
    
    const endpoints = [
      { name: 'Goals', url: `${API_BASE}/goals/user/${userId}` },
      { name: 'Budgets', url: `${API_BASE}/budgets/user/${userId}` },
      { name: 'Expenses', url: `${API_BASE}/expenses/user/${userId}` },
      { name: 'Settings', url: `${API_BASE}/settings/user/${userId}` }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${endpoint.name}: ${Array.isArray(data) ? data.length : 'OK'}`);
        } else {
          const errorData = await response.json();
          console.log(`❌ ${endpoint.name}: ${response.status} - ${errorData.error}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Token expiration test completed!');
    console.log('If all endpoints work with fresh token, the issue might be:');
    console.log('1. Token expiration (tokens expire after 1 day)');
    console.log('2. Frontend not properly handling token refresh');
    console.log('3. localStorage token is expired');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTokenExpiration(); 