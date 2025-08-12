const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3001/api';

async function testFullDataFlow() {
  console.log('🚀 Testing Complete Data Flow: Frontend → Backend → Neon Database\n');
  
  // Test 1: Create a new user
  console.log('📝 Test 1: Creating new user...');
  const newUser = {
    name: 'John Doe',
    email: 'john.doe@test.com',
    password: 'password123'
  };
  
  try {
    const registerResponse = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerResponse.status, registerData);
    
    if (!registerResponse.ok) {
      console.log('❌ Registration failed:', registerData.error);
      return;
    }
    
    console.log('✅ User created successfully!');
    const userId = registerData.id;
    
    // Test 2: Login the user
    console.log('\n🔐 Test 2: Logging in user...');
    const loginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newUser.email,
        password: newUser.password
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginResponse.status, loginData);
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginData.error);
      return;
    }
    
    console.log('✅ Login successful!');
    const token = loginData.token;
    
    // Test 3: Create a budget
    console.log('\n💰 Test 3: Creating a budget...');
    const budgetData = {
      user_id: userId,
      name: 'Groceries',
      amount: 500,
      period: 'monthly'
    };
    
    const budgetResponse = await fetch(`${API_BASE}/budgets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(budgetData)
    });
    
    const budgetResult = await budgetResponse.json();
    console.log('Budget creation response:', budgetResponse.status, budgetResult);
    
    if (!budgetResponse.ok) {
      console.log('❌ Budget creation failed:', budgetResult.error);
    } else {
      console.log('✅ Budget created successfully!');
    }
    
    // Test 4: Create an expense
    console.log('\n💸 Test 4: Creating an expense...');
    const expenseData = {
      user_id: userId,
      amount: 50,
      description: 'Grocery shopping',
      date: new Date().toISOString().split('T')[0],
      category: 'Groceries',
      type: 'expense'
    };
    
    const expenseResponse = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(expenseData)
    });
    
    const expenseResult = await expenseResponse.json();
    console.log('Expense creation response:', expenseResponse.status, expenseResult);
    
    if (!expenseResponse.ok) {
      console.log('❌ Expense creation failed:', expenseResult.error);
    } else {
      console.log('✅ Expense created successfully!');
    }
    
    // Test 5: Create a savings goal
    console.log('\n🎯 Test 5: Creating a savings goal...');
    const goalData = {
      user_id: userId,
      name: 'Vacation Fund',
      target_amount: 2000,
      current_amount: 500,
      deadline: '2025-12-31'
    };
    
    const goalResponse = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(goalData)
    });
    
    const goalResult = await goalResponse.json();
    console.log('Goal creation response:', goalResponse.status, goalResult);
    
    if (!goalResponse.ok) {
      console.log('❌ Goal creation failed:', goalResult.error);
    } else {
      console.log('✅ Goal created successfully!');
    }
    
    // Test 6: Update user settings
    console.log('\n⚙️ Test 6: Updating user settings...');
    const settingsData = {
      currency: 'USD',
      monthly_income_target: 6000
    };
    
    const settingsResponse = await fetch(`${API_BASE}/settings/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settingsData)
    });
    
    const settingsResult = await settingsResponse.json();
    console.log('Settings update response:', settingsResponse.status, settingsResult);
    
    if (!settingsResponse.ok) {
      console.log('❌ Settings update failed:', settingsResult.error);
    } else {
      console.log('✅ Settings updated successfully!');
    }
    
    // Test 7: Fetch all user data
    console.log('\n📊 Test 7: Fetching all user data...');
    
    // Fetch budgets
    const budgetsResponse = await fetch(`${API_BASE}/budgets/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const budgets = await budgetsResponse.json();
    console.log('Budgets fetched:', budgets.length, 'budgets');
    
    // Fetch expenses
    const expensesResponse = await fetch(`${API_BASE}/expenses/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const expenses = await expensesResponse.json();
    console.log('Expenses fetched:', expenses.length, 'expenses');
    
    // Fetch goals
    const goalsResponse = await fetch(`${API_BASE}/goals/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const goals = await goalsResponse.json();
    console.log('Goals fetched:', goals.length, 'goals');
    
    // Fetch settings
    const userSettingsResponse = await fetch(`${API_BASE}/settings/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const userSettings = await userSettingsResponse.json();
    console.log('Settings fetched:', userSettings);
    
    console.log('\n✅ All data fetched successfully!');
    console.log('\n📈 Summary:');
    console.log(`- User ID: ${userId}`);
    console.log(`- Budgets: ${budgets.length}`);
    console.log(`- Expenses: ${expenses.length}`);
    console.log(`- Goals: ${goals.length}`);
    console.log(`- Settings: ${userSettings ? 'Configured' : 'Not configured'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFullDataFlow(); 