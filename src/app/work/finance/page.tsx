"use client";

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Modal from '../../../components/Modal'; // Import from the shared components directory

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
}

interface MonthlyTotal {
  month: string;
  total: number;
}

export default function FinancePage() {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [newMonthlyTotal, setNewMonthlyTotal] = useState({
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    total: ''
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('totalBalance');
    const savedExpenses = localStorage.getItem('expenses');
    const savedMonthlyTotals = localStorage.getItem('monthlyTotals');

    if (savedBalance) setTotalBalance(Number(savedBalance));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedMonthlyTotals) setMonthlyTotals(JSON.parse(savedMonthlyTotals));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('totalBalance', totalBalance.toString());
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('monthlyTotals', JSON.stringify(monthlyTotals));
  }, [totalBalance, expenses, monthlyTotals]);

  const addOrUpdateExpense = () => {
    if (!newExpense.amount || !newExpense.date) return;

    if (editingExpense) {
      setExpenses(prev => prev.map(exp => 
        exp.id === editingExpense.id 
          ? {
              ...editingExpense,
              amount: Number(newExpense.amount),
              description: newExpense.description,
              date: newExpense.date
            }
          : exp
      ));
    } else {
      const expense: Expense = {
        id: Date.now().toString(),
        amount: Number(newExpense.amount),
        description: newExpense.description,
        date: newExpense.date
      };
      setExpenses(prev => [...prev, expense]);
      setTotalBalance(prev => prev - Number(newExpense.amount));
    }

    setNewExpense({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    setEditingExpense(null);
    setShowExpenseModal(false);
  };

  const addMonthlyTotal = () => {
    if (!newMonthlyTotal.total || !newMonthlyTotal.month) return;

    const existingIndex = monthlyTotals.findIndex(mt => mt.month === newMonthlyTotal.month);
    
    if (existingIndex !== -1) {
      setMonthlyTotals(prev => prev.map((mt, i) => 
        i === existingIndex 
          ? { ...mt, total: Number(newMonthlyTotal.total) }
          : mt
      ));
    } else {
      setMonthlyTotals(prev => [...prev, {
        month: newMonthlyTotal.month,
        total: Number(newMonthlyTotal.total)
      }]);
    }

    setNewMonthlyTotal({ month: new Date().toISOString().slice(0, 7), total: '' });
    setShowMonthlyModal(false);
  };

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setNewExpense({
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date
    });
    setShowExpenseModal(true);
  };

  const deleteExpense = (expense: Expense) => {
    setExpenses(prev => prev.filter(e => e.id !== expense.id));
    setTotalBalance(prev => prev + expense.amount); // Add the amount back to total balance
  };

  const chartData = {
    labels: monthlyTotals
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(mt => {
        const [year, month] = mt.month.split('-');
        return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyTotals
          .sort((a, b) => a.month.localeCompare(b.month))
          .map(mt => mt.total),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Total Balance Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Total Balance</h2>
            <input
              type="number"
              value={totalBalance}
              onChange={(e) => setTotalBalance(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-xl font-semibold"
            />
          </div>
        </div>

        {/* Monthly Expenses Graph */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Expenses</h2>
            <button
              onClick={() => setShowMonthlyModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add Monthly Total
            </button>
          </div>
          <div className="h-[400px]">
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.parsed.y}`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add Expense
            </button>
          </div>
          <div className="space-y-4">
            {expenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(expense => (
                <div 
                  key={expense.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{expense.description || 'Untitled Expense'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-red-600">-${expense.amount}</span>
                    <button
                      onClick={() => editExpense(expense)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
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

      {/* Add/Edit Expense Modal */}
      {showExpenseModal && (
        <Modal
          title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
          onClose={() => {
            setShowExpenseModal(false);
            setEditingExpense(null);
            setNewExpense({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Groceries"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addOrUpdateExpense}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
              <button
                onClick={() => {
                  setShowExpenseModal(false);
                  setEditingExpense(null);
                  setNewExpense({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Monthly Total Modal */}
      {showMonthlyModal && (
        <Modal
          title="Add Monthly Total"
          onClose={() => {
            setShowMonthlyModal(false);
            setNewMonthlyTotal({ month: new Date().toISOString().slice(0, 7), total: '' });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <input
                type="month"
                value={newMonthlyTotal.month}
                onChange={(e) => setNewMonthlyTotal(prev => ({ ...prev, month: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount ($)
              </label>
              <input
                type="number"
                value={newMonthlyTotal.total}
                onChange={(e) => setNewMonthlyTotal(prev => ({ ...prev, total: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addMonthlyTotal}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Add Monthly Total
              </button>
              <button
                onClick={() => {
                  setShowMonthlyModal(false);
                  setNewMonthlyTotal({ month: new Date().toISOString().slice(0, 7), total: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
