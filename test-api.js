const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testRegistration() {
  console.log('Testing user registration...');
  
  try {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('Registration response:', response.status, data);
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      return data;
    } else {
      console.log('❌ Registration failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }
}

async function testLogin() {
  console.log('\nTesting user login...');
  
  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('Login response:', response.status, data);
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token ? 'Present' : 'Missing');
      console.log('User:', data.user);
      return data;
    } else {
      console.log('❌ Login failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
}

async function testHealthCheck() {
  console.log('\nTesting health check...');
  
  try {
    const response = await fetch('http://localhost:5000');
    const data = await response.text();
    console.log('Health check response:', response.status, data);
    
    if (response.ok) {
      console.log('✅ Backend server is running!');
    } else {
      console.log('❌ Backend server error');
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealthCheck();
  await testRegistration();
  await testLogin();
  
  console.log('\n🏁 Tests completed!');
}

runTests(); 