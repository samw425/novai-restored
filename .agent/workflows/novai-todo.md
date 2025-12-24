---
description: Novai Intelligence - To-Do List for when we resume work
---

# Novai Intelligence - To-Do List
**Last Updated:** Dec 23, 2024 @ 7:21 PM
**Status:** Site live, holding off on deploys (over Fluid CPU limit)

---

## 🔴 DO NOT DEPLOY UNTIL CPU RESETS

- GitHub auto-deploy is **DISCONNECTED**
- Only deploy with `vercel --prod`
- Wait for billing cycle to reset before next deploy

---

## 🟡 PENDING WORK (Ready to Deploy When Safe)

### 1. OG Images for All Pages
**Goal:** Every page needs its own OG image so link previews look professional.

**Two-tier approach:**
- **Major pages** (custom distinct designs): War Room, US Intel, Earnings, Robotics, Market, AI, Antitrust
- **Minor pages** (template-based): Support, Feedback, Terms, Privacy, etc.

**Already done:**
- ✅ `/` (Home) - Globe + Shield design
- ✅ `/signup` - "Join Novai" + perks footer (code exists, may need cache refresh)
- ✅ `/us-intel` - PNG static image
- ✅ `/war-room` - PNG static image

**Need to create (33 pages total):**
- `/earnings` - Stock/earnings theme
- `/robotics` - Robotics theme
- `/market` - Market data theme
- `/global-feed` - AI news theme
- `/ai` - AI deep dive theme
- `/anti-trust` - Legal theme
- `/support` - Support theme
- All other pages - Use template design

**Template file created:** `src/lib/og-template.tsx`
**HTML previews saved:** `og-previews/` folder

### 2. Signup OG Image Not Showing
- File exists: `src/app/signup/opengraph-image.tsx`
- May be caching issue on social platforms
- Try: Twitter Card Validator, Facebook Debugger after next deploy

---

## ✅ COMPLETED (Dec 21-23)

1. Email visibility fixed (removed from feedback, privacy, terms pages)
2. 176+ RSS feeds added (paywalls removed)
3. Main OG image updated (Remastered Classic)
4. GitHub disconnected from Vercel auto-deploy
5. Last deploy: Dec 23 @ 1:33 AM

---

## 📁 KEY FILES

- **Main OG:** `src/app/opengraph-image.tsx`
- **Signup OG:** `src/app/signup/opengraph-image.tsx`
- **OG Template:** `src/lib/og-template.tsx`
- **HTML Previews:** `og-previews/` folder
- **RSS Feeds:** `src/config/rss-feeds.ts`

---

## ⚠️ CRITICAL REMINDERS

1. **NEVER use `git push`** - triggers automatic Vercel builds
2. **ONLY use `vercel --prod`** - single manual deploy
3. **Check CPU usage** before any deploy
4. **Bundle all changes** into one deploy to minimize usage
