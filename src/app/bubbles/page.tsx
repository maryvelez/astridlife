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

  const brainCards = [
    { href: '/work', icon: '💼', label: 'Work', angle: -Math.PI/6 },
    { href: '/health', icon: '🧘‍♀️', label: 'Health', angle: Math.PI/6 },
    { href: '/growth', icon: '🌱', label: 'Growth', angle: -Math.PI/2 },
    { href: '/school', icon: '📚', label: 'School', angle: Math.PI/2 },
    { href: '/social', icon: '👥', label: 'Social', angle: -5*Math.PI/6 }
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

      {/* Center Brain Icon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="text-6xl animate-float">🧠</div>
        </div>
      </div>

      {/* Orbiting Cards */}
      {brainCards.map((card, index) => {
        const radius = 180; // Distance from center
        const x = Math.cos(card.angle) * radius;
        const y = Math.sin(card.angle) * radius;

        return (
          <Link
            key={card.href}
            href={card.href}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              w-24 h-24 rounded-full bg-white/5 hover:bg-white/10 transition-all
              flex flex-col items-center justify-center text-white
              hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20`}
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
            }}
          >
            <span role="img" aria-label={card.label} className="text-3xl mb-1">{card.icon}</span>
            <span className="text-sm font-medium">{card.label}</span>
          </Link>
        );
      })}

      {/* Mental Health Chat */}
      <div className="fixed bottom-8 right-8">
        <MentalHealthChat />
      </div>
    </div>
  );
}
