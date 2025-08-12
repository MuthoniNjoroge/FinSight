import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Target, Info, PlusCircle } from 'lucide-react';
import { Transaction, SavingsGoal, FinancialSummary, AppSettings } from '../types/finance';
import { formatCurrency } from '../utils/finance';

interface DashboardProps {
  summary: FinancialSummary;
  savingsGoals: SavingsGoal[];
  recentTransactions: Transaction[];
  settings: AppSettings;
  onAddTransaction?: () => void;
  loading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, savingsGoals, recentTransactions, settings, onAddTransaction, loading }) => {
  const totalSavingsGoalTarget = savingsGoals.reduce((sum, goal) => sum + (Number(goal.targetAmount) || 0), 0);
  const totalSavingsGoalCurrent = savingsGoals.reduce((sum, goal) => sum + (Number(goal.currentAmount) || 0), 0);
  const savingsProgress = totalSavingsGoalTarget > 0 ? (totalSavingsGoalCurrent / totalSavingsGoalTarget) * 100 : 0;

  const StatCard = ({ title, value, icon: Icon, color, trend }: {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
    trend?: 'up' | 'down';
  }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Data Source Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">How your totals are calculated:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• <strong>Total Income:</strong> Sum of all your income transactions</li>
              <li>• <strong>Total Expenses:</strong> Sum of all your expense transactions</li>
              <li>• <strong>Net Savings:</strong> Total Income minus Total Expenses</li>
              <li>• <strong>Monthly Income Target:</strong> Set in Settings (click Settings in sidebar)</li>
            </ul>
            {recentTransactions.length === 0 && (
              <p className="mt-2 font-medium text-blue-800">
                Start by adding your first transaction using the "Add Transaction" button below!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      {onAddTransaction && (
        <div className="flex justify-end">
          <button
            onClick={onAddTransaction}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Transaction
              </>
            )}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome, settings.currency)}
          icon={DollarSign}
          color="bg-green-500"
          trend="up"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses, settings.currency)}
          icon={DollarSign}
          color="bg-red-500"
          trend="down"
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(summary.totalSavings, settings.currency)}
          icon={PiggyBank}
          color="bg-blue-500"
        />
        <StatCard
          title="Monthly Income Target"
          value={formatCurrency(settings.monthlyIncome, settings.currency)}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Savings Goals Progress
          </h3>
          {savingsGoals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No savings goals yet</p>
              <p className="text-sm text-gray-400">Click on "Goals" in the sidebar to create your first savings goal!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(totalSavingsGoalCurrent, settings.currency)} / {formatCurrency(totalSavingsGoalTarget, settings.currency)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-300 bg-blue-500"
                    style={{ width: `${Math.min(savingsProgress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">{savingsProgress.toFixed(1)}% complete</div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Individual Goals:</p>
              </div>
              
              {savingsGoals.slice(0, 3).map((goal) => {
                const currentAmount = Number(goal.currentAmount) || 0;
                const targetAmount = Number(goal.targetAmount) || 0;
                const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(currentAmount, settings.currency)} / {formatCurrency(targetAmount, settings.currency)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: goal.color
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{progress.toFixed(1)}% complete</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No transactions yet</p>
              <p className="text-sm text-gray-400">Add your first transaction to start tracking your finances!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, settings.currency)}
                    </p>
                    <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;