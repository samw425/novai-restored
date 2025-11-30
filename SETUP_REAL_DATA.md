# Novai Real Data Pipeline - Setup Instructions

## What I've Built

I've created the complete infrastructure for Novai's real data aggregation system:

### 1. RSS Feed Configuration (`src/config/rss-feeds.ts`)
- **25+ Major AI Sources** including:
  - OpenAI, Google AI, DeepMind, Anthropic (Research)
  - TechCrunch, MIT Tech Review, The Verge (News)
  - IEEE Robotics, Boston Dynamics (Robotics)
  - AI Business, Bloomberg, Reuters (Market)
  - And many more...
- Prioritized by importance (1-10 scale)
- Categorized: research, tools, policy, market, robotics, general

### 2. Supabase Database Schema (`supabase/novai_schema.sql`)
- `articles` table: stores all aggregated content
- `sources` table: tracks feed health and status
- Row Level Security (RLS) policies for public read access
- Indexes for performance
- Auto-update triggers
- Includes seed data for all 25+ sources

### 3. RSS Parser Utility (`src/lib/rss-parser.ts`)
- Fetches and parses RSS feeds
- **Hybrid Categorization**: Keyword matching + AI-ready
- **Importance Scoring**: Ranks articles 0-100 based on:
  - Source credibility
  - Recency (24h boost)
  - Content keywords (breakthrough, GPT, etc.)

### 4. Ingestion API (`src/app/api/cron/ingest/route.ts`)
- Fetches all 25+ RSS feeds
- Deduplicates articles (UNIQUE constraint on URL)
- Auto-categorizes and scores each article
- Stores in Supabase
- Tracks success/failure for each source
- Protected with API key authentication

### 5. Vercel Cron Configuration (`vercel.json`)
- Runs ingestion every 5 minutes automatically
- No manual intervention required

---

## What You Need to Do

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create/access your Novai project
2. Open the **SQL Editor**
3. Copy and paste the entire contents of `supabase/novai_schema.sql`
4. Click **Run** to create all tables, indexes, and seed data

### Step 2: Configure Environment Variables

Add these to your Vercel project **AND** to `.env.local`:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cron Authentication (REQUIRED)
CRON_SECRET=your-random-secret-key-here

# OpenAI (OPTIONAL - for future AI categorization)
OPENAI_API_KEY=your_openai_api_key
```

**Where to find Supabase keys:**
- Go to your Supabase project
- Settings → API
- Copy `URL`, `anon/public key`, and `service_role key`

### Step 3: Deploy to Vercel

```bash
npm install rss-parser  # Install RSS parser dependency
vercel deploy --prod    # Deploy with cron configuration
```

### Step 4: Enable Vercel Cron

1. Go to your Vercel project dashboard
2. Settings → Cron Jobs
3. Verify that `/api/cron/ingest` appears (runs every 5 minutes)
4. Set the `CRON_SECRET` environment variable in Vercel

### Step 5: Test Ingestion Manually

```bash
# Trigger the ingestion endpoint directly
curl -X GET https://gonovai.vercel.app/api/cron/ingest \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

You should see a response like:
```json
{
  "success": true,
  "stats": {
    "feedsProcessed": 25,
    "articlesInserted": 143,
    "articlesDuplicate": 12
  }
}
```

### Step 6: Verify Data in Supabase

1. Go to Supabase → Table Editor → `articles`
2. You should see real articles appearing
3. Check `sources` table to see feed health

---

## How It Works Now

1. **Every 5 minutes**: Vercel cron triggers `/api/cron/ingest`
2. **Fetches**: All 25+ RSS feeds in parallel
3. **Processes**: Each article is categorized and scored
4. **Stores**: New articles go into Supabase (duplicates skipped)
5. **Updates**: `sources` table tracks last fetch time and status
6. **Frontend**: Your existing feed automatically shows real articles (no mock data!)

---

## Monitoring & Debugging

- **Check cron logs**: Vercel dashboard → Deployments → Functions → cron/ingest
- **Check source health**: Query `sources` table for `last_fetch_status`
- **Monitor article count**: `SELECT COUNT(*) FROM articles;`

---

## Next Steps (Optional Enhancements)

- [ ] Add OpenAI API for enhanced categorization
- [ ] Implement semantic search with pgvector embeddings
- [ ] Add WebSocket real-time updates (Supabase Realtime)
- [ ] Create admin dashboard to monitor feed health
- [ ] Add user preferences/filters

---

## Timeline

- **Setup Time**: ~30 minutes (Supabase + env vars + deploy)
- **First Articles**: Within 5 minutes of first cron run
- **Steady State**: Continuous updates every 5 minutes, 24/7
