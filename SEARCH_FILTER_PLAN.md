# Search & Filter Implementation Plan

## Goal
Enable users to filter pet encounters on the **Map Screen** to focus on recent activity or specific time ranges.

## UX Design (Map Screen)

### 1. Time Filter Selector
*   **Location:** Top of the map, floating over the map view (similar to Google Maps chips).
*   **Options:**
    *   **Last 24 Hours** (Default? Or maybe "All Time" is better default, user decides)
    *   **Last 7 Days**
    *   **All Time**

### 2. Map Behavior
*   Updating the filter immediately refreshes the map markers.
*   If no encounters match the filter, show a toast or small overlay: "No encounters in this time range".

## Technical Implementation

### 1. Store Updates (`EncounterStore`)
*   Add a view `getEncountersByTimeRange(hours: number | 'all')`.
*   Logic:
    *   If 'all', return all encounters.
    *   If number, filter `timestamp` > `Date.now() - hours * 60 * 60 * 1000`.

### 2. Component Updates (`MapScreen`)
*   Add local state: `timeFilter` ('24h' | '7d' | 'all').
*   Add UI for filter selection (Floating chips at the top).
*   Update `MapView` markers to render only the filtered list.

## Checklist
- [ ] Add `getEncountersByTimeRange` view to `EncounterStore`.
- [ ] Add Filter UI (Chips) to `MapScreen`.
- [ ] Connect UI state to Store filtering logic.
- [ ] Verify map updates correctly when switching filters.
