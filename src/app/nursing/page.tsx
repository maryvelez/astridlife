"use client";

import { useState } from 'react';
import Modal from '../components/Modal';

interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  weight: number;
  completed: boolean;
  category: string;
  steps: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export default function NursingPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [newAssignment, setNewAssignment] = useState({
    name: '',
    dueDate: '',
    weight: 0,
    category: 'Exam'
  });
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [newStep, setNewStep] = useState('');

  const categories = ['Exam', 'Paper', 'Project', 'Quiz', 'Lab', 'Other'];

  const addOrUpdateAssignment = () => {
    if (!newAssignment.name || !newAssignment.dueDate || !newAssignment.weight) return;

    if (editingAssignment) {
      setAssignments(prev => prev.map(a => 
        a.id === editingAssignment.id 
          ? {
              ...editingAssignment,
              name: newAssignment.name,
              dueDate: newAssignment.dueDate,
              weight: newAssignment.weight,
              category: newAssignment.category
            }
          : a
      ));
    } else {
      const assignment: Assignment = {
        id: Date.now().toString(),
        name: newAssignment.name,
        dueDate: newAssignment.dueDate,
        weight: newAssignment.weight,
        category: newAssignment.category,
        completed: false,
        steps: []
      };
      setAssignments(prev => [...prev, assignment]);
    }

    setNewAssignment({ name: '', dueDate: '', weight: 0, category: 'Exam' });
    setEditingAssignment(null);
    setShowNewAssignmentModal(false);
  };

  const editAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setNewAssignment({
      name: assignment.name,
      dueDate: assignment.dueDate,
      weight: assignment.weight,
      category: assignment.category
    });
    setShowNewAssignmentModal(true);
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const addStep = (assignmentId: string) => {
    if (!newStep.trim()) return;

    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          steps: [...assignment.steps, {
            id: Date.now().toString(),
            text: newStep,
            completed: false
          }]
        };
      }
      return assignment;
    }));

    setNewStep('');
  };

  const deleteStep = (assignmentId: string, stepId: string) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          steps: assignment.steps.filter(step => step.id !== stepId)
        };
      }
      return assignment;
    }));
  };

  const toggleStep = (assignmentId: string, stepId: string) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        const updatedSteps = assignment.steps.map(step => 
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );
        const allStepsCompleted = updatedSteps.every(step => step.completed);
        return {
          ...assignment,
          steps: updatedSteps,
          completed: allStepsCompleted
        };
      }
      return assignment;
    }));
  };

  const calculateProgress = () => {
    if (assignments.length === 0) return 0;
    const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0);
    const completedWeight = assignments
      .filter(a => a.completed)
      .reduce((sum, a) => sum + a.weight, 0);
    return (completedWeight / totalWeight) * 100;
  };

  const calculateCategoryStats = () => {
    const stats = categories.map(category => {
      const categoryAssignments = assignments.filter(a => a.category === category);
      const total = categoryAssignments.length;
      const completed = categoryAssignments.filter(a => a.completed).length;
      const totalWeight = categoryAssignments.reduce((sum, a) => sum + a.weight, 0);
      return { category, total, completed, totalWeight };
    });
    return stats.filter(s => s.total > 0);
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nursing Progress</h1>
          <button
            onClick={() => setShowNewAssignmentModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Assignment
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Progress</h3>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(calculateProgress())}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Total Assignments</h3>
            <div className="text-3xl font-bold text-purple-600">
              {assignments.length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Completed</h3>
            <div className="text-3xl font-bold text-green-600">
              {assignments.filter(a => a.completed).length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Remaining</h3>
            <div className="text-3xl font-bold text-amber-600">
              {assignments.filter(a => !a.completed).length}
            </div>
          </div>
        </div>

        {/* Category Progress */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress by Category</h2>
          <div className="space-y-4">
            {calculateCategoryStats().map(stat => (
              <div key={stat.category}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{stat.category}</span>
                  <span>{stat.completed}/{stat.total} ({stat.totalWeight}%)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(stat.completed / stat.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Semester Progress</span>
            <span>{Math.round(calculateProgress())}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(assignment => (
            <div 
              key={assignment.id}
              className={`bg-white rounded-xl p-6 shadow-lg transition-colors ${
                assignment.completed ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {assignment.category}
                    </span>
                  </div>
                  <p className="text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  <p className="text-gray-500">Weight: {assignment.weight}%</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editAssignment(assignment)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAssignment(assignment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setActiveAssignment(activeAssignment?.id === assignment.id ? null : assignment)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    {activeAssignment?.id === assignment.id ? 'Close' : 'Steps'}
                  </button>
                </div>
              </div>

              {/* Steps List */}
              {(activeAssignment?.id === assignment.id || assignment.steps.length > 0) && (
                <div className="space-y-2">
                  {assignment.steps.map(step => (
                    <div 
                      key={step.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={() => toggleStep(assignment.id, step.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`flex-1 ${step.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {step.text}
                      </span>
                      <button
                        onClick={() => deleteStep(assignment.id, step.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Step Input */}
              {activeAssignment?.id === assignment.id && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    placeholder="Add a step..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addStep(assignment.id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* New/Edit Assignment Modal */}
        {showNewAssignmentModal && (
          <Modal 
            title={editingAssignment ? "Edit Assignment" : "Add New Assignment"} 
            onClose={() => {
              setShowNewAssignmentModal(false);
              setEditingAssignment(null);
              setNewAssignment({ name: '', dueDate: '', weight: 0, category: 'Exam' });
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Name
                </label>
                <input
                  type="text"
                  value={newAssignment.name}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Midterm Paper"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newAssignment.category}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (%)
                </label>
                <input
                  type="number"
                  value={newAssignment.weight}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20"
                  min="0"
                  max="100"
                />
              </div>
              <button
                onClick={addOrUpdateAssignment}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingAssignment ? 'Update Assignment' : 'Add Assignment'}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </main>
  );
}
