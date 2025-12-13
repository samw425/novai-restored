-- Earnings Hub Schema (SAFE TO RETRY)

-- 1. Companies Table
create table if not exists companies (
  id uuid default gen_random_uuid() primary key,
  ticker text not null unique,
  name text not null,
  cik text,
  exchange text,
  sector text,
  is_ai boolean default false,
  is_sp500 boolean default false,
  featured_rank int default 999,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_companies_ticker on companies (ticker);
create index if not exists idx_companies_is_ai on companies (is_ai);

-- 2. Earnings Events
create table if not exists earnings_events (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  earnings_at timestamp with time zone not null,
  event_type text not null check (event_type in ('RELEASE', 'CALL')),
  quarter_label text,
  source_urls jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_earnings_events_company on earnings_events (company_id);

-- 3. Summaries
create table if not exists earnings_summaries (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references earnings_events(id) on delete cascade not null,
  company_id uuid references companies(id) on delete cascade not null,
  quarter_label text not null,
  highlights jsonb default '[]'::jsonb,
  eps_text text,
  revenue_text text,
  guidance_text text,
  sentiment_flags jsonb default '[]'::jsonb,
  summary_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Next Earnings
create table if not exists next_earnings (
  company_id uuid references companies(id) on delete cascade primary key,
  next_earnings_at timestamp with time zone,
  confidence text check (confidence in ('CONFIRMED', 'ESTIMATED', 'UNKNOWN')),
  source_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Alerts
create table if not exists earnings_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  company_id uuid references companies(id) on delete cascade not null,
  alert_type text not null check (alert_type in ('24H', '1H', 'RELEASE')),
  is_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, company_id, alert_type)
);

-- RLS (Drop first to avoid "Already Exists" error)
alter table companies enable row level security;
alter table earnings_events enable row level security;
alter table earnings_summaries enable row level security;
alter table next_earnings enable row level security;
alter table earnings_alerts enable row level security;

drop policy if exists "Public view" on companies;
create policy "Public view" on companies for select using (true);

drop policy if exists "Public view" on earnings_events;
create policy "Public view" on earnings_events for select using (true);

drop policy if exists "Public view" on earnings_summaries;
create policy "Public view" on earnings_summaries for select using (true);

drop policy if exists "Public view" on next_earnings;
create policy "Public view" on next_earnings for select using (true);

drop policy if exists "User alerts" on earnings_alerts;
create policy "User alerts" on earnings_alerts using (auth.uid() = user_id);

-- Realtime
alter publication supabase_realtime add table earnings_events;
alter publication supabase_realtime add table next_earnings;
