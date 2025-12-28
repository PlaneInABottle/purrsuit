# Photo Storage Patterns

This document covers file system management and storage patterns for photos in Expo React Native apps.

## File System Setup

### Directory Structure
```typescript
// app/utils/fileSystem.ts
import * as FileSystem from 'expo-file-system'

export const APP_DIR = `${FileSystem.documentDirectory}purrsuit/`
export const PHOTOS_DIR = `${APP_DIR}photos/`
export const THUMBNAILS_DIR = `${APP_DIR}thumbnails/`
export const TEMP_DIR = `${APP_DIR}temp/`
export const CACHE_DIR = `${APP_DIR}cache/`

export async function initializeFileSystem(): Promise<void> {
  const directories = [PHOTOS_DIR, THUMBNAILS_DIR, TEMP_DIR, CACHE_DIR]

  for (const dir of directories) {
    try {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true })
    } catch (error) {
      console.error(`Failed to create directory ${dir}:`, error)
    }
  }
}
```

### File Naming Conventions
```typescript
export function generateFileName(prefix: string, extension = 'jpg'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}.${extension}`
}

// Usage
const photoFilename = generateFileName('photo')        // "photo_1234567890_abc123.jpg"
const thumbnailFilename = generateFileName('thumb')    // "thumb_1234567890_def456.jpg"
const tempFilename = generateFileName('temp', 'png')   // "temp_1234567890_ghi789.png"
```

## Photo Storage Service

### Storage Manager Class
```typescript
// app/services/photoStorage.ts
export interface StoredPhoto {
  id: string
  originalPath: string
  thumbnailPath: string
  metadata: PhotoMetadata
  createdAt: number
}

export interface PhotoMetadata {
  width: number
  height: number
  size: number
  format: string
  capturedAt?: number
  location?: {
    latitude: number
    longitude: number
  }
}

export class PhotoStorageService {
  private static instance: PhotoStorageService
  private storageKey = 'stored_photos'

  static getInstance(): PhotoStorageService {
    if (!PhotoStorageService.instance) {
      PhotoStorageService.instance = new PhotoStorageService()
    }
    return PhotoStorageService.instance
  }

  async storePhoto(
    originalUri: string,
    thumbnailUri: string,
    metadata: PhotoMetadata
  ): Promise<StoredPhoto> {
    // Generate unique ID
    const id = generateId()

    // Generate filenames
    const originalFilename = generateFileName('photo')
    const thumbnailFilename = generateFileName('thumb')

    // Copy files to permanent storage
    const originalPath = await this.saveFile(originalUri, originalFilename, PHOTOS_DIR)
    const thumbnailPath = await this.saveFile(thumbnailUri, thumbnailFilename, THUMBNAILS_DIR)

    // Create stored photo record
    const storedPhoto: StoredPhoto = {
      id,
      originalPath,
      thumbnailPath,
      metadata: {
        ...metadata,
        size: await this.getFileSize(originalPath),
      },
      createdAt: Date.now(),
    }

    // Save to storage index
    await this.saveToIndex(storedPhoto)

    return storedPhoto
  }

  private async saveFile(
    sourceUri: string,
    filename: string,
    targetDir: string
  ): Promise<string> {
    const targetPath = `${targetDir}${filename}`
    await FileSystem.copyAsync({
      from: sourceUri,
      to: targetPath
    })
    return targetPath
  }

  private async getFileSize(filePath: string): Promise<number> {
    const info = await FileSystem.getInfoAsync(filePath)
    return info.size || 0
  }

  private async saveToIndex(photo: StoredPhoto): Promise<void> {
    const stored = await this.getStoredPhotos()
    stored.push(photo)
    await this.saveStoredPhotos(stored)
  }

  async getStoredPhotos(): Promise<StoredPhoto[]> {
    try {
      const stored = await MMKV.getString(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load stored photos:', error)
      return []
    }
  }

  private async saveStoredPhotos(photos: StoredPhoto[]): Promise<void> {
    try {
      await MMKV.setString(this.storageKey, JSON.stringify(photos))
    } catch (error) {
      console.error('Failed to save stored photos:', error)
    }
  }

  async deletePhoto(id: string): Promise<boolean> {
    try {
      const photos = await this.getStoredPhotos()
      const photoIndex = photos.findIndex(p => p.id === id)

      if (photoIndex === -1) return false

      const photo = photos[photoIndex]

      // Delete files
      await FileSystem.deleteAsync(photo.originalPath, { idempotent: true })
      await FileSystem.deleteAsync(photo.thumbnailPath, { idempotent: true })

      // Remove from index
      photos.splice(photoIndex, 1)
      await this.saveStoredPhotos(photos)

      return true
    } catch (error) {
      console.error('Failed to delete photo:', error)
      return false
    }
  }

  async getPhotoById(id: string): Promise<StoredPhoto | null> {
    const photos = await this.getStoredPhotos()
    return photos.find(p => p.id === id) || null
  }

  async cleanupOrphanedFiles(): Promise<void> {
    const photos = await this.getStoredPhotos()
    const indexedFiles = new Set()

    // Collect all indexed files
    photos.forEach(photo => {
      indexedFiles.add(photo.originalPath)
      indexedFiles.add(photo.thumbnailPath)
    })

    // Check photos directory
    await this.cleanupDirectory(PHOTOS_DIR, indexedFiles)
    await this.cleanupDirectory(THUMBNAILS_DIR, indexedFiles)
  }

  private async cleanupDirectory(dir: string, validFiles: Set<string>): Promise<void> {
    try {
      const files = await FileSystem.readDirectoryAsync(dir)

      for (const file of files) {
        const filePath = `${dir}${file}`
        if (!validFiles.has(filePath)) {
          await FileSystem.deleteAsync(filePath, { idempotent: true })
          console.log('Cleaned up orphaned file:', filePath)
        }
      }
    } catch (error) {
      console.error(`Failed to cleanup directory ${dir}:`, error)
    }
  }
}
```

## Cache Management

### Image Cache Service
```typescript
export class ImageCacheService {
  private static instance: ImageCacheService
  private cacheSizeLimit = 50 * 1024 * 1024 // 50MB

