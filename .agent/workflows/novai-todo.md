---
description: Novai Intelligence - To-Do List for when we resume work
---

# Novai Intelligence - To-Do List
**Status:** On Ice (as of Dec 20, 2024)
**Reason:** CPU usage issues, exploring new project ideas

---

## 🔴 CRITICAL - Before Resuming

### 1. Fix CPU/Hosting Issues
- [ ] Set up Cloudflare (free tier) to block bots and cache at edge
- [ ] Monitor Vercel Fluid CPU usage after billing cycle resets
- [ ] Consider if Vercel is the right host or if we should move to Netlify/Railway

### 2. Check Site Status
- [ ] Is the site still live on usenovai.live?
- [ ] Are all feeds working?
- [ ] Any error logs in Vercel dashboard?

---

## 🟡 HIGH PRIORITY - When Ready

### 3. Build Email List
- [ ] Add prominent newsletter signup
- [ ] Create lead magnet (e.g., "Weekly AI Intelligence Brief")
- [ ] Set up email service (ConvertKit free tier, Buttondown, etc.)

### 4. SEO & Discoverability
- [ ] Optimize meta tags on all pages
- [ ] Submit sitemap to Google Search Console
- [ ] Add structured data (JSON-LD) for articles
- [ ] Create cornerstone content pages

### 5. Polish Existing Features
- [ ] Full site audit - check all pages work
- [ ] Mobile experience review
- [ ] Fix any broken links or feeds
- [ ] Earnings Hub - verify all data is live

---

## 🟢 NICE TO HAVE - Future

### 6. Monetization Options
- [ ] Pro tier subscription ($10-20/month)
  - Already have waitlist infrastructure
  - Need to define what Pro features include
- [ ] Affiliate partnerships with AI tools
- [ ] Sponsored content/brief sections
- [ ] API access for developers

### 7. Content & Growth
- [ ] Daily Intelligence Brief automation
- [ ] Social media presence (Twitter/X, LinkedIn)
- [ ] Guest posts on tech blogs
- [ ] Product Hunt launch

### 8. Technical Improvements
- [ ] Add Supabase for article caching (reduce API calls)
- [ ] Implement proper 30-day article archive
- [ ] Add user accounts for personalization
- [ ] Analytics dashboard (what pages are popular)

---

## 📊 Current Site Stats (Dec 2024)
- Live at: usenovai.live
- Vercel Fluid CPU: ~150% of limit (6h/4h)
- Known Issues: CPU usage from bot traffic
- Fixes Deployed: Cache headers, reduced polling, robots.txt updates

---

## 💡 Notes
- Support page promises "ad-free" - don't add Google AdSense
- Pro waitlist exists but not heavily promoted
- Site has good design/UX, needs traffic

---

When ready to resume, run `/cpu-optimization-plan` for the full Cloudflare setup guide.
