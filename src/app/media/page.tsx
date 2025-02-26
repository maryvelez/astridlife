"use client";

import { useState } from 'react';

interface Goal {
  text: string;
  steps: string[];
}

export default function MediaPage() {
  const [sesaGoals, setSesaGoals] = useState<Goal[]>([]);
  const [latinasianGoals, setLatinasianGoals] = useState<Goal[]>([]);
  const [sesaNewGoalText, setSesaNewGoalText] = useState('');
  const [latinasianNewGoalText, setLatinasianNewGoalText] = useState('');
  const [newStepText, setNewStepText] = useState('');
  const [activeGoalIndex, setActiveGoalIndex] = useState<number | null>(null);
  const [activeColumn, setActiveColumn] = useState<'sesa' | 'latinasian' | null>(null);

  const addGoal = (platform: 'sesa' | 'latinasian') => {
    if (platform === 'sesa') {
      if (!sesaNewGoalText.trim()) return;
      setSesaGoals([...sesaGoals, { text: sesaNewGoalText, steps: [] }]);
      setSesaNewGoalText('');
    } else {
      if (!latinasianNewGoalText.trim()) return;
      setLatinasianGoals([...latinasianGoals, { text: latinasianNewGoalText, steps: [] }]);
      setLatinasianNewGoalText('');
    }
  };

  const addStep = (platform: 'sesa' | 'latinasian', goalIndex: number) => {
    if (!newStepText.trim() || activeGoalIndex === null) return;

    if (platform === 'sesa') {
      const updatedGoals = [...sesaGoals];
      updatedGoals[goalIndex].steps.push(newStepText);
      setSesaGoals(updatedGoals);
    } else {
      const updatedGoals = [...latinasianGoals];
      updatedGoals[goalIndex].steps.push(newStepText);
      setLatinasianGoals(updatedGoals);
    }

    setNewStepText('');
  };

  const renderGoalsList = (goals: Goal[], platform: 'sesa' | 'latinasian') => (
    <div className="space-y-4">
      {goals.map((goal, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">{goal.text}</h3>
          
          <div className="pl-4 space-y-2">
            {goal.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="flex items-center space-x-2">
                <span className="text-purple-500">•</span>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>

          {activeGoalIndex === index && activeColumn === platform && (
            <div className="mt-3 flex space-x-2">
              <input
                type="text"
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                placeholder="Add a step..."
                className="flex-1 px-3 py-1 rounded border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                onKeyPress={(e) => e.key === 'Enter' && addStep(platform, index)}
              />
              <button
                onClick={() => addStep(platform, index)}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Add
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setActiveGoalIndex(activeGoalIndex === index ? null : index);
              setActiveColumn(platform);
            }}
            className="mt-2 text-sm text-purple-500 hover:text-purple-700"
          >
            {activeGoalIndex === index && activeColumn === platform ? 'Done' : 'Add Steps'}
          </button>
        </div>
      ))}

      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={platform === 'sesa' ? sesaNewGoalText : latinasianNewGoalText}
          onChange={(e) => platform === 'sesa' ? 
            setSesaNewGoalText(e.target.value) : 
            setLatinasianNewGoalText(e.target.value)
          }
          placeholder="Add a new goal..."
          className="flex-1 px-3 py-2 rounded border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          onKeyPress={(e) => e.key === 'Enter' && addGoal(platform)}
        />
        <button
          onClick={() => addGoal(platform)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Add Goal
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-900">Media Goals</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* SESA Column */}
          <div className="bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center text-purple-800">
              SESA 📱
            </h2>
            {renderGoalsList(sesaGoals, 'sesa')}
          </div>

          {/* @thelatinasian Column */}
          <div className="bg-gradient-to-br from-pink-100/50 to-purple-100/50 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center text-purple-800">
              @thelatinasian 📸
            </h2>
            {renderGoalsList(latinasianGoals, 'latinasian')}
          </div>
        </div>
      </div>
    </main>
  );
}
