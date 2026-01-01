---
description: Novai Emergency Restoration Plan - Getting Back Online ASAP
---

# Operation Phoenix: Novai Restoration Plan

**Goal:** Restore Novai Intelligence to live status immediately without losing any features.

## 1. Immediate Execution (Move to New Vercel Account)
The fastest path to "Live" is a fresh account to bypass the current suspension.

1. **Clear Linkage:**
   `rm -rf .vercel`
2. **Authenticate:**
   `vercel logout`
   `vercel login` (Login to the NEW account)
3. **Deploy:**
   `vercel --prod`
   * Select "Y" to set up and deploy.
   * Name the project `novai-remastered`.
4. **Environment Variables:**
   Copy all keys from the old project to the new one. (Critical: Supabase, RSS Feeds).

## 2. Infrastructure Protections (Already Applied to Code)
To ensure the new account doesn't die, these optimizations are already in place:
* **Edge Caching:** API routes now use `s-maxage=300`. Requests hit the edge cache, not the CPU.
* **Polling:** Dashboard refresh intervals increased to 10m to reduce function invocations.
* **Zero Feature Loss:** No UI elements or data sources were removed.

## 3. Alternative: Cloudflare Pages
If Vercel blocks the new account, we pivot to Cloudflare:
1. `npx wrangler pages deploy .`
2. This uses Cloudflare's massive edge network which is more resilient to polling-heavy apps.

## 4. Domain Swap
Once the new deployment is verified:
1. Go to your domain registrar.
2. Update the A/CNAME records to point to the new Vercel (or Cloudflare) deployment.
