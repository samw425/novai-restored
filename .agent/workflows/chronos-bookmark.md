---
description: Resume Chronos Engine Development
---

# Chronos Engine Bookmark

## Project State
**Status:** Parked (Failed State)
**Last Deploy:** https://chronoslive.pages.dev (Verified Light Mode)
**Codebase:** `/Users/sameeraziz/Documents/novai-intelligence (2)/chronos-engine`

## Issues at Park Time
1. **Layout Alignment:** User reported "Why is it centered like this?" - Suspect CSS mismatch between `App.css` and `index.css` defaults.
2. **Interactivity:** User reported "No links work". Likely z-index layering issue where the Nebula canvas is blocking the dashboard buttons.
3. **User Sentiment:** "Failed project", "waste of credits".

## Restoration Plan
To resume work on this project, run this workflow.

1. **Review Parked State:**
   - Read `PARKED.md` in the project root.
   - Check `src/App.css` for z-index layering (Dashboard must be > Nebula).
   - Check global styles for default flex centering.

2. **Fix Steps (Code):**
   - Ensure `.dashboard` has `z-index: 100` and `position: absolute`.
   - Ensure `.nebula-container` has `z-index: 0` and `pointer-events: none` (or specific interaction for nodes only).
   - Verify build pipeline with `npm run build`.

3. **Verify:**
   - Run `npm run dev` and check if buttons are clickable.
   - Deploy to Cloudflare Pages.
