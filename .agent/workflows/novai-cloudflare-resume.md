---
description: Resume the NovAI to Cloudflare migration process
---

# Resume NovAI Cloudflare Migration

## Current State
- **Branch**: `cloudflare-deployment` (Isolated repo, ~265MB)
- **Status**: Core API routes converted to Edge runtime, RSS parser refactored for Edge compatibility.
- **Last Build Status**: Local build (`npm run pages:build`) failed on `api/feed/war-room`.

## Instructions
1.  **Project Location**: `/Users/sameeraziz/Documents/novai-intelligence (2)`
2.  **Switch Branch**: `git checkout cloudflare-deployment`
3.  **Setup Node**: `source ~/.nvm/nvm.sh && nvm use node`
4.  **Run Build**: `npm run pages:build`

## Pending Tasks
- [ ] Fix the `api/feed/war-room` build error in `lib/osint.ts`.
- [ ] Connect new Cloudflare account.
- [ ] Point DNS to new Pages site.