  static getInstance(): ImageCacheService {
    if (!ImageCacheService.instance) {
      ImageCacheService.instance = new ImageCacheService()
    }
    return ImageCacheService.instance
  }

  async cacheImage(uri: string, key: string): Promise<string> {
    const cachePath = `${CACHE_DIR}${key}`

    // Check if already cached
    const cacheInfo = await FileSystem.getInfoAsync(cachePath)
    if (cacheInfo.exists) {
      return cachePath
    }

    // Copy to cache
    await FileSystem.copyAsync({
      from: uri,
      to: cachePath
    })

    // Manage cache size
    await this.enforceCacheSizeLimit()

    return cachePath
  }

  async getCachedImage(key: string): Promise<string | null> {
    const cachePath = `${CACHE_DIR}${key}`
    const info = await FileSystem.getInfoAsync(cachePath)

    if (info.exists) {
      return cachePath
    }

    return null
  }

  private async enforceCacheSizeLimit(): Promise<void> {
    try {
      const files = await FileSystem.readDirectoryAsync(CACHE_DIR)
      let totalSize = 0
      const fileInfos: Array<{ path: string, size: number, mtime: number }> = []

      for (const file of files) {
        const filePath = `${CACHE_DIR}${file}`
        const info = await FileSystem.getInfoAsync(filePath)

        if (info.exists) {
          totalSize += info.size
          fileInfos.push({
            path: filePath,
            size: info.size,
            mtime: info.modificationTime,
          })
        }
      }

      // If over limit, delete oldest files
      if (totalSize > this.cacheSizeLimit) {
        fileInfos.sort((a, b) => a.mtime - b.mtime) // Oldest first

        let sizeToFree = totalSize - this.cacheSizeLimit
        for (const file of fileInfos) {
          if (sizeToFree <= 0) break

          await FileSystem.deleteAsync(file.path)
          sizeToFree -= file.size
        }
      }
    } catch (error) {
      console.error('Cache size enforcement failed:', error)
    }
  }

