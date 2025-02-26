import React from 'react';

export default function ConnectionsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center">
        <div className="bg-gradient-to-br from-rose-900/95 to-rose-800/90 backdrop-blur-sm shadow-lg rounded-3xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-rose-100 mb-6 flex items-center gap-3">
            <span className="text-4xl">🔗</span>
            Connections
          </h1>
          
          <div className="space-y-6">
            <div className="bg-rose-800/50 rounded-xl p-6">
              <h2 className="text-xl text-rose-100 mb-4">Health Apps</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">❤️</span>
                    <div>
                      <div className="text-rose-200">Apple Health</div>
                      <div className="text-sm text-rose-300">Connected</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-rose-700/50 text-rose-200 hover:bg-rose-700/70 transition-colors">
                    Sync Now
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⌚</span>
                    <div>
                      <div className="text-rose-200">Apple Watch</div>
                      <div className="text-sm text-rose-300">Connected</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-rose-700/50 text-rose-200 hover:bg-rose-700/70 transition-colors">
                    Sync Now
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-rose-800/50 rounded-xl p-6">
              <h2 className="text-xl text-rose-100 mb-4">Activity Data</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-rose-200">
                  <div className="text-4xl font-semibold">98%</div>
                  <div className="text-sm opacity-70">Sync Accuracy</div>
                </div>
                <div className="text-rose-200">
                  <div className="text-4xl font-semibold">24/7</div>
                  <div className="text-sm opacity-70">Monitoring</div>
                </div>
              </div>
            </div>

            <div className="bg-rose-800/50 rounded-xl p-6">
              <h2 className="text-xl text-rose-100 mb-4">Add New Connection</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-rose-700/30 hover:bg-rose-700/50 transition-colors">
                  <span className="text-2xl">📱</span>
                  <span className="text-rose-200">Fitness App</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-rose-700/30 hover:bg-rose-700/50 transition-colors">
                  <span className="text-2xl">💪</span>
                  <span className="text-rose-200">Workout App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
