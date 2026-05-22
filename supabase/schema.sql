-- Enable necessary extensions
create extension if not exists "pgcrypto";

-- Create couples table
create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete cascade
);

-- Create memberships table
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (couple_id, user_id)
);

create index if not exists memberships_user_id_idx on public.memberships(user_id);
create index if not exists memberships_couple_id_idx on public.memberships(couple_id);

-- Saved activities: couple-level “favorites”
create table if not exists public.saved_activities (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  tags text[] not null default '{}',
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists saved_activities_user_idx on public.saved_activities(user_id);
create index if not exists saved_activities_user_created_idx on public.saved_activities(user_id, created_at desc);

alter table public.saved_activities
  add column if not exists title text;

alter table public.saved_activities
  add column if not exists description text;

alter table public.saved_activities
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'saved_activities'
      and column_name = 'saved_by'
  ) then
    execute '
      update public.saved_activities
      set user_id = coalesce(user_id, saved_by)
      where user_id is null
    ';
  end if;
end
$$;

alter table public.saved_activities
  alter column user_id set not null;

alter table public.saved_activities
  drop constraint if exists saved_activities_couple_id_key;

alter table public.saved_activities
  drop constraint if exists saved_activities_couple_id_fkey;

alter table public.saved_activities
  drop column if exists couple_id;

alter table public.saved_activities
  drop column if exists saved_by;

drop index if exists saved_activities_couple_idx;
drop index if exists saved_activities_couple_created_idx;

-- Create plans table
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  title text not null,
  start_date_ts timestamptz not null,
  tags text[] not null default '{}',
  notes text,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed')),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plans_couple_start_idx on public.plans(couple_id, start_date_ts);

-- Create moments table
create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  image_path text[] not null,
  caption text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists moments_couple_created_idx on public.moments(couple_id, created_at desc);

-- Create user_devices table for push notifications
create table if not exists public.user_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null, -- 'ios' | 'android'
  token text not null,
  updated_at timestamptz not null default now(),
  unique (user_id, platform, token)
);

-- Create user_settings table for personalization and localization
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  currency text not null default 'EUR'
    check (currency in ('EUR', 'USD')),
  locale text not null default 'en-US',
  country text,
  city text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- notifications / reminders
  push_enabled boolean not null default false,
  reminder_enabled boolean not null default false
);

create index if not exists user_devices_user_idx on public.user_devices(user_id);


-- Helper function

create or replace function public.is_member_of_couple(c_id uuid)
returns boolean
language sql stable
as $$
  select exists (
    select 1
    from public.memberships m
    where m.couple_id = c_id
      and m.user_id = auth.uid()
  );
$$;

-- Enable Row Level Security (RLS)
alter table public.couples enable row level security;
alter table public.memberships enable row level security; 
alter table public.saved_activities enable row level security;
alter table public.plans enable row level security;
alter table public.moments enable row level security;
alter table public.user_devices enable row level security;
alter table public.user_settings enable row level security;

-- RLS Policies

-- Couples
drop policy if exists "couples_select_members" on public.couples;
create policy "couples_select_members"
on public.couples for select
using (public.is_member_of_couple(id));

drop policy if exists "couples_insert_self" on public.couples;
create policy "couples_insert_self"
on public.couples for insert
with check (created_by = auth.uid());

-- Memberships
drop policy if exists "memberships_select_own_couples" on public.memberships;
create policy "memberships_select_own_couples"
on public.memberships for select
using (public.is_member_of_couple(couple_id));

-- NOTE: for MVP we block direct self-join unless already member.
-- We'll replace with an invite flow (recommended) later.
drop policy if exists "memberships_insert_if_member" on public.memberships;
create policy "memberships_insert_if_member"
on public.memberships for insert
with check (
  public.is_member_of_couple(couple_id)
  and user_id is not null
);

drop policy if exists "memberships_delete_if_member" on public.memberships;
create policy "memberships_delete_if_member"
on public.memberships for delete
using (public.is_member_of_couple(couple_id));

-- Saved activities
drop policy if exists "saved_select_members" on public.saved_activities;
drop policy if exists "saved_insert_members" on public.saved_activities;
drop policy if exists "saved_delete_members" on public.saved_activities;
drop policy if exists "saved_update_members" on public.saved_activities;
drop policy if exists "saved_select_own" on public.saved_activities;
create policy "saved_select_own"
on public.saved_activities for select
using (user_id = auth.uid());

drop policy if exists "saved_insert_own" on public.saved_activities;
create policy "saved_insert_own"
on public.saved_activities for insert
with check (user_id = auth.uid());

drop policy if exists "saved_delete_own" on public.saved_activities;
create policy "saved_delete_own"
on public.saved_activities for delete
using (user_id = auth.uid());

drop policy if exists "saved_update_own" on public.saved_activities;
create policy "saved_update_own"
on public.saved_activities for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Plans
drop policy if exists "plans_select_members" on public.plans;
create policy "plans_select_members"
on public.plans for select
using (public.is_member_of_couple(couple_id));

drop policy if exists "plans_insert_members" on public.plans;
create policy "plans_insert_members"
on public.plans for insert
with check (public.is_member_of_couple(couple_id) and created_by = auth.uid());

drop policy if exists "plans_update_members" on public.plans;
create policy "plans_update_members"
on public.plans for update
using (public.is_member_of_couple(couple_id))
with check (public.is_member_of_couple(couple_id));

drop policy if exists "plans_delete_members" on public.plans;
create policy "plans_delete_members"
on public.plans for delete
using (public.is_member_of_couple(couple_id));

-- Moments
drop policy if exists "moments_select_members" on public.moments;
create policy "moments_select_members"
on public.moments for select
using (public.is_member_of_couple(couple_id));

drop policy if exists "moments_insert_members" on public.moments;
create policy "moments_insert_members"
on public.moments for insert
with check (public.is_member_of_couple(couple_id) and created_by = auth.uid());

drop policy if exists "moments_delete_members" on public.moments;
create policy "moments_delete_members"
on public.moments for delete
using (public.is_member_of_couple(couple_id));

-- Storage policies for moments bucket
drop policy if exists "moments_read_couple" on storage.objects;
create policy "moments_read_couple"
on storage.objects for select
using (
  bucket_id = 'moments'
  and public.is_member_of_couple( (split_part(name, '/', 1))::uuid )
);

drop policy if exists "moments_write_couple" on storage.objects;
create policy "moments_write_couple"
on storage.objects for insert
with check (
  bucket_id = 'moments'
  and public.is_member_of_couple( (split_part(name, '/', 1))::uuid )
);

drop policy if exists "moments_delete_couple" on storage.objects;
create policy "moments_delete_couple"
on storage.objects for delete
using (
  bucket_id = 'moments'
  and public.is_member_of_couple( (split_part(name, '/', 1))::uuid )
);

-- Devices
drop policy if exists "devices_select_own" on public.user_devices;
create policy "devices_select_own"
on public.user_devices for select
using (user_id = auth.uid());

drop policy if exists "devices_insert_own" on public.user_devices;
create policy "devices_insert_own"
on public.user_devices for insert
with check (user_id = auth.uid());

drop policy if exists "devices_delete_own" on public.user_devices;
create policy "devices_delete_own"
on public.user_devices for delete
using (user_id = auth.uid());

-- User settings
drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own"
on public.user_settings
for select
using (user_id = auth.uid());

drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own"
on public.user_settings
for insert
with check (user_id = auth.uid());

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own"
on public.user_settings
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "user_settings_delete_own" on public.user_settings;
create policy "user_settings_delete_own"
on public.user_settings
for delete
using (user_id = auth.uid());

-- Trigger functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
