# Location & Map Feature Integration Plan

## 🎯 Overview
Add GPS location capture and map view to Purrsuit app in 4 incremental phases.

**Key Finding:** Data model already supports GPS! `EncounterStore.ts` has `Location` model with GPS coordinates and `setGPSLocation()` action ready to use.

---

## Phase 1: Foundation - Location Service
**Goal:** Install dependencies and create location permission service

**Tasks:**
1. Install `expo-location` package via `npx expo install expo-location`
2. Create `/app/services/location.ts` following existing `camera.ts` pattern:
   - `requestLocationPermissions()` - Request foreground location access from user
   - `hasLocationPermissions()` - Check current permission status without requesting
   - `getCurrentLocation()` - Returns current GPS coordinates and accuracy
   - TypeScript types: `LocationPermissionStatus`, `LocationCoordinates`
3. Test location service works on device/simulator with permissions flow

**Files Created:**
- `/app/services/location.ts`

**Complexity:** Low
**Estimation:** 30-45 mins

**Success Criteria:**
- ✅ expo-location installed and working
- ✅ Location service follows camera.ts patterns
- ✅ Permissions request shown to user
- ✅ getCurrentLocation() returns valid coordinates

---

## Phase 2: GPS Location in Capture Flow
**Goal:** Let users add GPS location when saving encounters

**Tasks:**
1. Update `EncounterEditScreen.tsx` (lines 243-273):
   - Add "Use Current Location" button above manual location text input
   - Add state variables:
     - `locationCoords: {latitude: number, longitude: number} | null`
     - `isGettingLocation: boolean`
   - When button pressed:
     - Request location permissions via location service
     - Show loading state
     - Call `getCurrentLocation()`
     - Store coordinates in state
     - Show user feedback (coordinates or address)
   - Update save handler (lines 46-82):
     - If `locationCoords` exists, call `encounter.setGPSLocation(lat, lng)`
     - Otherwise use manual label or no location as before
2. Keep manual text input as fallback option (users can still type "Coffee shop", etc.)
3. Add visual indicator when GPS location is captured
4. Handle errors gracefully with user alerts

**Files Modified:**
- `/home/mirza/Documents/Projects/purrsuitMobileApp/app/screens/EncounterEditScreen.tsx`

**Complexity:** Medium
**Estimation:** 1-1.5 hours

**Success Criteria:**
- ✅ "Use Current Location" button visible in form
- ✅ Permissions request works (first time only)
- ✅ GPS coordinates captured and stored
- ✅ Encounters saved with GPS coordinates
- ✅ Manual location still works as fallback

---

## Phase 3: Map View Tab
**Goal:** Display all encounters with GPS on an interactive map

