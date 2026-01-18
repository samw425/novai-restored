---
description: Resume STELAR development from the approved roadmap
---

# Resume STELAR Development

## Current State (as of Jan 11, 2026)
- ✅ Video playback working with 10-key rotation
- ✅ OG images generating correctly
- ✅ "Explore More" navigation on track pages
- ✅ Twitter Player Cards implemented
- 🔴 "The Launchpad" needs rebuild → rename to "The Radar"

## Live Deployment
https://e7e75859.stelarmusic.pages.dev

---

## 🔒 YouTube API Reliability (CRITICAL)

### Current Architecture (Already Implemented!)
**File:** `stelar/web/functions/track/[[path]].js`

**Automatic Failover Chain:**
1. **Hardcoded Popular Tracks** (lines 45-115) → Instant, 100% reliable
2. **Cache in rankings.json** (lines 127-144) → No API call needed
3. **10 YouTube API Keys with Auto-Rotation** (lines 154-188):
   ```javascript
   for (let i = 0; i < API_KEYS.length; i++) {
       const keyIndex = (startIndex + i) % API_KEYS.length;
       if (data.error) continue;  // ← Tries next key automatically
   }
   ```
4. **HTML Scraper** (lines 194-216) → Zero-cost fallback
5. **Invidious API** (lines 219-251) → 5 alternative instances
6. **Final listType=search embed** (lines 258-261)

**API Keys Location:** Lines 31-42 contain all 10 keys.

### To Improve Reliability Further:
- [ ] Add more songs to `POPULAR_TRACKS` (100+ top songs)
- [ ] Pre-cache video IDs in `generate_rankings.py`
- [ ] Apply for YouTube quota increase (1M units/day)

---

## Priority Tasks (Next Session)

### P0: "The Radar" (formerly Launchpad)
- Rename Launchpad → The Radar
- Implement real emerging artist data (Spotify Viral, etc.)
- Files: `App.tsx`, `generate_radar.py` (new)

### P1: Video ID Pre-Caching
- During rankings generation, fetch and cache YouTube video IDs
- File: `stelar/data/generate_rankings.py`

### P2: Stickiness Features
- User accounts (Google Sign-In)
- Follow artists
- Daily rankings updates

---

## Key Files
- Rankings engine: `stelar/data/generate_rankings.py`
- Track page: `stelar/web/functions/track/[[path]].js`
- Main app: `stelar/web/src/App.tsx`
- OG generator: `stelar/web/functions/api/og.js`
- **Full Roadmap: `stelar/ROADMAP.md`**
