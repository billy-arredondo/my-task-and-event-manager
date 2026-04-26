-- Create tasks table
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  description text not null,
  deadline    timestamptz,
  completed   boolean not null default false,
  priority    text check (priority in ('low', 'medium', 'high')),
  category    text,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- Policies: each user can only access their own tasks
create policy "Users can view own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);
