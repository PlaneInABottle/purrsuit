# 🗺️ MapLibre Offline Maps Integration Plan

## Overview

Replace `react-native-maps` (Google Maps) with `@maplibre/maplibre-react-native` to enable **offline map functionality** for the Purrsuit app.

---

## ⚠️ Architecture Consideration

**Your app uses New Architecture** (`"newArchEnabled": true` in app.json)

| Version | New Architecture Support | Recommendation |
|---------|-------------------------|----------------|
| v10.x (stable) | Interop layer only, known issues | ❌ Not recommended |
| v11.x (alpha) | Native Fabric/TurboModules support | ✅ **Use this** |

**Decision:** Use `@maplibre/maplibre-react-native@11.0.0-alpha.19` (latest alpha)

---

## 📦 Dependencies

### Remove
```bash
npm uninstall react-native-maps
```

### Add
```bash
npx expo install @maplibre/maplibre-react-native@11.0.0-alpha.19
```

---

## 🔧 Configuration Changes

### 1. Update `app.json` / `app.config.ts`

Remove Google Maps config, add MapLibre plugin:

```json
{
  "expo": {
    "plugins": [
      "@maplibre/maplibre-react-native"
    ],
    "android": {
      "config": {}  // Remove any google maps config
    },
    "ios": {
      "config": {}  // Remove any google maps config
    }
  }
}
```

### 2. Free Tile Sources (No API Key Required)

| Provider | Style URL | Best For |
|----------|-----------|----------|
| MapLibre Demo | `https://demotiles.maplibre.org/style.json` | Testing only |
| OpenFreeMap Liberty | `https://tiles.openfreemap.org/styles/liberty` | Production (free, light) |
| OpenFreeMap Bright | `https://tiles.openfreemap.org/styles/bright` | Colorful maps |
| OpenFreeMap Positron | `https://tiles.openfreemap.org/styles/positron` | Light minimal |
| OpenFreeMap Dark | `https://tiles.openfreemap.org/styles/dark` | Dark mode |
| Protomaps | Self-hosted or CDN | Full offline control |

**Recommended:** OpenFreeMap Liberty (free, no API key, good quality)

---

## 📁 Implementation Steps

### Phase 1: Basic Migration (Day 1)

#### Step 1.1: Install & Configure
```bash
# Remove old
npm uninstall react-native-maps

# Install new (alpha for New Architecture)
npx expo install @maplibre/maplibre-react-native@11.0.0-alpha.19

# Rebuild native code
npx expo prebuild --clean
```

#### Step 1.2: Update `app.config.ts`
```typescript
plugins: [
  // ... existing plugins
  "@maplibre/maplibre-react-native"
]
```

#### Step 1.3: Create MapLibre wrapper component

**New file:** `app/components/MapLibreView.tsx`
```typescript
import { MapView, Camera, MarkerView } from "@maplibre/maplibre-react-native"
import { StyleSheet, View } from "react-native"

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty"

interface MapLibreViewProps {
  initialCoordinates?: [number, number] // [lng, lat]
  initialZoom?: number
  markers?: Array<{
    id: string
    coordinates: [number, number]
    children?: React.ReactNode
  }>
  onPress?: (coordinates: [number, number]) => void
  onMarkerPress?: (id: string) => void
  children?: React.ReactNode
}

export function MapLibreView({
  initialCoordinates = [-122.4324, 37.78825],
  initialZoom = 12,
  markers = [],
  onPress,
  onMarkerPress,
  children
}: MapLibreViewProps) {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      mapStyle={STYLE_URL}
      onPress={(feature) => {
        if (onPress && feature.geometry.type === "Point") {
          onPress(feature.geometry.coordinates as [number, number])
        }
      }}
    >
      <Camera
        centerCoordinate={initialCoordinates}
        zoomLevel={initialZoom}
      />
      
      {markers.map((marker) => (
        <MarkerView
          key={marker.id}
          coordinate={marker.coordinates}
          onPress={() => onMarkerPress?.(marker.id)}
        >
          {marker.children}
        </MarkerView>
      ))}
      
      {children}
    </MapView>
  )
}
```

### Phase 2: Migrate MapScreen (Day 2)

