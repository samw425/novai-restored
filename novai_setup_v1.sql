-- NOVAI INTELLIGENCE SYSTEM v1.0 SCHEMA
-- Enable pgvector extension for embeddings
create extension if not exists vector;

-- 1. ARTICLES
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_url text not null,
  title text not null,
  summary text,
  published_at timestamptz not null,
  category text check (category in ('research', 'tools', 'policy', 'market', 'risk', 'robotics', 'general')),
  topic_slug text,
  importance_score double precision default 0,
  embedding vector(1536),
  created_at timestamptz default now()
);

create index if not exists articles_published_at_idx on articles(published_at desc);
create index if not exists articles_category_idx on articles(category);
create index if not exists articles_topic_slug_idx on articles(topic_slug);
-- Vector index for similarity search (IVFFlat is good for recall/speed balance)
create index if not exists articles_embedding_idx on articles using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 2. DAILY SNAPSHOTS
create table if not exists daily_snapshots (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  headline text not null,
  subheadline text,
  briefing_body jsonb, -- Structured JSON for sections
  created_at timestamptz default now()
);

-- 3. SIGNALS (Deep Signals)
create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  impact text,
  timeframe text, -- e.g., 'short', 'medium', 'long'
  related_article_ids uuid[], -- Array of article IDs
  created_at timestamptz default now()
);

-- 4. TOOLS (Lab and Tools)
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text,
  description text,
  category text,
  pricing text,
  url text,
  labels jsonb, -- e.g., ["free", "paid", "dev"]
  is_tool_of_the_day boolean default false,
  tool_of_the_day_date date,
  created_at timestamptz default now()
);

create index if not exists tools_is_tool_of_the_day_idx on tools(is_tool_of_the_day);

-- 5. MARKET PULSE
create table if not exists market_pulse (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  name text,
  price numeric,
  change_percent numeric,
  last_updated timestamptz default now()
);

-- 6. TREND ITEMS (Trend Watch)
create table if not exists trend_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  supporting_articles jsonb, -- Array of article IDs or metadata
  created_at timestamptz default now()
);

-- 7. WAR ROOM EVENTS
create table if not exists war_room_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text check (type in ('risk', 'policy', 'incident', 'vulnerability')),
  severity integer check (severity >= 1 and severity <= 5),
  summary text,
  source_url text,
  created_at timestamptz default now()
);

create index if not exists war_room_severity_idx on war_room_events(severity desc);

-- 8. SYSTEM STATUS
create table if not exists system_status (
  id uuid primary key default gen_random_uuid(),
  last_updated timestamptz default now(),
  sources_active integer default 0,
  new_items_24h integer default 0,
  top_topic text,
  risk_level text check (risk_level in ('low', 'medium', 'high')),
  ingestion_ok boolean default true
);

-- 9. BREAKTHROUGH SPOTLIGHT
create table if not exists breakthrough_spotlight (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references articles(id),
  title text not null,
  summary text,
  impact text,
  category text,
  primary_source_url text,
  spotlight_date date unique not null,
  created_at timestamptz default now()
);

-- RLS POLICIES (Enable Row Level Security)
alter table articles enable row level security;
alter table daily_snapshots enable row level security;
alter table signals enable row level security;
alter table tools enable row level security;
alter table market_pulse enable row level security;
alter table trend_items enable row level security;
alter table war_room_events enable row level security;
alter table system_status enable row level security;
alter table breakthrough_spotlight enable row level security;

-- Public Read Access Policies
create policy "Public read access" on articles for select using (true);
create policy "Public read access" on daily_snapshots for select using (true);
create policy "Public read access" on signals for select using (true);
create policy "Public read access" on tools for select using (true);
create policy "Public read access" on market_pulse for select using (true);
create policy "Public read access" on trend_items for select using (true);
create policy "Public read access" on war_room_events for select using (true);
create policy "Public read access" on system_status for select using (true);
create policy "Public read access" on breakthrough_spotlight for select using (true);

-- Service Role Write Access (Implicit, but good to document or enforce if needed)
-- For now, we assume ingestion scripts use the SERVICE_ROLE_KEY which bypasses RLS.
