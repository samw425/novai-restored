---
description: Complete NovAI to Cloudflare Migration Plan - All Issues Documented
---

# NovAI → Cloudflare: Complete Migration Plan

**Created:** January 27, 2026  
**Status:** READY TO EXECUTE (Pending User Approval)  
**Estimated Time:** 4-6 hours (one focused session)

---

## 🔴 Why We MUST Migrate

| Problem | Impact |
|---------|--------|
| Vercel suspended us **2x in December 2024** | Site went down, lost users |
| Free tier CPU limits hit constantly | Unstable service |
| Currently rotating **3 Vercel accounts** | Unsustainable hack |
| Any new deployment risks suspension | Can't ship new features |

**Cloudflare Pages Solution:**
- ✅ Zero CPU limits (generous free tier)
- ✅ Global edge network (faster)
- ✅ No deployment limits
- ✅ Free forever for our use case

---

## ⚠️ Past Migration Failures (LESSONS LEARNED)

### Attempt #1: Direct `next-on-pages` Build
**What Happened:** Build failed immediately  
**Root Cause:** Many API routes used Node.js APIs not available in Edge runtime  
**Lesson:** Must convert ALL routes to Edge-compatible code first

### Attempt #2: Partial Edge Conversion
**What Happened:** Got further, but failed on `api/feed/war-room`  
**Root Cause:** `lib/osint.ts` uses Node.js-specific modules  
**Lesson:** Must audit EVERY dependency in EVERY route

### Known Blockers (Must Fix Before Migration)

| Blocker | File | Problem | Solution |
|---------|------|---------|----------|
| **War Room API** | `src/app/api/feed/war-room/route.ts` | Uses `lib/osint.ts` with Node.js modules | Refactor or remove OSINT functionality |
| **Bundle Size** | Multiple routes | Cloudflare has 3MB limit per Worker | Tree-shake, code-split, lazy-load |
| **RSS Parser** | `lib/rss.ts` | Original `rss-parser` not Edge-compatible | Already refactored ✅ |
| **Dynamic Imports** | Various | Some imports break Edge builds | Use static imports |

---

## 🔴 CRITICAL BLOCKER DISCOVERED (Jan 28, 2026)

### The `rss-parser` Problem

**8 API routes** import `rss-parser`, which uses Node.js `stream` module. This is **NOT compatible with Cloudflare Edge runtime**.

**Affected Routes:**
```
src/app/api/cron/ingest-feed/route.ts
src/app/api/feed/war-room/route.ts
src/app/api/feed/us-intel/route.ts
src/app/api/feed/hacker/route.ts
src/app/api/feed/anti-trust/route.ts
src/app/api/feed/live/route.ts
src/app/api/us-intel/route.ts
src/app/api/intelligence/synthesize/route.ts
```

### Solutions (Pick One)

| Option | Effort | Impact |
|--------|--------|--------|
| **A. Replace rss-parser with fetch-based parser** | 4-8 hours | Full functionality, proper fix |
| **B. Remove RSS routes temporarily** | 1 hour | Ship fast, but lose RSS feeds |
| **C. Move RSS routes to external API** | 6-10 hours | Best architecture, most work |

**Recommended: Option A** — Create an Edge-compatible RSS parser using `fetch()` and basic XML parsing.

### Revised Time Estimate

| Phase | Time |
|-------|------|
| Fix rss-parser blocker | 4-8 hours |
| Remaining Edge runtime fixes | 1-2 hours |
| Build testing | 1 hour |
| Deployment + DNS | 1 hour |
| **Total** | **7-12 hours** |

---

## 📋 Pre-Flight Checklist (Do BEFORE Migration Day)

### 1. Environment Setup
```bash
# Ensure Node.js is available
source ~/.nvm/nvm.sh && nvm use node

# Verify you're in the right directory
cd "/Users/sameeraziz/Documents/novai-intelligence (2)"

# Switch to the migration branch
git checkout cloudflare-deployment

# Install dependencies fresh
rm -rf node_modules && npm install
```

### 2. Cloudflare Account Setup
- [ ] Create NEW Cloudflare account (fresh start)
- [ ] Add domain: `usenovai.live`
- [ ] Note the nameservers Cloudflare provides
- [ ] DO NOT change DNS yet (we test first)

### 3. Environment Variables to Copy
These MUST be set in Cloudflare Pages dashboard:

| Variable | Where to Find |
|----------|---------------|
| `SUPABASE_URL` | Supabase dashboard |
| `SUPABASE_ANON_KEY` | Supabase dashboard |
| `RESEND_API_KEY` | Resend dashboard |
| `OPENAI_API_KEY` | OpenAI dashboard (if using AI) |
| `GEMINI_API_KEY` | Google AI Studio |

---

## 🔧 The Fixes (Priority Order)

### Fix #1: War Room OSINT (CRITICAL)

**Problem:** `lib/osint.ts` breaks the build  
**Options:**
1. **Remove War Room temporarily** - Fastest, ship now, add back later
2. **Refactor OSINT to fetch-only** - Medium effort, keeps feature
3. **Move OSINT to external API** - Best long-term, most effort

