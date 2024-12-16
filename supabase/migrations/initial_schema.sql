-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create tables
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique,
  check_in_frequency interval default '24:00:00',
  notification_settings jsonb default '{"enabled": true, "frequency": "daily", "quietHours": {"start": "22:00", "end": "08:00"}}'::jsonb
);

create table public.state_check_ins (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  mental_state text not null check (mental_state in ('clear', 'foggy', 'scattered', 'focused')),
  energy_level smallint not null check (energy_level between 1 and 5),
  current_focus text,
  triggers text[],
  notes text
);

create table public.patterns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  triggers text[],
  countermeasures text[]
);

-- Set up row level security (RLS)
alter table public.profiles enable row level security;
alter table public.state_check_ins enable row level security;
alter table public.patterns enable row level security;

-- Create policies
create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can view their own check-ins."
  on public.state_check_ins for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own check-ins."
  on public.state_check_ins for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own check-ins."
  on public.state_check_ins for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own check-ins."
  on public.state_check_ins for delete
  using ( auth.uid() = user_id );

create policy "Users can view their own patterns."
  on public.patterns for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own patterns."
  on public.patterns for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own patterns."
  on public.patterns for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own patterns."
  on public.patterns for delete
  using ( auth.uid() = user_id );

-- Create functions
create or replace function public.handle_new_user()
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

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create indexes
create index state_check_ins_user_id_idx on public.state_check_ins(user_id);
create index state_check_ins_created_at_idx on public.state_check_ins(created_at);
create index patterns_user_id_idx on public.patterns(user_id);
