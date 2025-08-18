// Environment-based API configuration
const API_BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL || 'https://finsight-mqsc.onrender.com/api'
  : 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Users API
export const usersApi = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  },

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    
    return data;
  }
};

// Goals API
export const goalsApi = {
  async create(goal: { user_id: number; name: string; target_amount: number; current_amount?: number; deadline: string }) {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(goal)
    });
    if (!response.ok) throw new Error('Failed to create goal');
    return response.json();
  },

  async getByUser(userId: number) {
    const response = await fetch(`${API_BASE_URL}/goals/user/${userId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch goals');
    return response.json();
  },

  async update(id: string, updates: { name?: string; target_amount?: number; current_amount?: number; deadline?: string }) {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update goal');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete goal');
    return response.json();
  }
};

// Budgets API
export const budgetsApi = {
  async create(budget: { user_id: number; name: string; amount: number; period: string }) {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(budget)
    });
    if (!response.ok) throw new Error('Failed to create budget');
    return response.json();
  },

  async getByUser(userId: number) {
    const response = await fetch(`${API_BASE_URL}/budgets/user/${userId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch budgets');
    return response.json();
  },

  async update(id: string, updates: { name?: string; amount?: number; period?: string }) {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update budget');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete budget');
    return response.json();
  }
};

// Expenses API
export const expensesApi = {
  async create(expense: { user_id: number; budget_id?: number; amount: number; description: string; date: string; category: string; type: string }) {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(expense)
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  },

  async getByUser(userId: number) {
    const response = await fetch(`${API_BASE_URL}/expenses/user/${userId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  },

  async update(id: string, updates: { amount?: number; description?: string; date?: string; category?: string; type?: string }) {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update expense');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete expense');
    return response.json();
  }
};

// Settings API
export const settingsApi = {
  async getByUser(userId: number) {
    const response = await fetch(`${API_BASE_URL}/settings/user/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch settings: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  },

  async updateByUser(userId: number, settings: { currency?: string; monthly_income_target?: number }) {
    const response = await fetch(`${API_BASE_URL}/settings/user/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update settings: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  }
};