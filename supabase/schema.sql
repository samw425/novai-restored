-- Novai Database Schema
-- Run this in your Supabase SQL Editor

-- Enable vector extension for future semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    source TEXT NOT NULL,
    source_url TEXT UNIQUE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT NOT NULL,
    topic_slug TEXT,
    importance_score INTEGER DEFAULT 50,
    embedding vector(1536), -- For future semantic search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sources table (tracks RSS feed health)
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    feed_url TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    priority INTEGER DEFAULT 5,
    last_fetch_at TIMESTAMP WITH TIME ZONE,
    last_fetch_status TEXT,
    last_error_message TEXT,
    article_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waitlist table (for signup emails)
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    signed_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notified BOOLEAN DEFAULT false
);

-- Feedback table (for contact form submissions)
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded BOOLEAN DEFAULT false
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- RLS Policies (Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow public read access to articles and sources
CREATE POLICY "Public read access for articles"
    ON articles FOR SELECT
    USING (true);

CREATE POLICY "Public read access for sources"
    ON sources FOR SELECT
    USING (true);

-- Allow authenticated inserts/updates (for ingestion API)
CREATE POLICY "Service role can insert articles"
    ON articles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update articles"
    ON articles FOR UPDATE
    USING (true);

CREATE POLICY "Service role can insert/update sources"
    ON sources FOR ALL
    USING (true);

CREATE POLICY "Anyone can insert waitlist"
    ON waitlist FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can insert feedback"
    ON feedback FOR INSERT
    WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed sources table with comprehensive RSS feeds (50+ sources globally)
INSERT INTO sources (name, feed_url, category, priority) VALUES
-- RESEARCH LABS & AI ORGS (Priority 10)
('OpenAI Blog', 'https://openai.com/blog/rss/', 'research', 10),
('Google AI Blog', 'https://ai.googleblog.com/feeds/posts/default', 'research', 10),
('DeepMind Blog', 'https://www.deepmind.com/blog/rss.xml', 'research', 10),
('Anthropic', 'https://www.anthropic.com/index/rss.xml', 'research', 10),
('Meta AI', 'https://ai.facebook.com/blog/rss/', 'research', 10),
('Microsoft Research', 'https://www.microsoft.com/en-us/research/feed/', 'research', 10),

-- MAJOR TECH PUBLICATIONS (Priority 9)
('TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'market', 9),
('MIT Technology Review', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', 'research', 9),
('Wired AI', 'https://www.wired.com/feed/tag/ai/latest/rss', 'general', 9),
('VentureBeat AI', 'https://venturebeat.com/category/ai/feed/', 'market', 9),
('Ars Technica AI', 'https://feeds.arstechnica.com/arstechnica/technology-lab', 'general', 9),
('The Verge AI', 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', 'general', 9),

-- ROBOTICS (Priority 8)
('The Robot Report', 'https://www.therobotreport.com/feed/', 'robotics', 8),
('IEEE Spectrum Robotics', 'https://spectrum.ieee.org/feeds/topic/robotics.rss', 'robotics', 8),
('Robotics Business Review', 'https://www.roboticsbusinessreview.com/feed/', 'robotics', 8),
('Robotics Trends', 'https://www.roboticstrends.com/feed/', 'robotics', 7),

-- POLICY & SAFETY (Priority 8-9)
('AI Now Institute', 'https://ainowinstitute.org/feed', 'policy', 8),
('Partnership on AI', 'https://www.partnershiponai.org/feed/', 'policy', 8),
('Center for AI Safety', 'https://www.safe.ai/blog-rss', 'policy', 8),
('Future of Life Institute', 'https://futureoflife.org/feed/', 'policy', 7),

-- BUSINESS & MARKET (Priority 7-8)
('Axios AI', 'https://www.axios.com/feeds/artificial-intelligence.rss', 'market', 8),
('Bloomberg Technology', 'https://www.bloomberg.com/technology.rss', 'market', 8),
('Reuters Technology', 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best', 'market', 7),
('Crunchbase News', 'https://news.crunchbase.com/feed/', 'market', 7),

-- DEVELOPER TOOLS & FRAMEWORKS (Priority 7-8)
('Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'tools', 8),
('LangChain Blog', 'https://blog.langchain.dev/rss/', 'tools', 8),
('PyTorch Blog', 'https://pytorch.org/blog/feed.xml', 'tools', 7),
('TensorFlow Blog', 'https://blog.tensorflow.org/feeds/posts/default', 'tools', 7),

-- UNIVERSITIES & ACADEMIC (Priority 7-8)
('Stanford HAI', 'https://hai.stanford.edu/news/feed', 'research', 8),
('Berkeley AI Research', 'https://bair.berkeley.edu/blog/feed.xml', 'research', 8),
('Oxford AI', 'https://www.oxfordaiethics.ox.ac.uk/feed', 'research', 7),
('Cambridge AI', 'https://www.cst.cam.ac.uk/news/rss', 'research', 7),

-- INTERNATIONAL SOURCES (Priority 6-7)
('Synced (China AI)', 'https://syncedreview.com/feed/', 'general', 7),
('EU AI Act News', 'https://www.euaiact.com/feed', 'policy', 7),
('Japan Times Tech', 'https://www.japantimes.co.jp/news/technology/feed/', 'general', 6),

-- ADDITIONAL US TECH MEDIA (Priority 6-7)
('ZDNet AI', 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml', 'general', 7),
('InfoWorld AI', 'https://www.infoworld.com/category/artificial-intelligence/index.rss', 'tools', 6),
('TNW AI', 'https://thenextweb.com/neural/feed', 'general', 6),
('Engadget AI', 'https://www.engadget.com/rss.xml', 'general', 6),
('Singularity Hub', 'https://singularityhub.com/feed/', 'general', 6),

-- AI ETHICS & RESPONSIBILITY (Priority 6)
('AI Ethics Lab', 'https://aiethicslab.com/feed/', 'policy', 6),
('Algorithmic Justice League', 'https://www.ajl.org/feed', 'policy', 6),

-- SPECIALIZED AI TOPICS (Priority 6-7)
('NVIDIA AI Blog', 'https://blogs.nvidia.com/feed/', 'research', 7),
('AWS Machine Learning Blog', 'https://aws.amazon.com/blogs/machine-learning/feed/', 'tools', 7),
('Azure AI Blog', 'https://azure.microsoft.com/en-us/blog/topics/ai-machine-learning/feed/', 'tools', 7),
('Kaggle Blog', 'https://medium.com/feed/kaggle-blog', 'tools', 6),

-- COMMUNITY & FORUMS (Priority 5-6)
('Towards Data Science', 'https://towardsdatascience.com/feed', 'general', 6),
('KDnuggets', 'https://www.kdnuggets.com/feed', 'general', 6),
('ML Mastery', 'https://machinelearningmastery.com/feed/', 'tools', 5)

ON CONFLICT (feed_url) DO NOTHING;
