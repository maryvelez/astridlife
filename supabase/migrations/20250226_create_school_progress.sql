-- Create programs table
create table if not exists programs (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    total_credits integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create courses table
create table if not exists courses (
    id uuid default gen_random_uuid() primary key,
    program_id uuid references programs(id) on delete cascade,
    name text not null,
    code text not null,
    credits integer not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_programs table to track which program a user is in
create table if not exists user_programs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    program_id uuid references programs(id) on delete cascade,
    start_date date not null,
    expected_completion_date date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, program_id)
);

-- Create user_courses table to track course progress
create table if not exists user_courses (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    course_id uuid references courses(id) on delete cascade,
    status text check (status in ('not_started', 'in_progress', 'completed')) not null default 'not_started',
    grade text,
    start_date date,
    completion_date date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, course_id)
);

-- Insert some sample programs
insert into programs (name, description, total_credits) values
('Nursing', 'Bachelor of Science in Nursing', 120),
('Computer Science', 'Bachelor of Science in Computer Science', 128),
('Psychology', 'Bachelor of Arts in Psychology', 120);

-- Enable RLS
alter table programs enable row level security;
alter table courses enable row level security;
alter table user_programs enable row level security;
alter table user_courses enable row level security;

-- Create policies
create policy "Programs are viewable by all users"
on programs for select
to authenticated
using (true);

create policy "Courses are viewable by all users"
on courses for select
to authenticated
using (true);

create policy "User programs are viewable by the user"
on user_programs for select
to authenticated
using (user_id = auth.uid());

create policy "User programs can be inserted by the user"
on user_programs for insert
to authenticated
with check (user_id = auth.uid());

create policy "User programs can be updated by the user"
on user_programs for update
to authenticated
using (user_id = auth.uid());

create policy "User courses are viewable by the user"
on user_courses for select
to authenticated
using (user_id = auth.uid());

create policy "User courses can be inserted by the user"
on user_courses for insert
to authenticated
with check (user_id = auth.uid());

create policy "User courses can be updated by the user"
on user_courses for update
to authenticated
using (user_id = auth.uid());
