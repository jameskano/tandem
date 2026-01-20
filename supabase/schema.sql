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
  tags text[] not null default '{}',
  couple_id uuid not null references public.couples(id) on delete cascade,
  saved_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (couple_id)
);

create index if not exists saved_activities_couple_idx on public.saved_activities(couple_id);

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

-- RLS Policies

-- Couples
create policy "couples_select_members"
on public.couples for select
using (public.is_member_of_couple(id));

create policy "couples_insert_self"
on public.couples for insert
with check (created_by = auth.uid());

-- Memberships
create policy "memberships_select_own_couples"
on public.memberships for select
using (public.is_member_of_couple(couple_id));

-- NOTE: for MVP we block direct self-join unless already member.
-- We'll replace with an invite flow (recommended) later.
create policy "memberships_insert_if_member"
on public.memberships for insert
with check (
  public.is_member_of_couple(couple_id)
  and user_id is not null
);

create policy "memberships_delete_if_member"
on public.memberships for delete
using (public.is_member_of_couple(couple_id));

-- Saved activities
create policy "saved_select_members"
on public.saved_activities for select
using (public.is_member_of_couple(couple_id));

create policy "saved_insert_members"
on public.saved_activities for insert
with check (public.is_member_of_couple(couple_id) and saved_by = auth.uid());

create policy "saved_delete_members"
on public.saved_activities for delete
using (public.is_member_of_couple(couple_id));

-- Plans
create policy "plans_select_members"
on public.plans for select
using (public.is_member_of_couple(couple_id));

create policy "plans_insert_members"
on public.plans for insert
with check (public.is_member_of_couple(couple_id) and created_by = auth.uid());

create policy "plans_update_members"
on public.plans for update
using (public.is_member_of_couple(couple_id))
with check (public.is_member_of_couple(couple_id));

create policy "plans_delete_members"
on public.plans for delete
using (public.is_member_of_couple(couple_id));

-- Moments
create policy "moments_select_members"
on public.moments for select
using (public.is_member_of_couple(couple_id));

create policy "moments_insert_members"
on public.moments for insert
with check (public.is_member_of_couple(couple_id) and created_by = auth.uid());

create policy "moments_delete_members"
on public.moments for delete
using (public.is_member_of_couple(couple_id));

-- Storage policies for moments bucket
create policy "moments_read_couple"
on storage.objects for select
using (
  bucket_id = 'moments'
  and public.is_member_of_couple( (split_part(name, '/', 1))::uuid )
);

create policy "moments_write_couple"
on storage.objects for insert
with check (
  bucket_id = 'moments'
  and public.is_member_of_couple( (split_part(name, '/', 1))::uuid )
);

create policy "moments_delete_couple"
on storage.objects for delete
using (
  bucket_id = 'moments'
  and public.is_member_of_couple( (split_part(name, '/', 1))::uuid )
);

-- Devices
create policy "devices_select_own"
on public.user_devices for select
using (user_id = auth.uid());

create policy "devices_insert_own"
on public.user_devices for insert
with check (user_id = auth.uid());

create policy "devices_delete_own"
on public.user_devices for delete
using (user_id = auth.uid());
