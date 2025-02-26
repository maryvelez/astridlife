import SupabaseProvider from '@/app/supabase-provider';

export default function Template({ children }: { children: React.ReactNode }) {
  return <SupabaseProvider>{children}</SupabaseProvider>;
}
