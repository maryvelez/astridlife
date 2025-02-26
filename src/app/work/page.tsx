"use client";

import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';

interface FinanceItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  amount?: number;
  status?: string;
}

export default function WorkPage() {
  const [quote, setQuote] = useState('');
  const [activeSection, setActiveSection] = useState('real-estate');
  const [items, setItems] = useState<FinanceItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<FinanceItem>>({
    title: '',
    description: '',
    category: 'real-estate',
    date: new Date().toISOString().split('T')[0]
  });
  
  useEffect(() => {
    // Load items from localStorage on mount
    const savedItems = localStorage.getItem('workItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }

    fetch('https://type.fit/api/quotes')
      .then((response) => response.json())
      .then((data) => {
        const workQuotes = data.filter(q => 
          q.text.toLowerCase().includes('work') || 
          q.text.toLowerCase().includes('success') ||
          q.text.toLowerCase().includes('achieve')
        );
        const randomQuote = workQuotes[Math.floor(Math.random() * workQuotes.length)];
        setQuote(randomQuote.text);
      })
      .catch(() => {
        setQuote("Success is not final, failure is not fatal: it is the courage to continue that counts.");
      });
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workItems', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newItem.title || !newItem.description) {
      alert('Please fill in both title and description');
      return;
    }

    const item: FinanceItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      date: newItem.date || new Date().toISOString().split('T')[0],
      category: activeSection,
      amount: newItem.amount,
      status: 'active'
    };

    setItems(prev => [...prev, item]);
    setShowAddModal(false);
    setNewItem({
      title: '',
      description: '',
      category: activeSection,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Quote Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 italic text-center">{quote}</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveSection('real-estate')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'real-estate' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } transition-colors`}
          >
            Real Estate
          </button>
          <button
            onClick={() => setActiveSection('stocks')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'stocks' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } transition-colors`}
          >
            Stocks
          </button>
          <button
            onClick={() => setActiveSection('sales')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'sales' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } transition-colors`}
          >
            Sales
          </button>
          <a
            href="/work/personal-finance"
            className="px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Personal Finance
          </a>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              {activeSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h2>
            <button
              onClick={() => {
                setNewItem({
                  title: '',
                  description: '',
                  category: activeSection,
                  date: new Date().toISOString().split('T')[0]
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Item
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {items
              .filter(item => item.category === activeSection)
              .map(item => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  {item.amount && (
                    <p className="text-gray-600">Amount: ${item.amount}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <Modal
          title="Add New Item"
          onClose={() => {
            setShowAddModal(false);
            setNewItem({
              title: '',
              description: '',
              category: activeSection,
              date: new Date().toISOString().split('T')[0]
            });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newItem.title || ''}
                onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newItem.description || ''}
                onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (optional)
              </label>
              <input
                type="number"
                value={newItem.amount || ''}
                onChange={e => setNewItem(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount..."
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newItem.date}
                onChange={e => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={addItem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Item
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewItem({
                    title: '',
                    description: '',
                    category: activeSection,
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
    </main>
  );
}
