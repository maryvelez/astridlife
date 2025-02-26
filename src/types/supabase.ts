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
      programs: {
        Row: {
          id: string
          name: string
          description: string | null
          total_credits: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          total_credits: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          total_credits?: number
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          program_id: string
          name: string
          code: string
          credits: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          program_id: string
          name: string
          code: string
          credits: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          name?: string
          code?: string
          credits?: number
          description?: string | null
          created_at?: string
        }
      }
      user_programs: {
        Row: {
          id: string
          user_id: string
          program_id: string
          start_date: string
          expected_completion_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          program_id: string
          start_date: string
          expected_completion_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          program_id?: string
          start_date?: string
          expected_completion_date?: string | null
          created_at?: string
        }
      }
      user_courses: {
        Row: {
          id: string
          user_id: string
          course_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          grade: string | null
          start_date: string | null
          completion_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          status?: 'not_started' | 'in_progress' | 'completed'
          grade?: string | null
          start_date?: string | null
          completion_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          grade?: string | null
          start_date?: string | null
          completion_date?: string | null
          created_at?: string
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
