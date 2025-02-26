'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MentalHealthChat from '@/components/MentalHealthChat';
import ProfileSetup from '@/components/ProfileSetup';

export default function Bubbles() {
  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    age: number;
  } | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Fetch profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching profile:', error);
          return;
        }

        if (!profile || (profile.name === null && profile.age === null)) {
          setShowProfileSetup(true);
        } else {
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleProfileComplete = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    setProfile(profile);
    setShowProfileSetup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const bubbles = [
    { href: '/work', icon: '💼', label: 'Work' },
    { href: '/health', icon: '🧘‍♀️', label: 'Health' },
    { href: '/growth', icon: '🌱', label: 'Growth' },
    { href: '/school', icon: '📚', label: 'School' },
    { href: '/social', icon: '👥', label: 'Social' }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {showProfileSetup && <ProfileSetup onComplete={handleProfileComplete} />}

      {/* Aura Background */}
      <div className="aura-bg">
        <div className="aura-circle aura-circle-1"></div>
        <div className="aura-circle aura-circle-2"></div>
        <div className="aura-circle aura-circle-3"></div>
      </div>

      {/* Lock Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSignOut}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <span role="img" aria-label="lock" className="text-xl">🔒</span>
        </button>
      </div>

      {/* Bubbles Grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8">
          {bubbles.map((bubble) => (
            <Link
              key={bubble.href}
              href={bubble.href}
              className="w-24 h-24 rounded-full bg-white/5 hover:bg-white/10 transition-all
                flex flex-col items-center justify-center text-white
                hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <span role="img" aria-label={bubble.label} className="text-3xl mb-1">{bubble.icon}</span>
              <span className="text-sm font-medium">{bubble.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mental Health Chat */}
      <div className="fixed bottom-8 right-8 z-50">
        <MentalHealthChat />
      </div>
    </div>
  );
}
