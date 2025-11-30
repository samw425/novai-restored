-- Novai Database Schema for Real Data Pipeline
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for semantic search (optional, for future enhancements)
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- ARTICLES TABLE
-- Stores all aggregated articles from RSS feeds
-- =====================================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Article metadata
  title TEXT NOT NULL,
  summary TEXT,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE, -- Ensure no duplicates
  published_at TIMESTAMPTZ NOT NULL,
  
  -- Categorization
  category TEXT CHECK (category IN ('research', 'tools', 'policy', 'market', 'risk', 'robotics', 'general')),
  topic_slug TEXT,
  importance_score FLOAT DEFAULT 50, -- 0-100
  
  -- Semantic search (optional)
  embedding VECTOR(1536),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_source ON articles(source);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

-- =====================================================
-- SOURCES TABLE
-- Tracks RSS feed health and status
-- =====================================================
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Source metadata
  name TEXT NOT NULL UNIQUE,
  feed_url TEXT NOT NULL UNIQUE,
  category TEXT CHECK (category IN ('research', 'tools', 'policy', 'market', 'risk', 'robotics', 'general')),
  priority INT DEFAULT 5, -- 1-10
  
  -- Health monitoring
  last_fetch_at TIMESTAMPTZ,
  last_fetch_status TEXT, -- 'success' | 'error'
  last_error_message TEXT,
  article_count INT DEFAULT 0,
  
  -- Configuration
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Allow public read access for articles
-- =====================================================
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read articles
CREATE POLICY "Allow public read access to articles"
  ON articles FOR SELECT
  USING (true);

-- Allow anyone to read sources (for transparency)
CREATE POLICY "Allow public read access to sources"
  ON sources FOR SELECT
  USING (true);

-- Only authenticated users can insert/update (for admin ingestion)
CREATE POLICY "Allow authenticated insert to articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to sources"
  ON sources FOR UPDATE
  TO authenticated
  USING (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for articles table
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for sources table
CREATE TRIGGER update_sources_updated_at
    BEFORE UPDATE ON sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA - Insert configured RSS sources
-- =====================================================
INSERT INTO sources (name, feed_url, category, priority, is_active) VALUES
  ('OpenAI Blog', 'https://openai.com/news/rss.xml', 'research', 10, true),
  ('Google AI Blog', 'https://research.google/blog/rss', 'research', 10, true),
  ('TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'general', 9, true),
  ('MIT Technology Review', 'https://www.technologyreview.com/feed/', 'general', 9, true),
  ('DeepMind Blog', 'https://www.deepmind.com/blog/rss.xml', 'research', 9, true),
  ('Anthropic Research', 'https://www.anthropic.com/news/rss', 'research', 9, true),
  ('The Verge AI', 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', 'general', 8, true),
  ('Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'tools', 8, true),
  ('Meta AI Research', 'https://ai.meta.com/blog/rss/', 'research', 8, true),
  ('Microsoft AI Blog', 'https://news.microsoft.com/source/topics/ai/feed/', 'research', 8, true),
  ('Wired AI', 'https://www.wired.com/feed/tag/ai/latest/rss', 'general', 8, true),
  ('IEEE Spectrum Robotics', 'https://spectrum.ieee.org/feeds/robotics.rss', 'robotics', 8, true),
  ('NVIDIA AI Blog', 'https://blogs.nvidia.com/feed/', 'tools', 7, true),
  ('Berkeley AI Research', 'https://bair.berkeley.edu/blog/feed.xml', 'research', 7, true),
  ('VentureBeat AI', 'https://venturebeat.com/category/ai/feed/', 'market', 7, true),
  ('MarkTechPost', 'https://www.marktechpost.com/feed', 'research', 7, true),
  ('AI Business', 'https://aibusiness.com/rss.xml', 'market', 7, true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Check tables created
SELECT schemaname, tablename 
FROM pg_tables 
WHERE tablename IN ('articles', 'sources');

-- Check source count
SELECT COUNT(*) as source_count FROM sources;
