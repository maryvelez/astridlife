'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
    };
    getUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-white rounded-md border border-purple-200 hover:bg-purple-50 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Quick Access Cards */}
          <Link href="/work" className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">💼</div>
            <h3 className="text-lg font-semibold text-gray-900">Work</h3>
            <p className="text-gray-500">Track your professional goals</p>
          </Link>

          <Link href="/work/personal-finance" className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-900">Finance</h3>
            <p className="text-gray-500">Manage your expenses</p>
          </Link>

          <Link href="/health" className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">❤️</div>
            <h3 className="text-lg font-semibold text-gray-900">Health</h3>
            <p className="text-gray-500">Monitor your well-being</p>
          </Link>

          <Link href="/academic" className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="text-lg font-semibold text-gray-900">Academic</h3>
            <p className="text-gray-500">Track your studies</p>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-xl">💰</span>
                  <div>
                    <p className="text-gray-900">Added new expense</p>
                    <p className="text-sm text-gray-500">Today at 2:30 PM</p>
                  </div>
                </div>
                <span className="text-purple-600 font-medium">$24.99</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-xl">📊</span>
                  <div>
                    <p className="text-gray-900">Updated work progress</p>
                    <p className="text-sm text-gray-500">Yesterday</p>
                  </div>
                </div>
                <span className="text-green-600 font-medium">+15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
