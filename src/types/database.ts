export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  degree_program?: string;
  expected_graduation?: string;
  created_at: string;
  updated_at: string;
}

export interface SchoolTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date: string;
  task_type: 'assignment' | 'midterm' | 'final' | 'project' | 'other';
  progress: number;
  parent_task_id?: string;
  created_at: string;
  updated_at: string;
}
