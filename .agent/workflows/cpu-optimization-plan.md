---
description: CPU Optimization Plan - Zero Cost Strategy to Prevent Vercel Suspension
---

# CPU Optimization Plan (Created: Dec 19, 2024)

**Goal:** Prevent Vercel account suspension by reducing Fluid CPU usage to sustainable levels **without spending money**.

---

## Tomorrow's To-Do List

### A. Add Cloudflare (FREE Tier)
Cloudflare's free tier provides:
- Bot/crawler blocking (biggest CPU saver)
- Edge caching (requests never hit your server)
- DDoS protection
- SSL certificates

**Steps:**
1. Create free Cloudflare account at https://cloudflare.com
2. Add your domain (usenovai.live)
3. Cloudflare will scan DNS records automatically
4. Update nameservers at your domain registrar to Cloudflare's
5. Enable these FREE features:
   - "Bot Fight Mode" → ON (blocks bad bots)
   - "Browser Integrity Check" → ON
   - Caching Level → Standard
   - "Always Online" → ON
6. Wait 24-48 hours for DNS propagation
7. Verify site works through Cloudflare

### B. Add Cache-Control Headers to API Routes
This prevents repeated function invocations for the same data.

**Files to update:**
- `/src/app/api/feed/[category]/route.ts`
- `/src/app/api/feed/global/route.ts`
- `/src/app/api/feed/war-room/route.ts`
- `/src/app/api/feed/future-of-code/route.ts`
- `/src/app/api/feed/us-intel/route.ts`
- `/src/app/api/earnings/*`

**Add to each API response:**
```typescript
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
  },
});
```

This means:
- CDN caches for 60 seconds (no function invocation)
- Serves stale content for 5 min while revalidating in background

---

## Additional Zero-Cost Optimizations

### C. Reduce Client-Side Polling (HIGH IMPACT)
Current client polling intervals hit your API constantly. Change to:
- Critical feeds (Global, US Intel): 120 seconds (2 min)
- Secondary feeds (Videos, Hacker News): 300 seconds (5 min)
- Static pages (About, Support): No polling

### D. Move to Static Generation Where Possible
Pages like `/about`, `/support`, `/landing` should be fully static with no runtime functions.

### E. Add robots.txt to Block Aggressive Crawlers
```
User-agent: *
Crawl-delay: 10

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /
```

### F. Monitor Before/After
Use Vercel Dashboard → Usage → Functions to track:
- Which routes consume most CPU
- Request volume patterns
- Compare week-over-week after changes

---

## Estimated Impact

| Optimization | Expected CPU Reduction | Effort |
|--------------|------------------------|--------|
| Cloudflare (bot blocking) | 30-50% | 30 min setup |
| Cache-Control headers | 20-40% | 15 min |
| Reduce polling intervals | 15-25% | 10 min |
| Static generation | 5-10% | 20 min |
| robots.txt | 5-15% | 5 min |

**Combined potential reduction: 50-80%** if bot traffic is significant.

---

## Emergency Measures (If Approaching Limit)

1. Temporarily disable non-essential API routes
2. Increase cache times to 5+ minutes
3. Disable auto-refresh on all feeds
4. redirect traffic to a static "maintenance" page

---

## Long-Term Strategy

Once site generates revenue:
1. Upgrade to Vercel Pro ($20/mo) for higher limits + analytics
2. Consider moving heavy feeds to Cloudflare Workers (generous free tier)
3. Add Upstash Redis for caching (free tier: 10k requests/day)
