# Daily Briefs & Snapshot - Saved Plan

## Problem
The Daily Intelligence Brief and Daily Snapshot pages are not updating daily. The last generated brief is from December 8, 2025.

## Root Cause
- API endpoint `/api/cron/daily-brief` exists and works
- It uses Gemini AI to generate briefs from live feed data
- It saves to Supabase `daily_snapshots` table
- **NO SCHEDULER** exists to call it - there's no `.github` folder and no Vercel cron config

## Solution: Vercel Cron Job

### Step 1: Add to vercel.json
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-brief",
      "schedule": "0 11 * * *"
    }
  ]
}
```
(11:00 UTC = 6:00 AM EST)

### Step 2: Set Environment Variable
In Vercel Dashboard → Project Settings → Environment Variables:
- Name: `CRON_SECRET`
- Value: `novai-cron-2026-secure-key`

### Step 3: Deploy
Push changes to trigger deployment

## How It Works
1. Vercel calls `/api/cron/daily-brief` at 6 AM EST daily
2. The endpoint fetches latest articles from `/api/feed/live`
3. Gemini AI generates an intelligence brief
4. Brief is saved to Supabase `daily_snapshots` table
5. Email is sent to subscribers

## Files Involved
- `/src/app/api/cron/daily-brief/route.tsx` - Main cron handler
- `/src/lib/data/generated-briefs.json` - Static fallback briefs
- `/src/lib/data/daily-briefs.ts` - Brief loading logic
- `/emails/DailyBriefEmail.tsx` - Email template

## Cost
- Vercel Hobby plan includes 1 free cron job per day
- Uses ~10s of serverless execution time
- Uses Gemini API (free tier should be sufficient)

## Status: DEFERRED
Will implement when ready to focus on this feature.
