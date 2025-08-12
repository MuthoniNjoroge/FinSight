import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Budget, AppSettings } from '../types/finance';
import { formatCurrency, getBudgetStatus, expenseCategories } from '../utils/finance';

interface BudgetManagerProps {
  budgets: Budget[];
  settings: AppSettings;
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onUpdateBudget: (id: string, budget: Partial<Budget>) => void;
  onDeleteBudget: (id: string) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  settings,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget
}) => {
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    customCategory: '',
    allocated: '',
    period: 'monthly' as 'monthly' | 'yearly'
  });

  const handleSubmit = (e: React.FormEvent) => {
    console.log('🔐 Budget form submitted');
    e.preventDefault();
    console.log('🔐 Form data:', formData);
    
    if (!formData.category || !formData.allocated) {
      console.log('❌ Form validation failed - missing category or allocated amount');
      return;
    }

    // Use custom category if "Other" is selected
    const finalCategory = formData.category === 'Other' && formData.customCategory.trim() 
      ? formData.customCategory.trim() 
      : formData.category;

    const budgetData = {
      category: finalCategory,
      allocated: parseFloat(formData.allocated) || 0,
      spent: 0,
      period: formData.period
    };

    console.log('🔐 Budget data to save:', budgetData);

    if (editingBudget) {
      console.log('🔐 Updating existing budget:', editingBudget);
      onUpdateBudget(editingBudget, budgetData);
      setEditingBudget(null);
    } else {
      console.log('🔐 Adding new budget');
      onAddBudget(budgetData);
    }

    setFormData({ category: '', customCategory: '', allocated: '', period: 'monthly' });
    setIsAddingBudget(false);
    console.log('✅ Budget form processed successfully');
  };

  const handleEdit = (budget: Budget) => {
    setFormData({
      category: budget.category,
      customCategory: '',
      allocated: budget.allocated.toString(),
      period: budget.period
    });
    setEditingBudget(budget.id);
    setIsAddingBudget(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'On Track';
      case 'warning': return 'Watch Out';
      case 'danger': return 'Over Budget';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Budget Management</h2>
        <button
          onClick={() => setIsAddingBudget(true)}
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const status = getBudgetStatus(budget);
          const allocated = Number(budget.allocated) || 0;
          const spent = Number(budget.spent) || 0;
          const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
          
          return (
            <div key={budget.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                  <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onDeleteBudget(budget.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className="font-semibold">{formatCurrency(Number(budget.spent) || 0, settings.currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Budget</span>
                  <span className="font-semibold">{formatCurrency(Number(budget.allocated) || 0, settings.currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className={`font-semibold ${
                    (Number(budget.allocated) || 0) - (Number(budget.spent) || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency((Number(budget.allocated) || 0) - (Number(budget.spent) || 0), settings.currency)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progress</span>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'good' ? 'bg-green-100 text-green-800' :
                    status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {status === 'danger' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {getStatusText(status)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(status)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {percentage.toFixed(1)}% used
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAddingBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingBudget ? 'Edit Budget' : 'Add Budget'}
              </h2>
              <button
                onClick={() => {
                  setIsAddingBudget(false);
                  setEditingBudget(null);
                  setFormData({ category: '', customCategory: '', allocated: '', period: 'monthly' });
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-500 transform rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, customCategory: '' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {expenseCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {formData.category === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specify Category</label>
                  <input
                    type="text"
                    value={formData.customCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter custom category name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.allocated}
                  onChange={(e) => setFormData(prev => ({ ...prev, allocated: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as 'monthly' | 'yearly' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingBudget(false);
                    setEditingBudget(null);
                    setFormData({ category: '', customCategory: '', allocated: '', period: 'monthly' });
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;