---
description: Switch between Novai Intelligence and Zenith AI projects
---

# Project Selector

Use this workflow to choose which project to work on.

## Available Projects

### 1. Novai Intelligence
- **Location**: `/Users/sameeraziz/Documents/novai-intelligence (2)/`
- **Type**: Next.js 14 (App Router)
- **Purpose**: AI-powered news intelligence platform
- **Status**: Production-ready, deployed to usenovai.live
- **To run locally**:
```bash
cd "/Users/sameeraziz/Documents/novai-intelligence (2)"
source ~/.nvm/nvm.sh && nvm use node && npm run dev
```
- **To deploy**:
```bash
cd "/Users/sameeraziz/Documents/novai-intelligence (2)"
source ~/.nvm/nvm.sh && nvm use node && vercel --prod
```

### 2. Zenith AI
- **Location**: `/Users/sameeraziz/Documents/novai-intelligence (2)/zenith-ai/`
- **Type**: Vite + React 19 + TypeScript
- **Purpose**: Antigravity Property Intelligence Platform
- **Status**: In development
- **Stack**:
  - Frontend: React 19 + Tailwind CSS
  - AI: Gemini 2.5 Flash (Search Grounding, Vision, Long-Context)
  - Backend: Cloudflare Workers + D1 + R2
  - Commerce: Stripe (rent collection, vendor payouts)
- **To run locally**:
```bash
cd "/Users/sameeraziz/Documents/novai-intelligence (2)/zenith-ai"
source ~/.nvm/nvm.sh && nvm use node && npm run dev
```
- **To deploy to Cloudflare Pages**:
```bash
cd "/Users/sameeraziz/Documents/novai-intelligence (2)/zenith-ai"
source ~/.nvm/nvm.sh && nvm use node && npm run build
npx wrangler pages deploy dist --project-name=zenith-ai
```

### 3. SoundScout
- **Location**: `/Users/sameeraziz/Documents/novai-intelligence (2)/sound-scout/`
- **Type**: Vite + React + TypeScript
- **Purpose**: Artist Discovery & A&R Intelligence Platform
- **Status**: Database schema and baseline Frontend Terminal UI created
- **To run locally**:
```bash
cd "/Users/sameeraziz/Documents/novai-intelligence (2)/sound-scout/web"
npm install && npm run dev -- --port 5173
```

## Quick Reference

| Project | Port | Framework | Deploy Target |
|---------|------|-----------|---------------|
| Novai Intelligence | 3000 | Next.js | Vercel |
| Zenith AI | 5173 | Vite/React | Cloudflare Pages |
| SoundScout | 5174 | Vite/React | Cloudflare Pages |

## Starting a Session

When you start working, tell me:
- "Let's work on **Novai**" → I'll focus on the Novai Intelligence codebase
- "Let's work on **Zenith**" → I'll focus on the Zenith AI codebase
- "Let's work on **SoundScout**" → I'll focus on the SoundScout codebase

## Zenith AI Architecture Summary

### Core Services
- `src/services/gemini.ts` - Gemini AI integration (4 modalities)
- `src/services/stripe.ts` - Payment processing & rent splits
- `src/services/vendorNetwork.ts` - Vendor matching & price benchmarking
- `src/services/leasing.ts` - Self-show & tenant screening

### Key Features
1. **Discovery Engine** - Real-time property valuation via Search Grounding
2. **Visual Inspector** - Damage triage via Gemini Vision
3. **Investment Lab** - Financial simulations with long-context reasoning
4. **Vendor Intelligence** - Pre-vetted contractors with transparent pricing
5. **Self-Show System** - Smart lock integration for property tours
6. **Transparent Screening** - AI tenant scoring visible to owners

### Design System
- Dark "Command Terminal" aesthetic
- Colors: slate-950 + indigo-600 accents
- Fonts: Inter (UI) + JetBrains Mono (data)
