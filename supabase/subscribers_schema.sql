-- Novai Subscribers Table for Daily Briefs
-- Add this to your existing novai_setup.sql or run separately

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    name text NOT NULL,
    organization text,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    last_sent_at timestamptz,
    
    -- Future: tier for monetization
    tier text DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise'))
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers (active);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);

-- RLS Policies
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Only service role can write (API routes)
CREATE POLICY "Service role can manage subscribers" ON subscribers
    FOR ALL
    USING (auth.role() = 'service_role');

-- Public can't read subscribers (privacy)
CREATE POLICY "No public access" ON subscribers
    FOR SELECT
    USING (false);
