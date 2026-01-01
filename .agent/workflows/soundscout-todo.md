---
description: SoundScout Task List & Development Roadmap
---

# SoundScout Task List & Roadmap

## 🔴 CRITICAL PRIORITIES (User Feedback)
- [x] **Share Profile:** Create deep links (e.g. `/artist/name`) and OG meta tags so shared links display the artist's info. ✅ DONE
- [x] **Minimalist Branding:** Removed taglines from logo and site. Switched to ultra-minimalist OG image (White text on Black with Red accent). ✅ DONE
- [x] **GitHub Refresh Fix:** Fixed path and permission errors in `daily-refresh.yml`. Now runs 1x daily at midnight UTC. ✅ DONE
- [x] **Seamless Navigation:** Implemented `handleSelectArtist` to close all modals and panels before navigating. ✅ DONE
- [ ] **Data Authenticity (Backend):** Implement logic to ensure all financial/analysis numbers are "justified" and real, not hardcoded multipliers.
    - Validate "Estimated Annual Revenue" model.
    - Validate "Projected Valuation" model.
    - Ensure "Analyst Insight" is derived from actual data signals, not static strings.
- [ ] **Data Credibility:** Review all data points to ensure no "false or fake info". Transparency is key.
- [x] **Real Artist Images (Global):** Background process `update_images.py` is currently running to fetch iTunes images for all 2500+ artists. ✅ IN PROGRESS

## 🟡 UI/UX Refinements (Current Phase)
- [x] **UI Cleanup:** Removed confusing "Platform Volume" / "Arbitrage Signals" stats cards from the dashboard.
- [x] **Branding Polish:** Removed "Global Music" tagline from sidebar logo.
- [x] **Premium OG Images:** Rewrote the dynamic artist OG generator to use a high-end, blurred-avatar "Netflix-style" aesthetic.
- [x] **Artist Images:** Backend updated to fetch real artist images from iTunes API. Verified working locally.
- [x] Status Rings & Cinematic Hovers (Done).
- [x] **Grid Layout for Power Index:** ✅ DONE - Card-based grid layout matching Old School style, with Grid/List toggle
- [x] **New Releases Section:** ✅ DONE - Genre filters, free listening options, multi-feed data
- [x] **Status Badges Fixed:** Removed confusing labels from grid cards - now shows unique artist data only
- [x] **Artist Images Fixed:** Replaced broken Spotify CDN URLs with fresh iTunes images
- [x] **Verify & Polish:** Ensure all interactions feel premium and responsive. ✅ DONE
- [x] **Consider Tagline Update:** "Artist & Music Discovery" instead of "Artist Discovery Platform" ✅ DONE

## 🔴 MAJOR: SITE FACELIFT (Desktop + Mobile)
- [x] **Complete Visual Overhaul:** Make the site look like a top-level platform (Spotify-quality) ✅ DONE
    - Modern, lively design that feels premium
    - Clear main page/landing that explains the platform at a glance
    - User-friendly and self-explanatory
    - Mobile-responsive with exceptional mobile experience
    - Professional animations and micro-interactions
    - Consistent typography and spacing throughout
- [x] **Landing Page:** Create a proper homepage/landing that showcases all features ✅ DONE (Elite Overhaul v3)
- [x] **Mobile Optimization:** Ensure all views work flawlessly on mobile devices ✅ DONE

## 🔴 BLOCKING: NOVAI CPU EMERGENCY (Switching Focus)
- [ ] **Address Vercel CPU Crisis:** Site paused due to "Fluid CPU" usage.
- [ ] **Data Polling Optimization:** Convert client-side polling to more efficient intervals or server-side caching.
- [ ] **Workflow:** Refer to `/cpu-optimization-plan` for zero-cost prevention strategy.

## 🔴 MAJOR: OWN RELEASES DATABASE (Not Apple Dependent)
- [ ] **Build Releases Backend:** Create our own system for tracking new and upcoming releases
    - Scrape from MusicBrainz for release dates
    - Scrape Wikipedia "Upcoming albums" lists  
    - Track major label announcements
    - Store in Supabase `releases` table
    - Daily scheduled GitHub Action to update
- [ ] **Coming Soon Section:** Curated upcoming releases with confirmed dates
- [ ] **Pre-Orders:** Track pre-order announcements from major artists

## 🟢 Future / Roadmap
- [x] **"OLD SCHOOL" Section:** ✅ DONE - 149 legendary artists with real images, shareable profiles, LEGEND badges
- [x] **Grid Layout Redesign:** ✅ DONE - Whole site now uses modern card-based layout like Old School
- [ ] **Era Filters for Old School:** Add 70s / 80s / 90s / 00s filter tabs
- [ ] **OG Image Polish (Bookmark):** "Sharing with Style" - Twitter/X preview cache is extremely stubborn. Implementation with "Netflix-style" is code-complete and deployed, but validation failed on user end. Needs revisit.
- [ ] **Historical Data:** Track artist ranking changes over time.
- [ ] **Email Alerts:** Notify when watchlisted artists trend.
- [ ] **User Authentication:** Supabase Auth for personalized experience.
- [ ] **Monetization Layer:** Affiliate links (Apple Music, Spotify) for revenue.

