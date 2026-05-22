create extension if not exists "pgcrypto";

drop table if exists public.saved_activities cascade;

create table public.saved_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  description text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists saved_activities_user_idx
  on public.saved_activities(user_id);

create index if not exists saved_activities_user_created_idx
  on public.saved_activities(user_id, created_at desc);

alter table public.saved_activities enable row level security;

create policy "saved_select_own"
on public.saved_activities for select
using (user_id = auth.uid());

create policy "saved_insert_own"
on public.saved_activities for insert
with check (user_id = auth.uid());

create policy "saved_update_own"
on public.saved_activities for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "saved_delete_own"
on public.saved_activities for delete
using (user_id = auth.uid());