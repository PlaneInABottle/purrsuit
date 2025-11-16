import * as Location from "expo-location"

/**
 * Location service for GPS coordinates and permissions
 * Handles location permissions and coordinate retrieval
 */

export interface LocationPermissionStatus {
  granted: boolean
  canAskAgain: boolean
}

export interface LocationCoordinates {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface ReverseGeocodedLocation {
  street?: string
  city?: string
  region?: string
  country?: string
  postalCode?: string
}

/**
 * Request foreground location permissions
 * @returns Permission status
 */
export async function requestLocationPermissions(): Promise<LocationPermissionStatus> {
  try {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync()
    return {
      granted: status === "granted",
      canAskAgain,
    }
  } catch (error) {
    console.error("Failed to request location permissions:", error)
    return { granted: false, canAskAgain: false }
  }
}

/**
 * Check if location permissions are granted
 * @returns true if permissions are granted
 */
export async function hasLocationPermissions(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync()
    return status === "granted"
  } catch (error) {
    console.error("Failed to check location permissions:", error)
    return false
  }
}

/**
 * Get current device location
 * @returns Current coordinates or null if failed
 */
export async function getCurrentLocation(): Promise<LocationCoordinates | null> {
  try {
    // Check permissions first
    const hasPermission = await hasLocationPermissions()
    if (!hasPermission) {
      console.warn("Location permissions not granted")
      return null
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
    }
  } catch (error) {
    console.error("Failed to get current location:", error)
    return null
  }
}

/**
 * Reverse geocode coordinates to address
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Address information or null if failed
 */
export async function reverseGeocodeAsync(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodedLocation | null> {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    })

    if (results.length === 0) {
      return null
    }

    const address = results[0]
    return {
      street: address.street || undefined,
      city: address.city || undefined,
      region: address.region || undefined,
      country: address.country || undefined,
      postalCode: address.postalCode || undefined,
    }
  } catch (error) {
    console.error("Failed to reverse geocode location:", error)
    return null
  }
}

/**
 * Format location coordinates to readable string
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Formatted string like "37.7749, -122.4194"
 */
export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
}

/**
 * Format address object to readable string
 * @param address - Address object from reverse geocoding
 * @returns Formatted address string
 */
export function formatAddress(address: ReverseGeocodedLocation): string {
  const parts = []

  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.region) parts.push(address.region)
  if (address.country) parts.push(address.country)

  return parts.filter(Boolean).join(", ") || "Unknown location"
}
