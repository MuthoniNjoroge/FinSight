const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
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
    console.log('🌐 API: Fetching settings for user', userId);
    console.log('🌐 API: Request URL:', `${API_BASE_URL}/settings/user/${userId}`);
    console.log('🌐 API: Request headers:', getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/settings/user/${userId}`, {
      headers: getAuthHeaders()
    });
    
    console.log('🌐 API: Settings response status:', response.status);
    console.log('🌐 API: Settings response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🌐 API: Settings error response:', errorText);
      throw new Error(`Failed to fetch settings: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('🌐 API: Settings success response:', responseData);
    return responseData;
  },

  async updateByUser(userId: number, settings: { currency?: string; monthly_income_target?: number }) {
    console.log('🌐 API: Updating settings for user', userId, 'with data:', settings);
    console.log('🌐 API: Request URL:', `${API_BASE_URL}/settings/user/${userId}`);
    console.log('🌐 API: Request headers:', getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/settings/user/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    
    console.log('🌐 API: Response status:', response.status);
    console.log('🌐 API: Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🌐 API: Error response:', errorText);
      throw new Error(`Failed to update settings: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('🌐 API: Success response:', responseData);
    return responseData;
  }
}; 