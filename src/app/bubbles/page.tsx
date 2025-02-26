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
    { href: '/work', icon: '💼', label: 'Work', angle: -Math.PI/4 },
    { href: '/health', icon: '🧘‍♀️', label: 'Health', angle: Math.PI/4 },
    { href: '/growth', icon: '🌱', label: 'Growth', angle: -3*Math.PI/4 },
    { href: '/social', icon: '👥', label: 'Social', angle: 3*Math.PI/4 }
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
      <button
        onClick={handleSignOut}
        className="fixed top-4 right-4 z-50 p-2 text-gray-400 hover:text-white transition-colors group"
        title="Lock your space"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-6 h-6 transform group-hover:scale-110 transition-transform"
        >
          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="cards-container relative z-10">
        {/* Central Name */}
        <Link 
          href="/profile"
          className="central-name cursor-pointer"
        >
          <p className="greeting text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            Hi {profile?.name || 'friend'}
          </p>
          {profile?.age && (
            <p className="age text-gray-400">{profile.age}</p>
          )}
        </Link>

        {/* Brain Cards */}
        {brainCards.map((card) => (
          <Link
            href={card.href}
            key={card.href}
            className="brain-card group"
            style={{
              left: `calc(50% + ${Math.cos(card.angle) * 200}px)`,
              top: `calc(50% + ${Math.sin(card.angle) * 200}px)`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="brain-card-content relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full hover:border-white/20 transition-all transform hover:scale-[1.02] flex flex-col items-center">
                <span className="text-4xl mb-2">{card.icon}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 font-semibold">
                  {card.label}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Donut Ring */}
        <div className="donut-ring border-2 border-white/5"></div>
      </div>

      {/* Mental Health Chat */}
      <MentalHealthChat />
    </div>
  );
}