**Recommended:** Option 1 (remove temporarily) → Ship → Add back in Phase 2

**Files to modify:**
- `src/app/api/feed/war-room/route.ts` - Comment out OSINT calls
- `src/lib/osint.ts` - Keep file but don't import

### Fix #2: Bundle Size Audit

Run this to check bundle sizes:
```bash
npm run pages:build 2>&1 | grep -E "Worker|size|MB|KB"
```

**If any route exceeds 1MB:**
1. Check for heavy imports (moment.js, lodash full, etc.)
2. Replace with lighter alternatives (date-fns, lodash-es)
3. Lazy-load non-critical code

### Fix #3: Edge Runtime Compatibility

Every API route MUST have this at the top:
```typescript
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
```

**Routes to verify:**
- [ ] `api/feed/global/route.ts`
- [ ] `api/feed/us-intel/route.ts`
- [ ] `api/feed/war-room/route.ts`
- [ ] `api/feed/hacker/route.ts`
- [ ] `api/earnings/*/route.ts`
- [ ] `api/cron/daily-brief/route.ts`

---

## 🚀 Migration Day Execution (Step-by-Step)

### Hour 1: Final Prep
```bash
# 1. Fresh clone (clean slate)
cd /Users/sameeraziz/Documents
git clone [your-repo-url] novai-cloudflare-migration
cd novai-cloudflare-migration
git checkout cloudflare-deployment

# 2. Install
npm install

# 3. Apply the fixes from above
# (Comment out OSINT, verify edge runtime on all routes)
```

### Hour 2: Local Build Test
```bash
# Test the Cloudflare build locally
npm run pages:build

# If it fails, read the error carefully and fix
# Common errors:
# - "X is not defined" → Missing import
# - "Cannot use Node.js API" → Need Edge-compatible alternative
# - "Bundle size exceeded" → Tree-shake or remove dependencies
```

### Hour 3: Local Preview
```bash
# Start local Cloudflare preview
npx wrangler pages dev .vercel/output/static --compatibility-date=2024-01-01

# Test ALL pages manually:
# - http://localhost:8788/ (Home)
# - http://localhost:8788/war-room (War Room)
# - http://localhost:8788/market (Market)
# - http://localhost:8788/us-intel (US Intel)
# - http://localhost:8788/api/feed/global (API test)
```

### Hour 4: Deploy to Cloudflare
```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy .vercel/output/static --project-name=novai-intelligence

# Note the preview URL Cloudflare gives you (e.g., abc123.novai-intelligence.pages.dev)
```

### Hour 5: Verification on Preview URL
Test the preview URL thoroughly:
- [ ] All pages load
- [ ] API routes return data
- [ ] No console errors
- [ ] Mobile responsive

### Hour 6: DNS Cutover
```bash
# Only after verification passes:

# 1. Go to your domain registrar
# 2. Update nameservers to Cloudflare's:
#    - ns1.cloudflare.com (or whatever CF assigned)
#    - ns2.cloudflare.com

# 3. Wait 5-30 minutes for propagation

# 4. Verify at: https://usenovai.live
```

---

## 🧪 Post-Migration Verification

| Test | Expected Result |
|------|-----------------|
| Load homepage | Renders in <2 seconds |
| Load War Room | Map displays (even if OSINT disabled) |
| Load Market | Charts and data appear |
| API: `/api/feed/global` | Returns JSON array |
| Mobile test | Fully responsive |
| No console errors | Clean developer console |

---

## 🔄 Rollback Plan (If Things Go Wrong)

**If Cloudflare deployment fails:**
1. DNS is still on Vercel → No user impact
2. Debug locally, fix, redeploy to Cloudflare

**If Cloudflare works but has bugs:**
1. Keep Vercel running in parallel for 48 hours
2. If major issues, point DNS back to Vercel
3. Fix bugs, redeploy to Cloudflare, try again

**Rollback command:**
```bash
# Point DNS back to Vercel (at your registrar)
# Or if using Cloudflare as DNS already:
# Change CNAME for usenovai.live to point to cname.vercel-dns.com
```

---

## 📊 Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Build fails again | Medium | Blocks migration | Pre-test ALL fixes locally |
| Bundle too large | Medium | Must optimize | Audit before migration day |
| Missing env vars | Low | Features break | Checklist above |
| DNS propagation slow | Low | Temporary downtime | Run both in parallel |
| Feature regression | Low | User complaints | Full QA pass before DNS cutover |

---

## ✅ Success Criteria

Migration is complete when:
- [ ] Site loads on usenovai.live via Cloudflare
- [ ] All core features work (Feed, War Room, Market, US Intel)
- [ ] API routes return data correctly
- [ ] Build passes with no errors
- [ ] Vercel account can be archived

---

## 📝 Notes for Future Reference

1. **Keep `cloudflare-deployment` branch updated** - All CF-specific changes go here
2. **Never merge Node.js-only code** into this branch
3. **Test `npm run pages:build` after every significant change**
4. **Cloudflare has great docs** - https://developers.cloudflare.com/pages/

---

*Last Updated: January 27, 2026*
*Run `/novai-cloudflare-complete-migration` to resume*
