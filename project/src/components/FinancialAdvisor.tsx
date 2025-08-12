import React, { useState } from 'react';
import { MessageCircle, Lightbulb, Calculator, Target, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { AppSettings } from '../types/finance';
import { formatCurrency } from '../utils/finance';

interface FinancialAdvisorProps {
  settings: AppSettings;
}

interface ExpenseItem {
  name: string;
  amount: number;
  category: string;
}

interface FinancialAdvice {
  essentialPercentage: number;
  discretionaryPercentage: number;
  savingsPercentage: number;
  recommendations: string[];
  warnings: string[];
  budgetBreakdown: {
    essential: ExpenseItem[];
    discretionary: ExpenseItem[];
    savings: number;
  };
}

const FinancialAdvisor: React.FC<FinancialAdvisorProps> = ({ settings }) => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '' });
  const [advice, setAdvice] = useState<FinancialAdvice | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const expenseCategories = [
    'Housing', 'Food & Dining', 'Transportation', 'Utilities', 
    'Healthcare', 'Insurance', 'Entertainment', 'Shopping', 
    'Education', 'Debt Payments', 'Other'
  ];

  const addExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.category) {
      setExpenses([...expenses, {
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category
      }]);
      setNewExpense({ name: '', amount: '', category: '' });
    }
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const analyzeFinances = () => {
    if (!monthlyIncome || expenses.length === 0) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay for better UX
    setTimeout(() => {
      const income = parseFloat(monthlyIncome);
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Categorize expenses
      const essentialCategories = ['Housing', 'Food & Dining', 'Transportation', 'Utilities', 'Healthcare', 'Insurance'];
      const essentialExpenses = expenses.filter(exp => essentialCategories.includes(exp.category));
      const discretionaryExpenses = expenses.filter(exp => !essentialCategories.includes(exp.category));
      
      const essentialTotal = essentialExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const discretionaryTotal = discretionaryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Calculate percentages
      const essentialPercentage = (essentialTotal / income) * 100;
      const discretionaryPercentage = (discretionaryTotal / income) * 100;
      const savingsPercentage = 100 - essentialPercentage - discretionaryPercentage;
      
      // Generate recommendations
      const recommendations: string[] = [];
      const warnings: string[] = [];
      
      // Housing advice (should be 25-30% of income)
      const housingExpense = expenses.find(exp => exp.category === 'Housing');
      if (housingExpense) {
        const housingPercentage = (housingExpense.amount / income) * 100;
        if (housingPercentage > 30) {
          warnings.push(`Housing costs (${housingPercentage.toFixed(1)}%) are above the recommended 30% threshold. Consider finding more affordable housing or getting a roommate.`);
        } else if (housingPercentage < 25) {
          recommendations.push(`Great job keeping housing costs low at ${housingPercentage.toFixed(1)}%! This gives you more flexibility for other expenses.`);
        }
      }
      
      // Essential expenses advice (should be 50-60% of income)
      if (essentialPercentage > 60) {
        warnings.push(`Essential expenses (${essentialPercentage.toFixed(1)}%) are consuming too much of your income. Look for ways to reduce basic costs.`);
      } else if (essentialPercentage < 50) {
        recommendations.push(`Excellent! Essential expenses are only ${essentialPercentage.toFixed(1)}% of your income, giving you room for savings and discretionary spending.`);
      }
      
      // Discretionary spending advice (should be 20-30% of income)
      if (discretionaryPercentage > 30) {
        warnings.push(`Discretionary spending (${discretionaryPercentage.toFixed(1)}%) is high. Consider reducing non-essential expenses to increase savings.`);
      }
      
      // Savings advice (should be 20% or more)
      if (savingsPercentage < 20) {
        warnings.push(`Savings rate (${savingsPercentage.toFixed(1)}%) is below the recommended 20%. Try to increase your savings for emergencies and future goals.`);
      } else {
        recommendations.push(`Outstanding savings rate of ${savingsPercentage.toFixed(1)}%! You're building a strong financial foundation.`);
      }
      
      // Emergency fund advice
      const monthlyExpenses = totalExpenses;
      const emergencyFundTarget = monthlyExpenses * 6;
      if (savingsPercentage >= 20) {
        recommendations.push(`With your current savings rate, you could build a 6-month emergency fund in about ${Math.ceil(emergencyFundTarget / (income * (savingsPercentage / 100)))} months.`);
      }
      
      // Debt advice
      const debtExpense = expenses.find(exp => exp.category === 'Debt Payments');
      if (debtExpense) {
        const debtPercentage = (debtExpense.amount / income) * 100;
        if (debtPercentage > 20) {
          warnings.push(`Debt payments (${debtPercentage.toFixed(1)}%) are high. Focus on paying down high-interest debt first.`);
        }
      }
      
      // General recommendations
      if (recommendations.length === 0) {
        recommendations.push("Your budget looks well-balanced! Keep up the good work.");
      }
      
      setAdvice({
        essentialPercentage,
        discretionaryPercentage,
        savingsPercentage,
        recommendations,
        warnings,
        budgetBreakdown: {
          essential: essentialExpenses,
          discretionary: discretionaryExpenses,
          savings: income - totalExpenses
        }
      });
      
      setIsAnalyzing(false);
    }, 1500);
  };

  const resetForm = () => {
    setMonthlyIncome('');
    setExpenses([]);
    setAdvice(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <MessageCircle className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Advisor</h2>
          <p className="text-gray-600">Get personalized advice on how to divide your salary</p>
        </div>
      </div>

      {!advice ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="space-y-6">
            {/* Monthly Income Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calculator className="w-4 h-4 inline mr-2" />
                Monthly Income ({settings.currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your monthly income"
                required
              />
            </div>

            {/* Expenses List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Target className="w-4 h-4 inline mr-2" />
                Monthly Expenses
              </label>
              
              {/* Add New Expense */}
              <div className="flex space-x-3 mb-4">
                <input
                  type="text"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Expense name"
                />
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Amount"
                />
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Category</option>
                  {expenseCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  onClick={addExpense}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Expenses List */}
              {expenses.length > 0 && (
                <div className="space-y-2">
                  {expenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{expense.name}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {expense.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(expense.amount, settings.currency)}
                        </span>
                        <button
                          onClick={() => removeExpense(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <div className="pt-4">
              <button
                onClick={analyzeFinances}
                disabled={!monthlyIncome || expenses.length === 0 || isAnalyzing}
                className="w-full py-3 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>Get Financial Advice</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Advice Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Financial Analysis</h3>
            
            {/* Percentage Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{advice.essentialPercentage.toFixed(1)}%</div>
                <div className="text-sm text-blue-700">Essential Expenses</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{advice.discretionaryPercentage.toFixed(1)}%</div>
                <div className="text-sm text-yellow-700">Discretionary</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{advice.savingsPercentage.toFixed(1)}%</div>
                <div className="text-sm text-green-700">Savings</div>
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Essential Expenses</h4>
                <div className="space-y-2">
                  {advice.budgetBreakdown.essential.map((expense, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{expense.name}</span>
                      <span className="font-medium">{formatCurrency(expense.amount, settings.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Discretionary Expenses</h4>
                <div className="space-y-2">
                  {advice.budgetBreakdown.discretionary.map((expense, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{expense.name}</span>
                      <span className="font-medium">{formatCurrency(expense.amount, settings.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">Monthly Savings</span>
                  <span className="font-bold text-green-600">{formatCurrency(advice.budgetBreakdown.savings, settings.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {advice.recommendations.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {advice.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {advice.warnings.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {advice.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span className="text-gray-700">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={resetForm}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={() => setAdvice(null)}
              className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Modify Budget
            </button>
          </div>
        </div>
      )}

      {/* Financial Tips */}
      {!advice && (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Financial Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">50/30/20 Rule</h4>
              <p>50% for needs, 30% for wants, 20% for savings</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Housing Rule</h4>
              <p>Keep housing costs under 30% of your income</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Emergency Fund</h4>
              <p>Save 3-6 months of expenses for emergencies</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Debt Rule</h4>
              <p>Keep debt payments under 20% of your income</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAdvisor; 