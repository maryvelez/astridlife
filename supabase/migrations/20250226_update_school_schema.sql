-- Add degree information to profiles
alter table profiles 
add column if not exists degree_program text,
add column if not exists expected_graduation date;

-- Update school_tasks to support subtasks and progress
alter table school_tasks
add column if not exists parent_task_id uuid references school_tasks(id),
add column if not exists progress integer default 0 check (progress >= 0 and progress <= 100),
add column if not exists task_type text check (task_type in ('assignment', 'midterm', 'final', 'project', 'other'));
