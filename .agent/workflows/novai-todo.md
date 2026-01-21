---
description: Novai Intelligence - To-Do List for when we resume work
---

# Novai Intelligence - Master To-Do List
**Last Updated:** Jan 21, 2026 @ 10:22 AM
**Status:** Local dev active, auto-save every 60s enabled

---

## 🔴 CURRENT MISSION: Phase 1 - Foundation & AI Synthesis

### In Progress [/]
- **AI Daily Briefing**
  - [x] Created `src/lib/synthesis.ts` - Gemini-powered news clustering
  - [x] Created `src/app/api/daily-brief/route.ts` - API endpoint
  - [x] Created `src/components/dashboard/DailyBriefHero.tsx` - Component
  - [ ] **NEXT**: Integrate DailyBriefHero into Global Feed page
  - [ ] Wire up actual email sending (Resend) for daily newsletter

### Pending
- [ ] **Signal Score Engine**
  - [ ] Implement `calculateSignalScore()` in backend/api layer
  - [ ] Add visual "Impact Index" gauges to `FeedCard`
- [ ] **Tactile UI Overhaul**
  - [ ] "Digital Clay" design system (CSS depth/inertia)
  - [ ] Kinetic typography for "System Status" indicators
- [ ] **The OG Audit**
  - [ ] Generate 33 high-quality OG images

---

## 🟡 Phase 2: Interactive Intelligence (After Phase 1)
- [ ] War Room "Ask the Feed" RAG
- [ ] Custom "Signals" (Watchlists) with notifications
- [ ] The Oracle (Beta) - Predictive trends

---

## 🔴 Phase 3: Monetization & B2B (Future)
- [ ] Tiered SaaS (Stripe Pro/Enterprise)
- [ ] Verticalization: NovAI: Defense
- [ ] API Documentation for licensing

---

## 📁 KEY FILES (Current Work)

| File | Purpose |
|------|---------|
| `src/lib/synthesis.ts` | Gemini AI synthesis engine |
| `src/app/api/daily-brief/route.ts` | Daily Brief API endpoint |
| `src/components/dashboard/DailyBriefHero.tsx` | Daily Brief UI component |
| `src/app/(dashboard)/global-feed/page.tsx` | Global Feed page (needs integration) |

---

## ⚠️ CRITICAL REMINDERS

1. **Auto-save active** - Git commits every 60 seconds
2. **Dev server running** - http://localhost:3000
3. **NEVER use `git push`** - triggers automatic Vercel builds
4. **Build local, test, deploy ONCE** when ready

---

## 🎯 IMMEDIATE NEXT STEPS

1. Integrate `DailyBriefHero` into `/global-feed` page
2. Test the AI synthesis locally
3. Wire up Resend email for daily newsletter
4. Verify feeds are infinite/real-time
