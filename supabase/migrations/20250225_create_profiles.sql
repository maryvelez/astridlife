-- Create a table for public profiles
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    name text,
    age int,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by owner."
    on profiles for select
    using ( auth.uid() = id );

create policy "Users can insert their own profile."
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update own profile."
    on profiles for update
    using ( auth.uid() = id );

-- Create function to handle new user profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id)
    values (new.id);
    return new;
end;
$$;

-- Create trigger for new users
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
