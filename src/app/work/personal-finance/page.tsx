"use client";

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { Line, Pie } from 'react-chartjs-2';
import Header from '../../../components/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Education',
  'Travel',
  'Other'
];

export default function PersonalFinancePage() {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: EXPENSE_CATEGORIES[0],
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  // Load data from localStorage
  useEffect(() => {
    const savedBalance = localStorage.getItem('personalFinanceBalance');
    const savedExpenses = localStorage.getItem('personalFinanceExpenses');
    
    if (savedBalance) setTotalBalance(Number(savedBalance));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('personalFinanceBalance', totalBalance.toString());
    localStorage.setItem('personalFinanceExpenses', JSON.stringify(expenses));
  }, [totalBalance, expenses]);

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      alert('Please fill in all required fields');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category!,
      description: newExpense.description,
      amount: newExpense.amount,
      date: newExpense.date!
    };

    setExpenses(prev => [...prev, expense]);
    setTotalBalance(prev => prev - newExpense.amount!);
    setShowAddModal(false);
    setNewExpense({
      category: EXPENSE_CATEGORIES[0],
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteExpense = (expense: Expense) => {
    setExpenses(prev => prev.filter(e => e.id !== expense.id));
    setTotalBalance(prev => prev + expense.amount);
  };

  // Get monthly expenses data for charts
  const getMonthlyData = () => {
    const monthlyExpenses = expenses.filter(expense => 
      expense.date.startsWith(selectedMonth)
    );

    const categoryTotals = EXPENSE_CATEGORIES.map(category => ({
      category,
      total: monthlyExpenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0)
    })).filter(cat => cat.total > 0);

    return {
      labels: categoryTotals.map(cat => cat.category),
      datasets: [{
        label: 'Expenses by Category',
        data: categoryTotals.map(cat => cat.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)'
        ]
      }]
    };
  };

  // Get spending trend data
  const getTrendData = () => {
    const months = [...new Set(expenses.map(e => e.date.slice(0, 7)))].sort();
    const monthlyTotals = months.map(month => ({
      month,
      total: expenses
        .filter(e => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0)
    }));

    return {
      labels: monthlyTotals.map(m => {
        const [year, month] = m.month.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      datasets: [{
        label: 'Monthly Spending',
        data: monthlyTotals.map(m => m.total),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Balance Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Total Balance</h2>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={totalBalance}
                  onChange={(e) => setTotalBalance(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-xl font-semibold"
                />
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>

          {/* Month Selection and Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Monthly Breakdown</h3>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="h-[300px]">
                <Pie data={getMonthlyData()} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Spending Trend</h3>
              <div className="h-[300px]">
                <Line 
                  data={getTrendData()} 
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `$${value}`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Expenses</h3>
            <div className="space-y-4">
              {expenses
                .filter(expense => expense.date.startsWith(selectedMonth))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(expense => (
                  <div 
                    key={expense.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">{expense.description}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-red-600">-${expense.amount}</span>
                      <button
                        onClick={() => deleteExpense(expense)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddModal && (
          <Modal
            title="Add New Expense"
            onClose={() => {
              setShowAddModal(false);
              setNewExpense({
                category: EXPENSE_CATEGORIES[0],
                description: '',
                amount: 0,
                date: new Date().toISOString().split('T')[0]
              });
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {EXPENSE_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="What did you spend on?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={newExpense.amount || ''}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={addExpense}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Expense
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewExpense({
                      category: EXPENSE_CATEGORIES[0],
                      description: '',
                      amount: 0,
                      date: new Date().toISOString().split('T')[0]
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </main>
  );
}
