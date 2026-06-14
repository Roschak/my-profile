-- Run this script in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  project_type text not null default 'Project',
  tech text[] not null default '{}',
  live_url text,
  repo_url text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_at date not null default current_date,
  description text,
  file_type text not null default 'pdf',
  file_url text,
  verify_url text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.certificates enable row level security;

-- Simple policy for authenticated dashboard usage
drop policy if exists "projects_select_authenticated" on public.projects;
create policy "projects_select_authenticated"
on public.projects
for select
to authenticated
using (true);

drop policy if exists "projects_insert_authenticated" on public.projects;
create policy "projects_insert_authenticated"
on public.projects
for insert
to authenticated
with check (true);

drop policy if exists "projects_delete_authenticated" on public.projects;
create policy "projects_delete_authenticated"
on public.projects
for delete
to authenticated
using (true);

drop policy if exists "certificates_select_authenticated" on public.certificates;
create policy "certificates_select_authenticated"
on public.certificates
for select
to authenticated
using (true);

drop policy if exists "certificates_insert_authenticated" on public.certificates;
create policy "certificates_insert_authenticated"
on public.certificates
for insert
to authenticated
with check (true);

drop policy if exists "certificates_delete_authenticated" on public.certificates;
create policy "certificates_delete_authenticated"
on public.certificates
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('my-sertifikat', 'my-sertifikat', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload/read certificate files
drop policy if exists "storage_my_sertifikat_read_public" on storage.objects;
create policy "storage_my_sertifikat_read_public"
on storage.objects
for select
to public
using (bucket_id = 'my-sertifikat');

drop policy if exists "storage_my_sertifikat_insert_authenticated" on storage.objects;
create policy "storage_my_sertifikat_insert_authenticated"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'my-sertifikat');

drop policy if exists "storage_my_sertifikat_delete_authenticated" on storage.objects;
create policy "storage_my_sertifikat_delete_authenticated"
on storage.objects
for delete
to authenticated
using (bucket_id = 'my-sertifikat');
