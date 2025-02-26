export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          name: string | null
          nickname: string | null
          age: number | null
          location: string | null
          bio: string | null
          hobbies: string[] | null
          fun_facts: Json | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name?: string | null
          nickname?: string | null
          age?: number | null
          location?: string | null
          bio?: string | null
          hobbies?: string[] | null
          fun_facts?: Json | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string | null
          nickname?: string | null
          age?: number | null
          location?: string | null
          bio?: string | null
          hobbies?: string[] | null
          fun_facts?: Json | null
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
