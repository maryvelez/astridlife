'use client'

import { createContext, useEffect, useState, useContext } from 'react'
import { createClientComponentClient, type SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase'

type SupabaseContext = SupabaseClient<Database>

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <Context.Provider value={supabase}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
