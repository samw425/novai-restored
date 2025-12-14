-- Earnings Hub Schema v2 (SAFE TO RETRY)
-- Updated: 2024-12-13

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
  is_featured boolean default false,
  featured_rank int default 999,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_companies_ticker on companies (ticker);
create index if not exists idx_companies_name on companies using gin (name gin_trgm_ops);
create index if not exists idx_companies_is_ai on companies (is_ai);
create index if not exists idx_companies_is_featured on companies (is_featured);
create index if not exists idx_companies_featured_rank on companies (featured_rank);

-- 2. Earnings Events
create table if not exists earnings_events (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  event_type text not null check (event_type in ('EARNINGS_RELEASE', 'EARNINGS_CALL', 'SEC_FILING')),
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  earnings_at timestamp with time zone,
  quarter_label text,
  source_urls jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Dedupe key
  unique(company_id, source_urls)
);

create index if not exists idx_earnings_events_company on earnings_events (company_id);
create index if not exists idx_earnings_events_published on earnings_events (published_at desc);

-- 3. Summaries
create table if not exists earnings_summaries (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references earnings_events(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade not null,
  quarter_label text,
  highlights jsonb default '[]'::jsonb,
  eps_text text,
  revenue_text text,
  guidance_text text,
  sentiment_flags jsonb default '[]'::jsonb,
  summary_text text,
  status text default 'COMPLETE' check (status in ('PROCESSING', 'COMPLETE', 'FAILED')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_earnings_summaries_company on earnings_summaries (company_id, created_at desc);
create index if not exists idx_earnings_summaries_created on earnings_summaries (created_at desc);

-- 4. Next Earnings
create table if not exists next_earnings (
  company_id uuid references companies(id) on delete cascade primary key,
  next_earnings_at timestamp with time zone,
  earnings_time text check (earnings_time in ('BMO', 'AMC', 'DMH', 'TBA')), -- Before Market Open, After Market Close, During Market Hours
  confidence text default 'UNKNOWN' check (confidence in ('CONFIRMED', 'ESTIMATED', 'UNKNOWN')),
  source_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_next_earnings_date on next_earnings (next_earnings_at);

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

-- 6. Ingestion Log (for tracking sync status)
create table if not exists earnings_ingestion_log (
  id uuid default gen_random_uuid() primary key,
  ingestion_type text not null check (ingestion_type in ('FEATURED', 'AI', 'SP500', 'ALL')),
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  items_processed int default 0,
  items_new int default 0,
  status text default 'RUNNING' check (status in ('RUNNING', 'COMPLETE', 'FAILED')),
  error_message text
);

create index if not exists idx_ingestion_log_type on earnings_ingestion_log (ingestion_type, started_at desc);

-- RLS
alter table companies enable row level security;
alter table earnings_events enable row level security;
alter table earnings_summaries enable row level security;
alter table next_earnings enable row level security;
alter table earnings_alerts enable row level security;
alter table earnings_ingestion_log enable row level security;

drop policy if exists "Public view" on companies;
create policy "Public view" on companies for select using (true);

drop policy if exists "Public view" on earnings_events;
create policy "Public view" on earnings_events for select using (true);

drop policy if exists "Public view" on earnings_summaries;
create policy "Public view" on earnings_summaries for select using (true);

drop policy if exists "Public view" on next_earnings;
create policy "Public view" on next_earnings for select using (true);

drop policy if exists "Public view" on earnings_ingestion_log;
create policy "Public view" on earnings_ingestion_log for select using (true);

drop policy if exists "User alerts" on earnings_alerts;
create policy "User alerts" on earnings_alerts using (auth.uid() = user_id);

-- Realtime
alter publication supabase_realtime add table earnings_events;
alter publication supabase_realtime add table next_earnings;
alter publication supabase_realtime add table earnings_summaries;
