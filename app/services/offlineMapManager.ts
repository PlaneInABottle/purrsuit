import { OfflineManager } from "@maplibre/maplibre-react-native"

// Available map styles from OpenFreeMap
export const MAP_STYLES = {
  liberty: {
    name: "Liberty",
    url: "https://tiles.openfreemap.org/styles/liberty",
    description: "Clean, modern style",
  },
  bright: {
    name: "Bright",
    url: "https://tiles.openfreemap.org/styles/bright",
    description: "Colorful and vibrant",
  },
  positron: {
    name: "Positron",
    url: "https://tiles.openfreemap.org/styles/positron",
    description: "Light and minimal",
  },
  dark: {
    name: "Dark",
    url: "https://tiles.openfreemap.org/styles/dark",
    description: "Dark mode friendly",
  },
} as const

export type MapStyleKey = keyof typeof MAP_STYLES

export const MAPLIBRE_STYLE_URL = MAP_STYLES.liberty.url

export interface OfflineRegion {
  name: string
  bounds: [[number, number], [number, number]] // [[neLng, neLat], [swLng, swLat]]
  minZoom: number
  maxZoom: number
}

export interface OfflinePackStatus {
  name: string
  percentage: number
  completedResourceCount: number
  requiredResourceCount: number
}

export const offlineMapManager = {
  /**
   * Download a region for offline use
   */
  async downloadRegion(
    region: OfflineRegion,
    onProgress?: (status: OfflinePackStatus) => void,
    onError?: (error: Error) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      OfflineManager.createPack(
        {
          name: region.name,
          styleURL: MAPLIBRE_STYLE_URL,
          minZoom: region.minZoom,
          maxZoom: region.maxZoom,
          bounds: region.bounds,
        },
        (offlineRegion, status) => {
          onProgress?.({
            name: region.name,
            percentage: status.percentage ?? 0,
            completedResourceCount: status.completedResourceCount ?? 0,
            requiredResourceCount: status.requiredResourceCount ?? 0,
          })
          if (status.percentage === 100) {
            resolve()
          }
        },
        (offlineRegion, error) => {
          const err = new Error(error?.message || "Download failed")
          onError?.(err)
          reject(err)
        },
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
    await OfflineManager.deletePack(name)
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
  },
}

/**
 * Convert from Google Maps format {latitude, longitude} to MapLibre [lng, lat]
 */
export const toMapLibreCoords = (coords: {
  latitude: number
  longitude: number
}): [number, number] => {
  return [coords.longitude, coords.latitude]
}

/**
 * Convert from MapLibre [lng, lat] to Google Maps format {latitude, longitude}
 */
export const fromMapLibreCoords = (
  coords: [number, number],
): { latitude: number; longitude: number } => {
  return { latitude: coords[1], longitude: coords[0] }
}
