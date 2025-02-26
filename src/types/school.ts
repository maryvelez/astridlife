export interface Program {
  id: string;
  name: string;
  description: string | null;
  total_credits: number;
  created_at: string;
}

export interface Course {
  id: string;
  program_id: string;
  name: string;
  code: string;
  credits: number;
  description: string | null;
  created_at: string;
}

export interface UserProgram {
  id: string;
  user_id: string;
  program_id: string;
  start_date: string;
  expected_completion_date: string | null;
  created_at: string;
  program?: Program;
}

export interface UserCourse {
  id: string;
  user_id: string;
  course_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  grade: string | null;
  start_date: string | null;
  completion_date: string | null;
  created_at: string;
  course?: Course;
}

export interface SchoolProgress {
  totalCredits: number;
  completedCredits: number;
  inProgressCredits: number;
  remainingCredits: number;
  completionPercentage: number;
  courses: UserCourse[];
}
