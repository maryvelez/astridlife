'use client';

import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkUser();
  }, [supabase.auth]);

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Aura Background */}
      <div className="aura-bg">
        <div className="aura-circle aura-circle-1"></div>
        <div className="aura-circle aura-circle-2"></div>
        <div className="aura-circle aura-circle-3"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="pt-20 pb-24 text-center">
            <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-8 floating-card">
              astrid.
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your personal life organizer that adapts to your needs. Track emotions, manage finances, 
              monitor health, and achieve your goals - all in one beautiful space.
            </p>
            <div className="mt-12">
              {isAuthenticated ? (
                <Link
                  href="/bubbles"
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200"
                >
                  Enter Your Space
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200"
                >
                  Enter Your Space
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-24">
            {[
              {
                title: 'Emotional Intelligence',
                description: 'Track and understand your emotional patterns',
                icon: '🎭',
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Financial Mastery',
                description: 'Visualize and optimize your spending habits',
                icon: '💰',
                color: 'from-pink-500 to-rose-500'
              },
              {
                title: 'Health & Wellness',
                description: 'Monitor your well-being and fitness goals',
                icon: '❤️',
                color: 'from-rose-500 to-orange-500'
              },
              {
                title: 'Academic Excellence',
                description: 'Track your learning progress and achievements',
                icon: '📚',
                color: 'from-orange-500 to-yellow-500'
              }
            ].map((feature) => (
              <div 
                key={feature.title} 
                className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 floating-card"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50 backdrop-blur-lg border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your life?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users organizing their lives with astrid.
            </p>
            {!isAuthenticated && (
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 rounded-full text-lg font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all duration-200"
              >
                Start Your Journey
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
