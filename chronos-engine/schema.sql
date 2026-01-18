-- The Chronos Engine: D1 Database Schema
-- Stores cosmic, global, and scientific events with AI-generated historical correlations

-- Chronicle of all ingested events
CREATE TABLE IF NOT EXISTS Chronicle_Events (
    event_id TEXT PRIMARY KEY,
    source_type TEXT NOT NULL, -- 'NASA', 'GDELT', 'ARXIV', 'GUTENBERG'
    title TEXT,
    content_blob TEXT, -- AI-summarized synthesis
    raw_data TEXT, -- Original JSON from source
    timestamp INTEGER NOT NULL,
    intensity_score REAL DEFAULT 0.5, -- 0.0 to 1.0
    category TEXT, -- 'COSMIC', 'CONFLICT', 'SCIENCE', 'HISTORICAL'
    vector_ref TEXT, -- Reference to Vectorize embedding
    metadata TEXT, -- Additional JSON metadata
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- History Rhymes: AI-discovered connections between modern and historical events
CREATE TABLE IF NOT EXISTS History_Rhymes (
    link_id TEXT PRIMARY KEY,
    modern_event_id TEXT NOT NULL,
    historical_event_id TEXT NOT NULL,
    logic_explanation TEXT, -- AI-generated reasoning
    strength REAL DEFAULT 0.0, -- Cosine similarity score (0.85+)
    synthesis TEXT, -- Deep narrative synthesis
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (modern_event_id) REFERENCES Chronicle_Events(event_id),
    FOREIGN KEY (historical_event_id) REFERENCES Chronicle_Events(event_id)
);

-- Global State: Real-time existential metrics
CREATE TABLE IF NOT EXISTS Global_State (
    metric_id TEXT PRIMARY KEY,
    metric_name TEXT NOT NULL, -- 'COSMIC_TURBULENCE', 'HUMAN_SENTIMENT', 'EXISTENTIAL_ALIGNMENT'
    value REAL NOT NULL,
    trend TEXT, -- 'RISING', 'FALLING', 'STABLE'
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON Chronicle_Events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_source ON Chronicle_Events(source_type);
CREATE INDEX IF NOT EXISTS idx_events_category ON Chronicle_Events(category);
CREATE INDEX IF NOT EXISTS idx_rhymes_modern ON History_Rhymes(modern_event_id);
CREATE INDEX IF NOT EXISTS idx_rhymes_strength ON History_Rhymes(strength DESC);