  async clearCache(): Promise<void> {
    try {
      const files = await FileSystem.readDirectoryAsync(CACHE_DIR)
      for (const file of files) {
        await FileSystem.deleteAsync(`${CACHE_DIR}${file}`)
      }
    } catch (error) {
      console.error('Cache clear failed:', error)
    }
  }
}
```

## Backup and Export

### Export Photos
```typescript
export async function exportPhotos(photos: StoredPhoto[]): Promise<string> {
  const exportDir = `${FileSystem.documentDirectory}exports/`
  await FileSystem.makeDirectoryAsync(exportDir, { intermediates: true })

  const timestamp = new Date().toISOString().split('T')[0]
  const exportPath = `${exportDir}purrsuit_photos_${timestamp}.zip`

  // In a real implementation, you'd use a zip library
  // For now, just copy files
  for (const photo of photos) {
    const filename = `photo_${photo.id}.jpg`
    await FileSystem.copyAsync({
      from: photo.originalPath,
      to: `${exportDir}${filename}`
    })
  }

  return exportPath
}
```

### Backup Metadata
```typescript
export async function createBackup(): Promise<string> {
  const storage = PhotoStorageService.getInstance()
  const photos = await storage.getStoredPhotos()

  const backup = {
    version: '1.0',
    timestamp: Date.now(),
    photos: photos.map(p => ({
      ...p,
      // Convert file paths to relative for backup portability
      originalPath: p.originalPath.replace(FileSystem.documentDirectory, ''),
      thumbnailPath: p.thumbnailPath.replace(FileSystem.documentDirectory, ''),
    }))
  }

  const backupPath = `${FileSystem.documentDirectory}backup_${Date.now()}.json`
  await FileSystem.writeAsStringAsync(backupPath, JSON.stringify(backup, null, 2))

  return backupPath
}
```

## Storage Monitoring

### Storage Stats
```typescript
export interface StorageStats {
  totalPhotos: number
  totalSize: number
  photosSize: number
  thumbnailsSize: number
  cacheSize: number
  availableSpace: number
}

export async function getStorageStats(): Promise<StorageStats> {
  const storage = PhotoStorageService.getInstance()
  const photos = await storage.getStoredPhotos()

  let photosSize = 0
  let thumbnailsSize = 0

  for (const photo of photos) {
    photosSize += photo.metadata.size
    const thumbInfo = await FileSystem.getInfoAsync(photo.thumbnailPath)
    thumbnailsSize += thumbInfo.size || 0
  }

  const cacheSize = await getDirectorySize(CACHE_DIR)
  const freeSpace = await FileSystem.getFreeDiskStorageAsync()

  return {
    totalPhotos: photos.length,
    totalSize: photosSize + thumbnailsSize + cacheSize,
    photosSize,
    thumbnailsSize,
    cacheSize,
    availableSpace: freeSpace,
  }
}

async function getDirectorySize(dir: string): Promise<number> {
  try {
    const files = await FileSystem.readDirectoryAsync(dir)
    let totalSize = 0

    for (const file of files) {
      const info = await FileSystem.getInfoAsync(`${dir}${file}`)
      totalSize += info.size || 0
    }

    return totalSize
  } catch (error) {
    return 0
  }
}
```

## Migration and Cleanup

### Migrate Old Storage Format
```typescript
export async function migrateStorage(): Promise<void> {
  // Check for old storage format
  const oldData = await MMKV.getString('old_photos_key')

  if (oldData) {
    try {
      const oldPhotos = JSON.parse(oldData)
      const storage = PhotoStorageService.getInstance()

      for (const oldPhoto of oldPhotos) {
        // Migrate to new format
        await storage.storePhoto(
          oldPhoto.uri,
          oldPhoto.thumbnailUri,
          oldPhoto.metadata
        )
      }

      // Remove old data
      await MMKV.delete('old_photos_key')
      console.log('Storage migration completed')
    } catch (error) {
      console.error('Storage migration failed:', error)
    }
  }
}
```

### Cleanup Utilities
```typescript
export async function cleanupTempFiles(): Promise<void> {
  try {
    const files = await FileSystem.readDirectoryAsync(TEMP_DIR)

    for (const file of files) {
      const filePath = `${TEMP_DIR}${file}`
      const info = await FileSystem.getInfoAsync(filePath)

      // Delete files older than 24 hours
      if (info.exists && Date.now() - info.modificationTime > 24 * 60 * 60 * 1000) {
        await FileSystem.deleteAsync(filePath)
      }
    }
  } catch (error) {
    console.error('Temp file cleanup failed:', error)
  }
}

export async function optimizeStorage(): Promise<void> {
  // Run cleanup tasks
  await cleanupTempFiles()

  const storage = PhotoStorageService.getInstance()
  await storage.cleanupOrphanedFiles()

  const cache = ImageCacheService.getInstance()
  await cache.enforceCacheSizeLimit()

  console.log('Storage optimization completed')
}
```

## Testing Storage

### Mock FileSystem
```typescript
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://test/',
  makeDirectoryAsync: jest.fn(),
  copyAsync: jest.fn(),
  deleteAsync: jest.fn(),
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: true, size: 1024 })),
  readDirectoryAsync: jest.fn(() => Promise.resolve([])),
  getFreeDiskStorageAsync: jest.fn(() => Promise.resolve(100 * 1024 * 1024)),
}))
```

### Storage Tests
```typescript
describe('PhotoStorageService', () => {
  let storage: PhotoStorageService

  beforeEach(() => {
    storage = PhotoStorageService.getInstance()
    jest.clearAllMocks()
  })

  it('stores photo successfully', async () => {
    const result = await storage.storePhoto(
      'file://original.jpg',
      'file://thumb.jpg',
      { width: 800, height: 600, size: 0, format: 'jpeg' }
    )

    expect(result.id).toBeDefined()
    expect(result.originalPath).toContain('photos/')
    expect(result.thumbnailPath).toContain('thumbnails/')
  })

  it('deletes photo and files', async () => {
    // Store a photo first
    const stored = await storage.storePhoto(
      'file://original.jpg',
      'file://thumb.jpg',
      { width: 800, height: 600, size: 0, format: 'jpeg' }
    )

    // Delete it
    const deleted = await storage.deletePhoto(stored.id)

    expect(deleted).toBe(true)
    expect(FileSystem.deleteAsync).toHaveBeenCalledTimes(2)
  })
})
```

## Best Practices

1. **Initialize file system** on app startup
2. **Use consistent naming** for files and directories
3. **Monitor storage usage** and clean up regularly
4. **Handle storage errors** gracefully with fallbacks
5. **Backup important data** before major operations
6. **Test storage operations** thoroughly
7. **Provide user feedback** for storage-related operations