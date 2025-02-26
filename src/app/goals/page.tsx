import React from 'react';

export default function GoalsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center">
        <div className="bg-gradient-to-br from-amber-900/95 to-amber-800/90 backdrop-blur-sm shadow-lg rounded-3xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-amber-100 mb-6 flex items-center gap-3">
            <span className="text-4xl">🎯</span>
            Daily Goals
          </h1>
          
          <div className="space-y-6">
            <div className="bg-amber-800/50 rounded-xl p-6">
              <h2 className="text-xl text-amber-100 mb-4">Today's Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-200">Study Time</span>
                    <span className="text-amber-200">2/3 hours</span>
                  </div>
                  <div className="w-full h-2 bg-amber-950/30 rounded-full">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-200">Exercise</span>
                    <span className="text-amber-200">30/45 minutes</span>
                  </div>
                  <div className="w-full h-2 bg-amber-950/30 rounded-full">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-200">Reading</span>
                    <span className="text-amber-200">1/2 chapters</span>
                  </div>
                  <div className="w-full h-2 bg-amber-950/30 rounded-full">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-800/50 rounded-xl p-6">
              <h2 className="text-xl text-amber-100 mb-4">Weekly Achievements</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-amber-200">
                  <div className="text-4xl font-semibold">12</div>
                  <div className="text-sm opacity-70">Goals Completed</div>
                </div>
                <div className="text-amber-200">
                  <div className="text-4xl font-semibold">85%</div>
                  <div className="text-sm opacity-70">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-amber-800/50 rounded-xl p-6">
              <h2 className="text-xl text-amber-100 mb-4">Upcoming Goals</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-amber-200">
                  <span>📚</span>
                  <span>Complete chapter 5 of calculus</span>
                </div>
                <div className="flex items-center gap-3 text-amber-200">
                  <span>💪</span>
                  <span>45 minute workout session</span>
                </div>
                <div className="flex items-center gap-3 text-amber-200">
                  <span>✍️</span>
                  <span>Write essay outline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-400">You haven't set any goals yet.</p>
    </main>
  );
}
