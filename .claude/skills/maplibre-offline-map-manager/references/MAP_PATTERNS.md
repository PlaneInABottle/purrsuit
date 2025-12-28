# Map Patterns in Purrsuit

This document outlines the MapLibre and Location service patterns used in the Purrsuit Mobile App.

## Map Styles Configuration

We use OpenFreeMap styles for high-quality, free vector tiles.

```typescript
// app/services/offlineMapManager.ts
export const MAP_STYLES = {
  liberty: {
    name: "Liberty",
    url: "https://tiles.openfreemap.org/styles/liberty",
  },
  bright: {
    name: "Bright",
    url: "https://tiles.openfreemap.org/styles/bright",
  },
  positron: {
    name: "Positron",
    url: "https://tiles.openfreemap.org/styles/positron",
  },
  dark: {
    name: "Dark",
    url: "https://tiles.openfreemap.org/styles/dark",
  },
} as const
```

## Map Screen Implementation

### Marker Selection Pattern
```tsx
const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(null)

const handleMarkerPress = (id: string) => {
  setSelectedEncounterId(id)
}

const handleMapPress = () => {
  setSelectedEncounterId(null)
}
```

### Filtering Map Data
```tsx
const filteredEncounters = encountersStore.encountersArray.filter(e => {
  if (!e.hasLocation) return false
  if (selectedPetType !== "all" && e.petType !== selectedPetType) return false
  // Add more filters as needed
  return true
})
```

## Location Integration

### GPS Permission Flow
```typescript
import { requestLocationPermissions, hasLocationPermissions } from "@/services/location"

const checkPermissions = async () => {
  const granted = await hasLocationPermissions()
  if (!granted) {
    const result = await requestLocationPermissions()
    return result.granted
  }
  return true
}
```

### Formatting Coordinates
```typescript
// Display as "37.7749, -122.4194"
const displayCoords = formatCoordinates(latitude, longitude)
```

## Map Control UI Patterns

### Style Selector Grid
```tsx
<Modal visible={showStyleSheet} transparent animationType="slide">
  <Pressable style={styles.overlay} onPress={() => setShowStyleSheet(false)}>
    <View style={styles.sheet}>
      {Object.keys(MAP_STYLES).map(styleKey => (
        <TouchableOpacity key={styleKey} onPress={() => setMapStyle(styleKey)}>
          <Text>{MAP_STYLES[styleKey].name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </Pressable>
</Modal>
```

### Fit All Markers Action
```typescript
const fitAllMarkers = useCallback(() => {
  if (gpsEncounters.length === 0) return

  const lngs = gpsEncounters.map(e => e.location.coordinates.longitude)
  const lats = gpsEncounters.map(e => e.location.coordinates.latitude)
  
  const bounds = [
    Math.min(...lngs) - 0.01, // W
    Math.min(...lats) - 0.01, // S
    Math.max(...lngs) + 0.01, // E
    Math.max(...lats) + 0.01, // N
  ]

  cameraRef.current?.fitBounds(bounds, {
    padding: { top: 100, right: 50, bottom: 200, left: 50 },
    duration: 1000,
  })
}, [gpsEncounters])
```

## Best Practices

1. **Unique Keys**: Markers should have unique keys that include the map style if it changes, to force re-renders if necessary.
2. **Anchor Points**: Use `anchor={{ x: 0.5, y: 0.5 }}` for center-aligned markers.
3. **Memoization**: Memoize coordinate arrays for `fitBounds` to avoid unnecessary camera jumps.
4. **Hit Slops**: Use `hitSlop` on small map controls for better touch targets.
5. **Loading States**: Show a loading indicator while map styles or location data is fetching.
