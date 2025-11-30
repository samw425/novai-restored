-- NOVAI PRODUCTION DATABASE SETUP
-- Run this once in Supabase SQL Editor

-- Enable pgvector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Articles table: main feed
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  source_url text NOT NULL,
  title text NOT NULL,
  summary text,
  published_at timestamptz NOT NULL,
  category text CHECK (category IN ('research','tools','policy','market','risk','general')) DEFAULT 'general',
  topic_slug text,
  importance_score double precision DEFAULT 0,
  embedding vector(1536),
  created_at timestamptz DEFAULT now()
);

-- Daily snapshot
CREATE TABLE IF NOT EXISTS daily_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  headline text NOT NULL,
  subheadline text,
  briefing_body jsonb,
  created_at timestamptz DEFAULT now()
);

-- Deep signals
CREATE TABLE IF NOT EXISTS signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  impact text,
  timeframe text,
  created_at timestamptz DEFAULT now()
);

-- Tools
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  description text,
  category text,
  pricing text,
  url text,
  labels jsonb,
  is_tool_of_the_day boolean DEFAULT false,
  tool_of_the_day_date date,
  created_at timestamptz DEFAULT now()
);

-- Market pulse
CREATE TABLE IF NOT EXISTS market_pulse (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  name text,
  price numeric,
  change_percent numeric,
  last_updated timestamptz DEFAULT now()
);

-- Weekly trends
CREATE TABLE IF NOT EXISTS trend_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  supporting_articles jsonb,
  created_at timestamptz DEFAULT now()
);

-- War room events
CREATE TABLE IF NOT EXISTS war_room_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text,
  severity integer CHECK (severity BETWEEN 1 AND 5),
  summary text,
  source_url text,
  created_at timestamptz DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_daily_snapshots_date ON daily_snapshots (date);
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON signals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trend_items_created_at ON trend_items (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_war_room_severity ON war_room_events (severity DESC, created_at DESC);

-- RLS Policies (Allow public read)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_pulse ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_room_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON daily_snapshots FOR SELECT USING (true);
CREATE POLICY "Public read access" ON signals FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tools FOR SELECT USING (true);
CREATE POLICY "Public read access" ON market_pulse FOR SELECT USING (true);
CREATE POLICY "Public read access" ON trend_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON war_room_events FOR SELECT USING (true);
