# Novai Pro Features Bookmark

## Bookmarked Pages (Removed from Navigation)

These pages are fully built but require daily AI synthesis infrastructure (OpenAI + Cron) to function as designed. They have been removed from the sidebar to maintain credibility until Pro tier infrastructure is ready.

### 1. Daily Intelligence Brief
- **Path**: `/intelligence-brief`
- **File**: `src/app/(dashboard)/intelligence-brief/page.tsx`
- **Dependencies**: `/api/brief`, `/api/intelligence/synthesize`
- **Value Proposition**: AI-synthesized executive summary with thematic deep dives

### 2. Daily Snapshot
- **Path**: `/daily-snapshot`
- **File**: `src/app/(dashboard)/daily-snapshot/page.tsx`
- **Dependencies**: `/api/brief`
- **Value Proposition**: "The Morning Protocol" - Lead story + curated key developments

## Infrastructure Needed to Restore

1. **OpenAI API Credits** - For daily synthesis
2. **Vercel Cron Job** - To run synthesis at 6am EST daily
3. **Supabase Storage** - To cache generated briefs

## How to Restore

1. Uncomment the entries in `src/components/navigation/Sidebar.tsx` (lines 24-30 and 35-40)
2. Uncomment the render block (lines 347-371)
3. Set up the cron job in `vercel.json`
4. Configure `OPENAI_API_KEY` in environment variables