#### Step 2.1: Update imports in `MapScreen.tsx`

```diff
- import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
+ import { MapView, Camera, MarkerView } from "@maplibre/maplibre-react-native"
```

#### Step 2.2: Update MapView component

**Key API differences:**

| react-native-maps | maplibre-react-native |
|-------------------|----------------------|
| `provider={PROVIDER_GOOGLE}` | Not needed |
| `customMapStyle={...}` | `mapStyle="url-or-object"` |
| `initialRegion={{ latitude, longitude, latitudeDelta, longitudeDelta }}` | `<Camera centerCoordinate={[lng, lat]} zoomLevel={12} />` |
| `<Marker coordinate={{latitude, longitude}}>` | `<MarkerView coordinate={[lng, lat]}>` |
| `mapRef.current.animateToRegion(...)` | `<Camera animationMode="flyTo" />` |
| `mapRef.current.fitToCoordinates(...)` | Use Camera bounds |

#### Step 2.3: Coordinate format change

⚠️ **Important:** MapLibre uses `[longitude, latitude]`, Google Maps uses `{latitude, longitude}`

```typescript
// Convert from Google Maps format
const toMapLibreCoords = (coords: { latitude: number; longitude: number }): [number, number] => {
  return [coords.longitude, coords.latitude]
}

// Convert to Google Maps format (for storage compatibility)
const fromMapLibreCoords = (coords: [number, number]): { latitude: number; longitude: number } => {
  return { latitude: coords[1], longitude: coords[0] }
}
```

### Phase 3: Offline Support (Day 3-4)

#### Step 3.1: Create Offline Manager Service

**New file:** `app/services/offlineMapManager.ts`

```typescript
import { OfflineManager } from "@maplibre/maplibre-react-native"

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty"

export interface OfflineRegion {
  name: string
  bounds: [[number, number], [number, number]] // [[neLng, neLat], [swLng, swLat]]
  minZoom: number
  maxZoom: number
}

export const offlineMapManager = {
  /**
   * Download a region for offline use
   */
  async downloadRegion(
    region: OfflineRegion,
    onProgress?: (progress: number) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      OfflineManager.createPack(
        {
          name: region.name,
          styleURL: STYLE_URL,
          minZoom: region.minZoom,
          maxZoom: region.maxZoom,
          bounds: region.bounds,
        },
        (offlineRegion, status) => {
          const progress = status.percentage
          onProgress?.(progress)
          if (progress === 100) {
            resolve()
          }
        },
        (offlineRegion, error) => {
          onError?.(error)
          reject(error)
        }
      )
    })
  },

  /**
   * Get all downloaded offline packs
   */
  async getDownloadedPacks() {
    return OfflineManager.getPacks()
  },

  /**
   * Get a specific pack by name
   */
  async getPack(name: string) {
    return OfflineManager.getPack(name)
  },

  /**
   * Delete a downloaded pack
   */
  async deletePack(name: string) {
    const pack = await OfflineManager.getPack(name)
    if (pack) {
      await pack.delete()
    }
  },

  /**
   * Delete all offline data
   */
  async resetDatabase() {
    return OfflineManager.resetDatabase()
  },

  /**
   * Calculate region bounds from center point and radius
   */
  calculateBounds(
    center: [number, number],
    radiusKm: number
  ): [[number, number], [number, number]] {
    const [lng, lat] = center
    // Rough approximation: 1 degree ≈ 111km
    const latDelta = radiusKm / 111
    const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)))
    
    return [
      [lng + lngDelta, lat + latDelta], // NE
      [lng - lngDelta, lat - latDelta], // SW
    ]
  }
}
```

#### Step 3.2: Create Offline Download UI Component

**New file:** `app/components/OfflineMapDownloader.tsx`

