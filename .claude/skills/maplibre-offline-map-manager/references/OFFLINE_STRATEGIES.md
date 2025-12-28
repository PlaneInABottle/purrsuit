# Offline Map Strategies

This document details the offline tile caching and database management strategies for MapLibre in the Purrsuit Mobile App.

## OfflineManager Overview

MapLibre's `OfflineManager` handles the creation, deletion, and status tracking of offline map regions.

### Key Concepts
- **Pack**: A collection of tiles for a specific region.
- **Region**: The geographic bounds and zoom levels of a pack.
- **Style URL**: The specific map style tiles are downloaded for.

## Download Strategy

### Creating an Offline Pack
```typescript
import { OfflineManager } from "@maplibre/maplibre-react-native"

OfflineManager.createPack(
  {
    name: "MyRegion",
    styleURL: "https://tiles.openfreemap.org/styles/liberty",
    minZoom: 10,
    maxZoom: 16,
    bounds: [[-122.5, 37.8], [-122.4, 37.7]],
  },
  onProgress, // (pack, status) => void
  onError     // (pack, error) => void
)
```

### Calculating Bounds from Radius
```typescript
/**
 * Calculate region bounds from center point and radius
 */
function calculateBounds(
  center: [number, number],
  radiusKm: number,
): [[number, number], [number, number]] {
  const [lng, lat] = center
  // 1 degree latitude ≈ 111km
  const latDelta = radiusKm / 111
  const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)))

  return [
    [lng + lngDelta, lat + latDelta], // NE
    [lng - lngDelta, lat - latDelta], // SW
  ]
}
```

## Management Strategies

### Listing and Deleting Packs
```typescript
// List all packs
const packs = await OfflineManager.getPacks()

// Delete specific pack
await OfflineManager.deletePack("MyRegion")

// Clear everything
await OfflineManager.resetDatabase()
```

### Background Progress Tracking
Always provide feedback to the user during downloads.

```typescript
const onProgress = (pack, status) => {
  const { percentage, completedResourceCount, requiredResourceCount } = status
  updateUI(percentage)
}
```

## Storage Considerations

1. **Quota Management**: Tiles can take significant space. Inform users of download size estimates if possible.
2. **Style Consistency**: Offline packs are bound to a specific `styleURL`. If the user switches styles, they may need a different offline pack.
3. **Database Maintenance**: Use `resetDatabase()` occasionally or if the database becomes corrupted.
4. **Platform Specifics**: On Android, ensure the app has enough internal storage; on iOS, use the standard caches/data directories managed by MapLibre.

## Network Requirements

- Initial downloads require an internet connection.
- Once downloaded, the map will render from the local SQLite database when offline.
- Ensure `Telemetry` is disabled for offline-first privacy.
