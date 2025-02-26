'use client';

import { useEffect } from 'react';
import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';
import SchoolProgress from '@/components/SchoolProgress';
import MentalHealthChat from '@/components/MentalHealthChat';

export default function SchoolPage() {
  const { session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Academic Progress</h1>
          <p className="text-gray-300">Track your educational journey and achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Progress Section */}
          <div className="lg:col-span-2">
            <SchoolProgress />
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">📅</span>
                  <span>Set study goals for each week</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📚</span>
                  <span>Review your notes regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎯</span>
                  <span>Break large tasks into smaller ones</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🤝</span>
                  <span>Join study groups for difficult courses</span>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="bg-white/5 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Helpful Resources</h2>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.khanacademy.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <span className="mr-2">📺</span>
                    Khan Academy
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.coursera.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <span className="mr-2">🎓</span>
                    Coursera
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.edx.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <span className="mr-2">💡</span>
                    edX
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mental Health Support */}
      <div className="fixed bottom-8 right-8 z-50">
        <MentalHealthChat />
      </div>
    </div>
  );
}
