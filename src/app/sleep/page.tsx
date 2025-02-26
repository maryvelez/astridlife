import React from 'react';

export default function SleepPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center">
        <div className="bg-gradient-to-br from-purple-900/95 to-purple-800/90 backdrop-blur-sm shadow-lg rounded-3xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-purple-100 mb-6 flex items-center gap-3">
            <span className="text-4xl">😴</span>
            Sleep Tracking
          </h1>
          
          <div className="space-y-6">
            <div className="bg-purple-800/50 rounded-xl p-6">
              <h2 className="text-xl text-purple-100 mb-4">Sleep Schedule</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-purple-200">
                  <div className="text-sm opacity-70">Bedtime</div>
                  <div className="text-2xl">11:00 PM</div>
                </div>
                <div className="text-purple-200">
                  <div className="text-sm opacity-70">Wake Up</div>
                  <div className="text-2xl">7:00 AM</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/50 rounded-xl p-6">
              <h2 className="text-xl text-purple-100 mb-4">Sleep Quality</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Deep Sleep</span>
                  <span className="text-purple-200">2h 30m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Light Sleep</span>
                  <span className="text-purple-200">4h 15m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">REM</span>
                  <span className="text-purple-200">1h 15m</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/50 rounded-xl p-6">
              <h2 className="text-xl text-purple-100 mb-4">Weekly Average</h2>
              <div className="text-4xl text-purple-100">7.2h</div>
              <div className="text-sm text-purple-300 mt-1">Target: 8h</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
