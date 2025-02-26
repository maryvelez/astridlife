'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const fullText = "welcome back, friend.";

  useEffect(() => {
    if (!isSignUp) {
      setText('');
      const timeout = setTimeout(() => {
        let i = 0;
        const intervalId = setInterval(() => {
          setText(fullText.slice(0, i + 1));
          i++;
          if (i === fullText.length) {
            clearInterval(intervalId);
          }
        }, 100);
        return () => clearInterval(intervalId);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isSignUp]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`
          }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        router.push('/bubbles');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Aura Background */}
      <div className="aura-bg">
        <div className="aura-circle aura-circle-1"></div>
        <div className="aura-circle aura-circle-2"></div>
        <div className="aura-circle aura-circle-3"></div>
      </div>

      <main className="flex items-center justify-center min-h-screen p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold">
                {isSignUp ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                    Join astrid.
                  </span>
                ) : (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                    {text}
                    <span className="animate-pulse text-pink-400">|</span>
                  </span>
                )}
              </h2>
              <p className="mt-3 text-gray-400">
                {isSignUp 
                  ? 'Create your personal space for growth and reflection.' 
                  : 'Ready to continue your journey?'}
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading 
                  ? 'Just a moment...' 
                  : isSignUp 
                    ? 'Begin your journey' 
                    : 'Enter your space'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isSignUp
                  ? 'Already have a space? Sign in'
                  : "Need a space? Create one"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
