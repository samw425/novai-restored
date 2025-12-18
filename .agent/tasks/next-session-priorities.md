# Novai Intelligence - Priority List
*Updated: 2025-12-18 12:56 PM*

---

## 🔴 CRITICAL (Today's Focus)

### 1. Fix Email Notifications
All forms should send to `saziz4250@gmail.com`:
- [ ] Signup form
- [ ] Join Waitlist form (pro-waitlist)
- [ ] Contact form
- [ ] Feedback form

**Root Cause:** RESEND_API_KEY may not be set in the NEW Vercel account's environment variables.

**Action items:**
- Verify RESEND_API_KEY is set in Vercel Dashboard → Settings → Environment Variables
- If not, add it from your Resend account
- Test each form after verification

### 2. Optimize Vercel Function Usage (PREVENT PAUSE)
Reduce serverless function invocations to stay within Hobby plan limits.

**Strategy:**
- Increase `revalidate` times on all feed API routes (e.g., 60s → 300s)
- Add response caching headers
- Use ISR (Incremental Static Regeneration) where possible
- Avoid client-side polling (setInterval fetches)

**API Routes to Optimize (41 total):**
- feed/* routes (most called)
- earnings/* routes
- brief/route.ts

---

## 🟡 HIGH PRIORITY (After Critical)

### 3. Fix DHS Live Feed (US Intel Page)
- Department of Homeland Security feed showing **outdated 2022 data**
- Need updated RSS source

### 4. Fix FBI Page
- FBI page not working properly
- Check RSS feed source

### 5. CIA Page Enhancement
- Create **"Education" tab** for existing static/educational links
- Add **fresh live feed tab** for real-time intel

---

## 🟢 STRATEGIC (Monetization & Growth)

### 6. Monetization Strategy for Novai Intelligence

**Why would people sign up?**
- Access to premium features (saved searches, alerts, custom feeds)
- Daily intelligence digest delivered to inbox
- Early access to new features
- Ad-free experience
- API access for developers

**Monetization Options:**

| Model | Pros | Cons |
|-------|------|------|
| **Freemium** | Wide reach, upsell path | Need compelling premium features |
| **Subscription** ($5-15/mo) | Recurring revenue | Need enough value to justify |
| **Donations/Support** | Low friction | Unpredictable income |
| **Sponsorships** | High value | Need audience first |
| **API Access** | B2B revenue | Technical overhead |

**Recommended Approach:**
1. **Phase 1 (Now):** Free with waitlist for "Pro" features
2. **Phase 2:** Launch Pro tier with:
   - Custom alerts ("notify me when X")
   - Saved searches & custom feeds
   - Daily email digest
   - API access
3. **Phase 3:** Consider enterprise/team plans

**Do we need a login page?**
- For basic access: NO (keep it frictionless)
- For Pro features: YES (use Supabase Auth - already installed)

**Action items:**
- [ ] Define what "Pro" features will be
- [ ] Design pricing page
- [ ] Implement Supabase Auth for login/signup
- [ ] Create user dashboard for Pro users
- [ ] Set up Stripe for payments

---

## 💡 Future Enhancements
- Daily email digest
- Twitter/X bot for breaking stories
- SEO landing pages
- Telegram/Discord channel
- Mobile PWA optimizations
- Personalization features
- Alert system