```typescript
import { useState } from "react"
import { View, TouchableOpacity, Alert } from "react-native"
import { Text } from "@/components/Text"
import { offlineMapManager } from "@/services/offlineMapManager"

interface Props {
  centerCoordinate: [number, number]
  regionName: string
}

export function OfflineMapDownloader({ centerCoordinate, regionName }: Props) {
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDownload = async () => {
    setDownloading(true)
    setProgress(0)

    try {
      const bounds = offlineMapManager.calculateBounds(centerCoordinate, 5) // 5km radius
      
      await offlineMapManager.downloadRegion(
        {
          name: regionName,
          bounds,
          minZoom: 10,
          maxZoom: 16,
        },
        (p) => setProgress(p),
        (error) => {
          Alert.alert("Download Error", error.message)
        }
      )
      
      Alert.alert("Success", "Map region downloaded for offline use!")
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <TouchableOpacity onPress={handleDownload} disabled={downloading}>
      <Text>
        {downloading 
          ? `Downloading... ${Math.round(progress)}%` 
          : "📥 Download for Offline"
        }
      </Text>
    </TouchableOpacity>
  )
}
```

### Phase 4: Settings & Storage Integration (Day 5)

#### Step 4.1: Add offline settings to UserStore

```typescript
// In app/models/UserStore.ts
offlineMapEnabled: types.optional(types.boolean, false),
downloadedRegions: types.optional(types.array(types.string), []),
```

#### Step 4.2: Add offline map section in Settings/Profile screen

- Toggle for "Enable Offline Maps"
- List of downloaded regions with delete option
- "Download Current Area" button
- Storage usage indicator

---

## 📋 Migration Checklist

### Pre-Migration
- [ ] Backup current branch
- [ ] Document current map functionality
- [ ] Test current app thoroughly

### Phase 1: Setup
- [ ] Uninstall `react-native-maps`
- [ ] Install `@maplibre/maplibre-react-native@11.0.0-alpha.19`
- [ ] Update `app.config.ts` with MapLibre plugin
- [ ] Run `npx expo prebuild --clean`
- [ ] Test basic map rendering

### Phase 2: Migration
- [ ] Create `MapLibreView` wrapper component
- [ ] Update `MapScreen.tsx` imports
- [ ] Convert coordinate formats `{lat, lng}` → `[lng, lat]`
- [ ] Update marker components to `MarkerView`
- [ ] Update camera/animation logic
- [ ] Remove Google Maps custom styling, use MapLibre style URL
- [ ] Test all map interactions (pan, zoom, markers)

### Phase 3: Offline
- [ ] Create `offlineMapManager` service
- [ ] Add offline download UI
- [ ] Test offline pack creation
- [ ] Test offline map viewing (airplane mode)
- [ ] Add progress indicators

### Phase 4: Polish
- [ ] Add settings for offline maps
- [ ] Add storage management
- [ ] Update any location picker screens
- [ ] Performance testing
- [ ] Error handling for offline scenarios

---

## 🎨 Style Customization

MapLibre uses JSON style spec. To match your current light theme:

```typescript
// Option 1: Use a pre-built style
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty"

// Option 2: Create custom style (advanced)
const customStyle = {
  version: 8,
  sources: { /* ... */ },
  layers: [ /* ... */ ]
}
```

---

## ⚡ Performance Notes

1. **Offline pack size:** ~50-100MB for a city at zoom 10-16
2. **First load:** Slightly slower than Google Maps (tile download)
3. **Offline performance:** Excellent, faster than online
4. **Memory:** Similar to react-native-maps

---

## 🐛 Known Issues (v11 Alpha)

1. Custom headers API changed - `MLRNCustomHeaders` may need manual setup
2. Some callbacks may have different signatures
3. TypeScript types may be incomplete

**Mitigation:** Monitor GitHub issues, pin to specific alpha version

---

## 📅 Timeline Estimate

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1 | 1 day | Install, configure, basic rendering |
| Phase 2 | 1-2 days | Full MapScreen migration |
| Phase 3 | 2 days | Offline functionality |
| Phase 4 | 1 day | Settings, polish, testing |
| **Total** | **5-6 days** | |

---

## 🔗 Resources

- [MapLibre React Native Docs](https://maplibre.org/maplibre-react-native/)
- [GitHub (Alpha Branch)](https://github.com/maplibre/maplibre-react-native/tree/alpha)
- [OpenFreeMap](https://openfreemap.org/) - Free tile server
- [MapLibre Style Spec](https://maplibre.org/maplibre-style-spec/)

---

**Created:** 2025-12-01  
**Branch:** `feature/maplibre-offline`  
**Status:** Planning
