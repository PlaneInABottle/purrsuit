import { Camera } from "expo-camera"
import type { CameraType, FlashMode } from "expo-camera"
import * as ImagePicker from "expo-image-picker"

/**
 * Camera service for capturing photos
 * Handles permissions and photo capture
 */

export interface CameraPermissionStatus {
  granted: boolean
  canAskAgain: boolean
}

/**
 * Request camera permissions
 * @returns Permission status
 */
export async function requestCameraPermissions(): Promise<CameraPermissionStatus> {
  try {
    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync()
    return {
      granted: status === "granted",
      canAskAgain,
    }
  } catch (error) {
    console.error("Failed to request camera permissions:", error)
    return { granted: false, canAskAgain: false }
  }
}

/**
 * Check if camera permissions are granted
 * @returns true if permissions are granted
 */
export async function hasCameraPermissions(): Promise<boolean> {
  try {
    const { status } = await Camera.getCameraPermissionsAsync()
    return status === "granted"
  } catch (error) {
    console.error("Failed to check camera permissions:", error)
    return false
  }
}

/**
 * Launch image picker to select a photo from library
 * @returns Selected image URI or null if cancelled
 */
export async function pickImageFromLibrary(): Promise<string | null> {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      console.warn("Media library permissions not granted")
      return null
    }

    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: false,
      quality: 1,
      exif: false,
    })

    if (result.canceled) {
      return null
    }

    return result.assets[0].uri
  } catch (error) {
    console.error("Failed to pick image from library:", error)
    return null
  }
}

/**
 * Camera configuration options
 */
export interface CameraConfig {
  type: CameraType
  flashMode: FlashMode
  quality?: number
}

/**
 * Get default camera configuration
 */
export function getDefaultCameraConfig(): CameraConfig {
  return {
    type: "back",
    flashMode: "off",
    quality: 1,
  }
}

/**
 * Toggle camera type (front/back)
 */
export function toggleCameraType(current: CameraType): CameraType {
  return current === "back" ? "front" : "back"
}

/**
 * Cycle through flash modes
 */
export function cycleFlashMode(current: FlashMode): FlashMode {
  const modes: FlashMode[] = ["off", "on", "auto"]
  const currentIndex = modes.indexOf(current)
  const nextIndex = (currentIndex + 1) % modes.length
  return modes[nextIndex]
}

/**
 * Get flash mode type indicator
 */
export function getFlashModeType(mode: FlashMode): "on" | "auto" | "off" {
  switch (mode) {
    case "on":
      return "on"
    case "auto":
      return "auto"
    case "off":
    default:
      return "off"
  }
}
