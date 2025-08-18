import  { useState, useEffect } from 'react';
import { BarChart3,  Target, History, Settings as SettingsIcon, DollarSign, Menu, X, MessageCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import BudgetManager from './components/BudgetManager';
import SavingsGoals from './components/SavingsGoals';
import TransactionHistory from './components/TransactionHistory';
import Settings from './components/Settings';
import Toast from './components/Toast';
import FinancialAdvisor from './components/FinancialAdvisor';
import { Transaction, Budget, SavingsGoal, AppSettings } from './types/finance';
import { calculateFinancialSummary } from './utils/finance';
import Login from './components/Login';
import Register from './components/Register';
import { goalsApi, budgetsApi, expensesApi, settingsApi } from './services/api';

type ActiveTab = 'dashboard' | 'budgets' | 'goals' | 'history' | 'advisor' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Auth state
  const [auth, setAuth] = useState<{ token: string; user: { id: number; name: string; email: string } } | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });
  
  // App settings
  const [settings, setSettings] = useState<AppSettings>({
    currency: 'USD',
    monthlyIncome: 0
  });
  
  // Data state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(false);

  const summary = calculateFinancialSummary(transactions);

  // Load data when user is authenticated
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔍 Auth state changed:', auth);
    }
    if (auth?.user?.id) {
      if (import.meta.env.DEV) {
        console.log('✅ User authenticated, loading data for ID:', auth.user.id);
      }
      loadUserData();
    } else {
      if (import.meta.env.DEV) {
        console.log('❌ No authenticated user found');
      }
    }
  }, [auth?.user?.id]);

  const loadUserData = async () => {
    if (!auth?.user?.id) return;
    
    if (import.meta.env.DEV) {
      console.log('🔄 Loading user data for user ID:', auth.user.id);
    }
    setLoading(true);
    try {
      // Load goals
      if (import.meta.env.DEV) {
        console.log('📥 Fetching goals...');
      }
      const goalsData = await goalsApi.getByUser(auth.user.id);
      if (import.meta.env.DEV) {
        console.log('✅ Goals loaded:', goalsData);
      }
      setSavingsGoals(goalsData.map((goal: { id: number; name: string; target_amount: string; current_amount: string; deadline: string }) => ({
        id: goal.id.toString(),
        name: goal.name,
        targetAmount: parseFloat(goal.target_amount) || 0,
        currentAmount: parseFloat(goal.current_amount) || 0,
        deadline: goal.deadline,
        color: '#3B82F6' // Default color
      })));

      // Load budgets
      if (import.meta.env.DEV) {
        console.log('📥 Fetching budgets...');
      }
      const budgetsData = await budgetsApi.getByUser(auth.user.id);
      if (import.meta.env.DEV) {
        console.log('✅ Budgets loaded:', budgetsData);
      }
      setBudgets(budgetsData.map((budget: { id: number; name: string; amount: string; period: string }) => ({
        id: budget.id.toString(),
        category: budget.name.toLowerCase(),
        allocated: parseFloat(budget.amount) || 0,
        spent: 0, // This would need to be calculated from expenses
        period: budget.period
      })));

      // Load expenses/transactions
      if (import.meta.env.DEV) {
        console.log('📥 Fetching expenses...');
      }
      const expensesData = await expensesApi.getByUser(auth.user.id);
      if (import.meta.env.DEV) {
        console.log('✅ Expenses loaded:', expensesData);
      }
      setTransactions(expensesData.map((expense: { id: number; amount: string; description: string; category: string; type: string; date: string }) => ({
        id: expense.id.toString(),
        type: (expense.type || 'expense') as 'income' | 'expense',
        amount: parseFloat(expense.amount) || 0,
        description: expense.description,
        category: expense.category,
        date: expense.date
      })));

      // Load user settings
      if (import.meta.env.DEV) {
        console.log('📥 Fetching settings...');
      }
      const settingsData = await settingsApi.getByUser(auth.user.id);
      if (import.meta.env.DEV) {
        console.log('✅ Settings loaded:', settingsData);
        console.log('✅ Settings data structure:', {
          currency: settingsData.currency,
          monthly_income_target: settingsData.monthly_income_target,
          parsed_monthly_income: parseFloat(settingsData.monthly_income_target) || 5000
        });
        console.log('✅ Previous settings state:', settings);
      }
      const newSettings = {
        ...settings,
        currency: settingsData.currency || 'USD',
        monthlyIncome: parseFloat(settingsData.monthly_income_target) || 0
      };
      if (import.meta.env.DEV) {
        console.log('✅ New settings to set:', newSettings);
      }
      setSettings(newSettings);
      if (import.meta.env.DEV) {
        console.log('✅ Settings state updated');
        console.log('🎉 All user data loaded successfully!');
      }
    } catch (error) {
      console.error('❌ Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    if (!auth?.user?.id) return;

    try {
      const expenseData = {
        user_id: auth.user.id,
        amount: newTransaction.amount,
        description: newTransaction.description,
        date: newTransaction.date,
        category: newTransaction.category,
        type: newTransaction.type,
        budget_id: undefined // Could be linked to a budget
      };

      const savedExpense = await expensesApi.create(expenseData);
      
      const transaction = {
        ...newTransaction,
        id: savedExpense.id.toString()
      };
      setTransactions(prev => [transaction, ...prev]);
      
      // Update budget spending if it's an expense
      if (newTransaction.type === 'expense') {
        setBudgets(prev => prev.map(budget => 
          budget.category === newTransaction.category 
            ? { ...budget, spent: budget.spent + newTransaction.amount }
            : budget
        ));
      }
      
      // Show success toast
      setToast({
        message: `${newTransaction.type === 'income' ? 'Income' : 'Expense'} added successfully!`,
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Failed to add transaction:', error);
      setToast({
        message: 'Failed to add transaction. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!auth?.user?.id) return;

    try {
      // Find the transaction to get its details
      const transactionToDelete = transactions.find(t => t.id === id);
      if (!transactionToDelete) {
        console.error('Transaction not found:', id);
        return;
      }

      console.log('🗑️ Deleting transaction:', transactionToDelete);

      // Delete from database
      await expensesApi.delete(id);
      
      // Remove from frontend state
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Update budget spending if it was an expense
      if (transactionToDelete.type === 'expense') {
        setBudgets(prev => prev.map(budget => 
          budget.category === transactionToDelete.category 
            ? { ...budget, spent: Math.max(0, budget.spent - transactionToDelete.amount) }
            : budget
        ));
      }
      
      // Show success toast
      setToast({
        message: `${transactionToDelete.type === 'income' ? 'Income' : 'Expense'} deleted successfully!`,
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setToast({
        message: 'Failed to delete transaction. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleAddBudget = async (newBudget: Omit<Budget, 'id'>) => {
    console.log('🔧 handleAddBudget called with:', newBudget);
    
    if (!auth?.user?.id) {
      console.log('❌ No authenticated user found');
      return;
    }

    console.log('🔧 Current auth user ID:', auth.user.id);

    try {
      const budgetData = {
        user_id: auth.user.id,
        name: newBudget.category, // Using category as name
        amount: newBudget.allocated,
        period: newBudget.period
      };

      console.log('🔧 Budget data to send to API:', budgetData);
      console.log('💾 Attempting to save budget to database...');

      const savedBudget = await budgetsApi.create(budgetData);
      
      console.log('✅ Budget saved to database:', savedBudget);
      
      const budget = {
        ...newBudget,
        id: savedBudget.id.toString()
      };
      
      console.log('🔧 New budget object:', budget);
      setBudgets(prev => [...prev, budget]);
      console.log('✅ Budget added to frontend state');
      
      // Show success toast
      setToast({
        message: 'Budget added successfully!',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('❌ Failed to add budget:', error);
      setToast({
        message: 'Failed to add budget. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleUpdateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      await budgetsApi.update(id, {
        name: updates.category, // Using category as name
        amount: updates.allocated,
        period: updates.period
      });
      
      setBudgets(prev => prev.map(budget => 
        budget.id === id ? { 
          ...budget, 
          ...updates,
          // Ensure numeric values are properly converted
          allocated: typeof updates.allocated === 'number' ? updates.allocated : budget.allocated
        } : budget
      ));
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await budgetsApi.delete(id);
      setBudgets(prev => prev.filter(budget => budget.id !== id));
    } catch (error) {
      console.error('Failed to delete budget:', error);
    }
  };

  const handleAddGoal = async (newGoal: Omit<SavingsGoal, 'id'>) => {
    if (!auth?.user?.id) return;

    try {
      const goalData = {
        user_id: auth.user.id,
        name: newGoal.name,
        target_amount: newGoal.targetAmount,
        current_amount: newGoal.currentAmount || 0,
        deadline: newGoal.deadline
      };

      const savedGoal = await goalsApi.create(goalData);
      
      const goal = {
        ...newGoal,
        id: savedGoal.id.toString()
      };
      setSavingsGoals(prev => [...prev, goal]);
      
      // Show success toast
      setToast({
        message: 'Savings goal added successfully!',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Failed to add goal:', error);
      setToast({
        message: 'Failed to add savings goal. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleUpdateGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    try {
      await goalsApi.update(id, {
        name: updates.name,
        target_amount: updates.targetAmount,
        current_amount: updates.currentAmount,
        deadline: updates.deadline
      });
      
      setSavingsGoals(prev => prev.map(goal => 
        goal.id === id ? { 
          ...goal, 
          ...updates,
          // Ensure numeric values are properly converted
          targetAmount: typeof updates.targetAmount === 'number' ? updates.targetAmount : goal.targetAmount,
          currentAmount: typeof updates.currentAmount === 'number' ? updates.currentAmount : goal.currentAmount
        } : goal
      ));
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await goalsApi.delete(id);
      setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleUpdateSettings = async (updates: Partial<AppSettings>) => {
    if (!auth?.user?.id) return;

    console.log('🔧 handleUpdateSettings called with:', updates);
    console.log('🔧 Current auth user ID:', auth.user.id);
    console.log('🔧 This is the REAL handleUpdateSettings function!');

    try {
      const newSettings = { ...settings, ...updates };
      console.log('🔧 New settings to save:', newSettings);
      console.log('🔧 Previous settings state:', settings);
      console.log('🔧 Updates received:', updates);
      setSettings(newSettings);
      console.log('🔧 Settings state updated to:', newSettings);
      
      // Save to localStorage first (as backup)
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      console.log('✅ Settings saved to localStorage');
      
      // Try to save to database
      try {
        console.log('💾 Attempting to save to database...');
        const dbResponse = await settingsApi.updateByUser(auth.user.id, {
          currency: newSettings.currency,
          monthly_income_target: newSettings.monthlyIncome
        });
        console.log('✅ Database save successful:', dbResponse);
      } catch (dbError) {
        console.error('❌ Database save failed:', dbError);
        console.warn('Database save failed, using localStorage only:', dbError);
      }
      
      // Show toast notification
      setToast({
        message: 'Settings saved successfully!',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      setToast({
        message: 'Failed to save settings. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'history', label: 'History', icon: History },
    { id: 'advisor', label: 'Financial Advisor', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, highlight: true }
  ];

  const renderContent = () => {
    // Show loading state while data is being fetched
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your financial data...</p>
            <p className="text-gray-400 text-sm">Please wait while we fetch your information</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            summary={summary}
            settings={settings}
            savingsGoals={savingsGoals}
            recentTransactions={transactions}
            onAddTransaction={() => setShowTransactionForm(true)}
            loading={loading}
          />
        );
      case 'budgets':
        return (
          <BudgetManager
            budgets={budgets}
            settings={settings}
            onAddBudget={handleAddBudget}
            onUpdateBudget={handleUpdateBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        );
      case 'goals':
        return (
          <SavingsGoals
            goals={savingsGoals}
            settings={settings}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case 'history':
        return <TransactionHistory transactions={transactions} settings={settings} onDeleteTransaction={handleDeleteTransaction} />;
      case 'advisor':
        return <FinancialAdvisor settings={settings} />;
      case 'settings':
        return <Settings settings={settings} onUpdateSettings={handleUpdateSettings} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // Try to load auth from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('🔍 Checking localStorage for auth data...');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    
    if (token && user) {
      const userData = JSON.parse(user);
      console.log('✅ Loading auth from localStorage:', userData);
      setAuth({ token, user: userData });
    } else {
      console.log('❌ No auth data found in localStorage');
    }
    
    // Clear old settings from localStorage to use new defaults
    localStorage.removeItem('appSettings');
  }, []);

  const handleLogin = (token: string, user: { id: number; name: string; email: string }) => {
    setAuth({ token, user });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!auth) {
    return (
      <>
        {showRegister ? (
          <Register onRegister={handleLogin} onShowLogin={() => setShowRegister(false)} />
        ) : (
          <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />
        )}
      </>
    );
  }

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
      
      {/* Logout button will be moved to header */}
      {/* Mobile menu backdrop */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        showMobileMenu ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">FinanceFlow</h1>
          </div>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as ActiveTab);
                setShowMobileMenu(false);
              }}
              disabled={loading}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors relative ${
                activeTab === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.highlight && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  Currency
                </span>
              )}
              {/* Active indicator underline */}
              {activeTab === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
        
        {/* Mobile logout button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileMenu(true)}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">
                {activeTab === 'goals' ? 'Savings Goals' : 
                 activeTab === 'settings' ? 'Settings' : activeTab}
              </h2>
            </div>
            {/* Logout button in header */}
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          onAddTransaction={handleAddTransaction}
          onClose={() => setShowTransactionForm(false)}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Data</h3>
            <p className="text-gray-600">Please wait while we fetch your financial information...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;