**Tasks:**
1. Install `react-native-maps` via `npx expo install react-native-maps`
2. Create `/app/screens/MapScreen.tsx`:
   - Import `MapView`, `Marker` from react-native-maps
   - Get encounters from store that have GPS coordinates (`location.type === "gps"`)
   - Set initial region to first encounter or user's current location
   - Render Marker for each encounter:
     - Coordinates from `encounter.location.coordinates`
     - Custom marker colors by pet type:
       - Cat: Orange (#FF9800)
       - Dog: Blue (#2196F3)
       - Other: Purple (#9C27B0)
     - Title: Pet type + date
     - Tap marker → navigate to EncounterDetail with encounterid
   - Add "Show All Markers" button to fit all markers in view
   - Add filter buttons (All / Cat / Dog / Other)
   - Handle edge cases:
     - No GPS encounters: Show message "No encounters with GPS location yet"
     - Location permissions: Request if needed
3. Update navigation:
   - Add `Map: undefined` to `MainTabParamList` in `/app/navigators/navigationTypes.ts`
   - Add Map tab to `MainTabNavigator.tsx` (between Stats and Profile, line ~60)
   - Use MapPin icon from lucide-react-native for tab icon
   - Tab label: "Map"
4. Test on iOS and Android simulators

**Files Created:**
- `/app/screens/MapScreen.tsx`

**Files Modified:**
- `/home/mirza/Documents/Projects/purrsuitMobileApp/app/navigators/MainTabNavigator.tsx`
- `/home/mirza/Documents/Projects/purrsuitMobileApp/app/navigators/navigationTypes.ts`

**Complexity:** Medium-High
**Estimation:** 2-3 hours

**Success Criteria:**
- ✅ Map tab appears in navigation
- ✅ MapView renders correctly
- ✅ Markers show for all GPS encounters
- ✅ Colors match pet types
- ✅ Tap marker navigates to encounter detail
- ✅ Filter buttons work
- ✅ "Show All Markers" fits view properly

---

## Phase 4: Polish & Enhancements
**Goal:** Improve UX and add nice-to-have features

**Tasks:**
1. Add location badge in HomeScreen encounter cards:
   - Show small map pin icon if encounter has GPS location
   - Add to grid view cells (top-right corner or near pet type badge)
2. Add reverse geocoding in EncounterEditScreen:
   - When GPS captured, convert coordinates to address
   - Show address instead of just "lat: 37.78, lng: -122.43"
   - Use `Location.reverseGeocodeAsync()` from expo-location
3. Add location statistics in StatsScreen:
   - Top GPS locations by encounter count
   - Map showing top encounter locations (heatmap style)
4. Optional nice-to-haves:
   - Mini map preview in EncounterEditScreen when GPS selected
   - Add "Navigate to Location" button in EncounterDetail
   - Add marker clustering for dense areas in MapScreen
   - Location-based filtering in HomeScreen (show encounters near current location)

**Files Modified:**
- `/app/screens/HomeScreen.tsx`
- `/app/screens/MapScreen.tsx`
- `/app/screens/EncounterEditScreen.tsx`
- `/app/screens/StatsScreen.tsx`

**Complexity:** Medium
**Estimation:** 2-3 hours

**Success Criteria:**
- ✅ Location badges visible in HomeScreen
- ✅ Reverse geocoding shows addresses
- ✅ Stats screen shows location data
- ✅ All nice-to-haves tested and working

---

## 📊 Total Estimation: ~6-8 hours across 4 phases

**Per Phase Breakdown:**
- Phase 1: 0.5-0.75 hours
- Phase 2: 1-1.5 hours
- Phase 3: 2-3 hours
- Phase 4: 2-3 hours

Each phase is independently testable and delivers incremental value.

---

## 🏗️ Architecture Notes

### Location Service Pattern (Phase 1)
Follow existing `app/services/camera.ts` pattern:
```typescript
interface LocationPermissionStatus {
  granted: boolean
  canAskAgain: boolean
}

interface LocationCoordinates {
  latitude: number
  longitude: number
  accuracy?: number
}

export async function requestLocationPermissions(): Promise<LocationPermissionStatus>
export async function hasLocationPermissions(): Promise<boolean>
export async function getCurrentLocation(): Promise<LocationCoordinates>
```

### Data Model Already Ready
File: `/app/models/EncounterStore.ts` (lines 14-23, 170-176)
```typescript
// Location model supports GPS coordinates
const Location = types.model("Location", {
  type: types.enumeration(["none", "manual", "gps"]),
  label: types.maybe(types.string),
  coordinates: types.maybe(types.model({
    latitude: types.number,
    longitude: types.number,
  }))
})

// Action already exists
setGPSLocation(latitude: number, longitude: number, label?: string) {
  this.location = {
    type: "gps",
    coordinates: { latitude, longitude },
    label: label || `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  }
}
```

### Navigation Integration
Current tabs in `MainTabNavigator.tsx` (lines 45-76):
1. Home
2. Capture
3. Stats
4. Profile

New Map tab will be inserted between Stats and Profile.

---

## 🚀 Implementation Order
1. **Phase 1** (Location Service) - Foundation
2. **Phase 2** (GPS in Capture) - Core feature
3. **Phase 3** (Map Tab) - Main feature
4. **Phase 4** (Polish) - UX improvements

Each phase is a separate commit with clear scope.

---

## 📝 Key Files Reference

### Services
- `/app/services/camera.ts` - Reference pattern for location.ts
- `/app/services/location.ts` - CREATE in Phase 1

### Screens
- `/app/screens/CaptureScreen.tsx` - Photo capture (related, reference)
- `/app/screens/EncounterEditScreen.tsx` - MODIFY in Phase 2 (location picker)
- `/app/screens/MapScreen.tsx` - CREATE in Phase 3
- `/app/screens/HomeScreen.tsx` - MODIFY in Phase 4 (location badges)
- `/app/screens/StatsScreen.tsx` - MODIFY in Phase 4 (location stats)

### Models
- `/app/models/EncounterStore.ts` - Location model (REFERENCE, already ready)
- `/app/models/RootStore.ts` - Root store (REFERENCE)

### Navigation
- `/app/navigators/navigationTypes.ts` - MODIFY in Phase 3
- `/app/navigators/MainTabNavigator.tsx` - MODIFY in Phase 3

---

**Last Updated:** 2025-11-16
**Status:** Plan Approved, Ready for Implementation
