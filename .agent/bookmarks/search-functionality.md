---
description: Re-enable and fix the global search bar functionality.
---

# Search Functionality Restoration

The global search bar in the `BreadcrumbHeader` component was temporarily disabled/removed to streamline the UI. The underlying logic in `FeedContainer.tsx` still exists but needs to be re-connected.

## Current State
- **UI**: The input element is hidden or removed in `src/components/navigation/BreadcrumbHeader.tsx`.
- **Logic**: `src/components/feed/FeedContainer.tsx` has `searchQuery` prop and logic to filter feeds.
- **URL Sync**: The search state should sync with the URL search params (`?q=term`).

## Implementation Steps
1.  **Uncomment/Restore UI**: Bring back the search input field in `BreadcrumbHeader.tsx`.
2.  **Verify URL Sync**: Ensure typing in the search bar updates the URL query parameter.
3.  **Verify Feed Filtering**: Ensure `FeedContainer` listens to the URL param and triggers the search logic.
4.  **Mobile Responsiveness**: Ensure the search bar works well on mobile (collapsible or dedicated row).
