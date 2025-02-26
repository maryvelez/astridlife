-- Create school_tasks table
create table if not exists school_tasks (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    course_id uuid references courses(id) on delete cascade,
    title text not null,
    description text,
    due_date date not null,
    status text not null check (status in ('todo', 'in_progress', 'completed')),
    priority text not null check (priority in ('low', 'medium', 'high')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table school_tasks enable row level security;

create policy "Users can create their own tasks"
on school_tasks for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can view their own tasks"
on school_tasks for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can update their own tasks"
on school_tasks for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
on school_tasks for delete
to authenticated
using (auth.uid() = user_id);
