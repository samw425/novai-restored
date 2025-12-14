-- EARNINGS HUB REPAIR SCRIPT --
-- Run this in Supabase SQL Editor to fix missing columns

-- 1. Ensure columns exist (Safe to run multiple times)
alter table companies add column if not exists is_ai boolean default false;
alter table companies add column if not exists is_sp500 boolean default false;
alter table companies add column if not exists is_featured boolean default false;
alter table companies add column if not exists featured_rank int default 999;
alter table companies add column if not exists sector text;

-- 2. Create Next Earnings if missing
create table if not exists next_earnings (
  company_id uuid references companies(id) on delete cascade primary key,
  next_earnings_at timestamp with time zone,
  earnings_time text check (earnings_time in ('BMO', 'AMC', 'DMH', 'TBA')), 
  confidence text default 'UNKNOWN' check (confidence in ('CONFIRMED', 'ESTIMATED', 'UNKNOWN')),
  source_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Summaries if missing
create table if not exists earnings_summaries (
  id uuid default gen_random_uuid() primary key,
  event_id uuid, 
  company_id uuid references companies(id) on delete cascade not null,
  quarter_label text,
  highlights jsonb default '[]'::jsonb,
  summary_text text,
  status text default 'COMPLETE',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS
alter table companies enable row level security;
alter table next_earnings enable row level security;
create policy "Public view" on companies for select using (true);
create policy "Public view" on next_earnings for select using (true);

-- 5. Force Refresh Schema Cache
notify pgrst, 'reload config';
