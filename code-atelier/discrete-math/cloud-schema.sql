-- Code Atelier / Discrete Mathematics II account progress.
-- Run in the Supabase SQL editor. Never execute destructive DROP statements here.
-- One user's two independent sections: 'homework' and 'exam'.
-- revision provides optimistic concurrency control to prevent silent overwrites.

create table if not exists public.dm2_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  section text not null check (section in ('homework', 'exam')),
  state jsonb not null default '{}'::jsonb check (jsonb_typeof(state) = 'object'),
  revision bigint not null default 1 check (revision >= 1),
  updated_at timestamptz not null default now(),
  primary key (user_id, section)
);

create or replace function public.dm2_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists dm2_progress_updated_at on public.dm2_progress;
create trigger dm2_progress_updated_at
before update on public.dm2_progress
for each row execute function public.dm2_set_updated_at();

alter table public.dm2_progress enable row level security;
revoke all on table public.dm2_progress from anon, authenticated;
grant select, insert, update on public.dm2_progress to authenticated;

drop policy if exists "dm2_owner_select" on public.dm2_progress;
create policy "dm2_owner_select" on public.dm2_progress
for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "dm2_owner_insert" on public.dm2_progress;
create policy "dm2_owner_insert" on public.dm2_progress
for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "dm2_owner_update" on public.dm2_progress;
create policy "dm2_owner_update" on public.dm2_progress
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

-- No DELETE policy: accidental data loss is harder to trigger from the browser.
-- IMPORTANT: test with user A, user B, and anonymous sessions before enabling publicly.
