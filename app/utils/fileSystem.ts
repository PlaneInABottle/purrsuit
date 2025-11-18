import { Paths, Directory, File } from "expo-file-system"
import { manipulateAsync, SaveFormat } from "expo-image-manipulator"

/**
 * File system utilities for managing encounter photos
 * Stores photos in DocumentDirectory/purrsuit/
 */

// Directory structure using new SDK 54 API
const baseDir = new Directory(Paths.document, "purrsuit")
const photosDir = new Directory(baseDir, "photos")
const thumbnailsDir = new Directory(baseDir, "thumbnails")

// Thumbnail dimensions
const THUMBNAIL_WIDTH = 300

/**
 * Initialize the directory structure
 */
export async function initFileSystem(): Promise<void> {
  try {
    if (!baseDir.exists) {
      baseDir.create()
    }
    if (!photosDir.exists) {
      photosDir.create()
    }
    if (!thumbnailsDir.exists) {
      thumbnailsDir.create()
    }
  } catch (error) {
    console.error("Failed to initialize file system:", error)
    throw error
  }
}

/**
 * Save a photo and generate thumbnail
 * @param sourceUri - Source URI of the photo (from camera or picker)
 * @param photoId - Unique identifier for this photo
 * @returns Object with full photo URI and thumbnail URI
 */
export async function savePhoto(
  sourceUri: string,
  photoId: string,
): Promise<{ photoUri: string; thumbnailUri: string }> {
  try {
    await initFileSystem()

    // Save full resolution photo
    const photoFile = new File(photosDir, `${photoId}.png`)
    const sourceFile = new File(sourceUri)
    await sourceFile.copy(photoFile)

    // Generate and save thumbnail
    const thumbnailUri = await generateThumbnail(sourceUri, photoId)

    return { photoUri: photoFile.uri, thumbnailUri }
  } catch (error) {
    console.error("Failed to save photo:", error)
    throw error
  }
}

/**
 * Generate a thumbnail from a photo
 * @param sourceUri - Source photo URI
 * @param photoId - Unique identifier for this photo
 * @returns Thumbnail URI
 */
async function generateThumbnail(sourceUri: string, photoId: string): Promise<string> {
  try {
    const manipResult = await manipulateAsync(sourceUri, [{ resize: { width: THUMBNAIL_WIDTH } }], {
      compress: 0.8,
      format: SaveFormat.PNG,
    })

    const thumbnailFile = new File(thumbnailsDir, `${photoId}_thumb.png`)
    const tempFile = new File(manipResult.uri)
    await tempFile.move(thumbnailFile)

    return thumbnailFile.uri
  } catch (error) {
    console.error("Failed to generate thumbnail:", error)
    throw error
  }
}

/**
 * Delete a photo and its thumbnail
 * @param photoId - Unique identifier for the photo
 */
export async function deletePhoto(photoId: string): Promise<void> {
  try {
    // Try to delete both png and jpg versions to handle legacy files
    const photoFilePng = new File(photosDir, `${photoId}.png`)
    const photoFileJpg = new File(photosDir, `${photoId}.jpg`)
    const thumbnailFilePng = new File(thumbnailsDir, `${photoId}_thumb.png`)
    const thumbnailFileJpg = new File(thumbnailsDir, `${photoId}_thumb.jpg`)

    // Delete photos
    if (photoFilePng.exists) photoFilePng.delete()
    if (photoFileJpg.exists) photoFileJpg.delete()

    // Delete thumbnails
    if (thumbnailFilePng.exists) thumbnailFilePng.delete()
    if (thumbnailFileJpg.exists) thumbnailFileJpg.delete()
  } catch (error) {
    console.error("Failed to delete photo:", error)
    throw error
  }
}

/**
 * Check if a photo exists
 * @param photoId - Unique identifier for the photo
 * @returns true if photo exists
 */
export function photoExists(photoId: string): boolean {
  try {
    const photoFilePng = new File(photosDir, `${photoId}.png`)
    const photoFileJpg = new File(photosDir, `${photoId}.jpg`)
    return photoFilePng.exists || photoFileJpg.exists
  } catch {
    return false
  }
}

/**
 * Get the full URI for a photo
 * @param photoId - Unique identifier for the photo
 * @returns Full photo URI
 */
export function getPhotoUri(photoId: string): string {
  const photoFilePng = new File(photosDir, `${photoId}.png`)
  return photoFilePng.exists ? photoFilePng.uri : new File(photosDir, `${photoId}.jpg`).uri
}

/**
 * Get the thumbnail URI for a photo
 * @param photoId - Unique identifier for the photo
 * @returns Thumbnail URI
 */
export function getThumbnailUri(photoId: string): string {
  const thumbFilePng = new File(thumbnailsDir, `${photoId}_thumb.png`)
  return thumbFilePng.exists
    ? thumbFilePng.uri
    : new File(thumbnailsDir, `${photoId}_thumb.jpg`).uri
}

/**
 * Get storage info
 * @returns Object with photo count and total size in bytes
 */
export function getStorageInfo(): { photoCount: number; totalSizeBytes: number } {
  try {
    if (!photosDir.exists) {
      return { photoCount: 0, totalSizeBytes: 0 }
    }

    const items = photosDir.list()
    const photos = items.filter((item) => item instanceof File)

    let totalSize = 0
    for (const photo of photos) {
      if (photo instanceof File) {
        totalSize += photo.size || 0
      }
    }

    return { photoCount: photos.length, totalSizeBytes: totalSize }
  } catch (error) {
    console.error("Failed to get storage info:", error)
    return { photoCount: 0, totalSizeBytes: 0 }
  }
}

/**
 * Clean up orphaned photos (photos not referenced in encounters)
 * @param validPhotoIds - Array of photo IDs that should be kept
 */
export function cleanupOrphanedPhotos(validPhotoIds: string[]): number {
  try {
    if (!photosDir.exists) {
      return 0
    }

    const items = photosDir.list()
    let deletedCount = 0

    for (const item of items) {
      if (item instanceof File) {
        const photoId = item.name.replace(".jpg", "").replace(".png", "")
        if (!validPhotoIds.includes(photoId)) {
          deletePhoto(photoId)
          deletedCount++
        }
      }
    }

    return deletedCount
  } catch (error) {
    console.error("Failed to cleanup orphaned photos:", error)
    return 0
  }
}
