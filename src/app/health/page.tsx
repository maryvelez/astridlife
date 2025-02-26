"use client";

import { useState } from 'react';

interface HealthEntry {
  timestamp: string;
  value: string;
  notes?: string;
}

export default function HealthPage() {
  const [activeModal, setActiveModal] = useState<'food' | 'meditation' | 'activity' | null>(null);
  const [foodEntry, setFoodEntry] = useState('');
  const [meditationMinutes, setMeditationMinutes] = useState('');
  const [activityType, setActivityType] = useState('');
  const [activityNotes, setActivityNotes] = useState('');
  
  const [entries, setEntries] = useState<{
    food: HealthEntry[];
    meditation: HealthEntry[];
    activity: HealthEntry[];
  }>({
    food: [],
    meditation: [],
    activity: []
  });

  const handleSubmit = (type: 'food' | 'meditation' | 'activity') => {
    const now = new Date().toISOString();
    
    switch (type) {
      case 'food':
        if (foodEntry.trim()) {
          setEntries(prev => ({
            ...prev,
            food: [...prev.food, { timestamp: now, value: foodEntry }]
          }));
          setFoodEntry('');
        }
        break;
      case 'meditation':
        if (meditationMinutes.trim()) {
          setEntries(prev => ({
            ...prev,
            meditation: [...prev.meditation, { timestamp: now, value: `${meditationMinutes} minutes` }]
          }));
          setMeditationMinutes('');
        }
        break;
      case 'activity':
        if (activityType.trim()) {
          setEntries(prev => ({
            ...prev,
            activity: [...prev.activity, { 
              timestamp: now, 
              value: activityType,
              notes: activityNotes 
            }]
          }));
          setActivityType('');
          setActivityNotes('');
        }
        break;
    }
    setActiveModal(null);
  };

  const Modal = ({ onClose, title, children }: { onClose: () => void, title: string, children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-rose-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">Health Tracking</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Food Bubble */}
          <button
            onClick={() => setActiveModal('food')}
            className="aspect-square rounded-full bg-gradient-to-br from-green-100 to-emerald-50 shadow-lg flex flex-col items-center justify-center p-8 hover:scale-105 transition-transform"
          >
            <span className="text-4xl mb-3">🥗</span>
            <span className="text-xl font-medium text-emerald-900">Food</span>
            <span className="text-sm text-emerald-700 mt-2">
              {entries.food.length} entries today
            </span>
          </button>

          {/* Meditation Bubble */}
          <button
            onClick={() => setActiveModal('meditation')}
            className="aspect-square rounded-full bg-gradient-to-br from-purple-100 to-indigo-50 shadow-lg flex flex-col items-center justify-center p-8 hover:scale-105 transition-transform"
          >
            <span className="text-4xl mb-3">🧘‍♀️</span>
            <span className="text-xl font-medium text-indigo-900">Meditate</span>
            <span className="text-sm text-indigo-700 mt-2">
              {entries.meditation.length} sessions today
            </span>
          </button>

          {/* Physical Activity Bubble */}
          <button
            onClick={() => setActiveModal('activity')}
            className="aspect-square rounded-full bg-gradient-to-br from-orange-100 to-amber-50 shadow-lg flex flex-col items-center justify-center p-8 hover:scale-105 transition-transform"
          >
            <span className="text-4xl mb-3">💪</span>
            <span className="text-xl font-medium text-amber-900">Activity</span>
            <span className="text-sm text-amber-700 mt-2">
              {entries.activity.length} activities today
            </span>
          </button>
        </div>

        {/* Food Modal */}
        {activeModal === 'food' && (
          <Modal title="Log Food" onClose={() => setActiveModal(null)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What did you eat?
                </label>
                <textarea
                  value={foodEntry}
                  onChange={(e) => setFoodEntry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="e.g., Oatmeal with berries and honey"
                />
              </div>
              <button
                onClick={() => handleSubmit('food')}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Save Entry
              </button>
            </div>
          </Modal>
        )}

        {/* Meditation Modal */}
        {activeModal === 'meditation' && (
          <Modal title="Log Meditation" onClose={() => setActiveModal(null)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How long did you meditate?
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={meditationMinutes}
                    onChange={(e) => setMeditationMinutes(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="15"
                    min="1"
                  />
                  <span className="text-gray-700">minutes</span>
                </div>
              </div>
              <button
                onClick={() => handleSubmit('meditation')}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save Entry
              </button>
            </div>
          </Modal>
        )}

        {/* Activity Modal */}
        {activeModal === 'activity' && (
          <Modal title="Log Physical Activity" onClose={() => setActiveModal(null)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What activity did you do?
                </label>
                <input
                  type="text"
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Running, Yoga, Swimming"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={2}
                  placeholder="e.g., 30 minutes, moderate intensity"
                />
              </div>
              <button
                onClick={() => handleSubmit('activity')}
                className="w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Save Entry
              </button>
            </div>
          </Modal>
        )}

        {/* Today's Entries */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h3 className="font-medium text-emerald-900">Today's Food</h3>
            {entries.food.map((entry, i) => (
              <div key={i} className="bg-white/80 p-3 rounded-lg shadow-sm">
                {entry.value}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-indigo-900">Today's Meditation</h3>
            {entries.meditation.map((entry, i) => (
              <div key={i} className="bg-white/80 p-3 rounded-lg shadow-sm">
                {entry.value}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-amber-900">Today's Activities</h3>
            {entries.activity.map((entry, i) => (
              <div key={i} className="bg-white/80 p-3 rounded-lg shadow-sm">
                <div>{entry.value}</div>
                {entry.notes && (
                  <div className="text-sm text-gray-600 mt-1">{entry.notes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
