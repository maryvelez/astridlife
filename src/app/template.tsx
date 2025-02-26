'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, [supabase]);

  // Don't show header on landing page
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link 
              href={user ? '/bubbles' : '/'}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 hover:opacity-80 transition-opacity"
            >
              astrid.
            </Link>
          </div>
        </div>
      </header>
      <div className="pt-16">
        {children}
      </div>
    </>
  );
}
