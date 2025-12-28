# Photo Processing Workflows

This document covers image manipulation and processing patterns for Expo React Native apps.

## Image Manipulation Basics

### Setup and Imports
```typescript
import * as ImageManipulator from 'expo-image-manipulator'
import * as FileSystem from 'expo-file-system'
```

### Basic Image Processing
```typescript
export interface ProcessedImage {
  uri: string
  width: number
  height: number
  base64?: string
}

// Resize image
export async function resizeImage(
  uri: string,
  width: number,
  height?: number
): Promise<ProcessedImage> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width, height } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  )

  return result
}

// Crop image
export async function cropImage(
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<ProcessedImage> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ crop: { originX: x, originY: y, width, height } }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  )

  return result
}
```

## Advanced Processing Pipeline

### Photo Processing Service
```typescript
// app/services/photoProcessing.ts
export interface PhotoProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: ImageManipulator.SaveFormat
  createThumbnail?: boolean
  thumbnailSize?: number
}

export interface ProcessedPhotoResult {
  original: ProcessedImage
  thumbnail?: ProcessedImage
}

export class PhotoProcessingService {
  static async processPhoto(
    uri: string,
    options: PhotoProcessingOptions = {}
  ): Promise<ProcessedPhotoResult> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
      format = ImageManipulator.SaveFormat.JPEG,
      createThumbnail = true,
      thumbnailSize = 200,
    } = options

    // Get original image info
    const originalInfo = await FileSystem.getInfoAsync(uri)
    if (!originalInfo.exists) {
      throw new Error('Original image does not exist')
    }

    // Resize original if needed
    let processedUri = uri
    if (originalInfo.size > 2 * 1024 * 1024) { // > 2MB
      const resized = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: maxWidth, height: maxHeight } }],
        { compress: quality, format }
      )
      processedUri = resized.uri
    }

    const result: ProcessedPhotoResult = {
      original: await FileSystem.getInfoAsync(processedUri) as ProcessedImage,
    }

    // Create thumbnail if requested
    if (createThumbnail) {
      const thumbnail = await ImageManipulator.manipulateAsync(
        processedUri,
        [{ resize: { width: thumbnailSize, height: thumbnailSize } }],
        { compress: 0.7, format }
      )
      result.thumbnail = thumbnail
    }

    return result
  }
}
```

## Editing Operations

### Rotation and Flipping
```typescript
export async function rotateImage(uri: string, degrees: number): Promise<ProcessedImage> {
  return await ImageManipulator.manipulateAsync(
    uri,
    [{ rotate: degrees }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  )
}

export async function flipImage(
  uri: string,
  flipType: ImageManipulator.FlipType
): Promise<ProcessedImage> {
  return await ImageManipulator.manipulateAsync(
    uri,
    [{ flip: flipType }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  )
}
```

### Multiple Operations Chain
```typescript
export async function applyMultipleEdits(uri: string): Promise<ProcessedImage> {
  return await ImageManipulator.manipulateAsync(
    uri,
    [
      { rotate: 90 },
      { flip: ImageManipulator.FlipType.Horizontal },
      { resize: { width: 800 } }
    ],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  )
}
```

## Quality and Compression

### Adaptive Compression
```typescript
export function getCompressionQuality(fileSize: number): number {
  if (fileSize > 5 * 1024 * 1024) { // > 5MB
    return 0.6
  } else if (fileSize > 2 * 1024 * 1024) { // > 2MB
    return 0.7
  } else if (fileSize > 1 * 1024 * 1024) { // > 1MB
    return 0.8
  } else {
    return 0.9 // High quality for smaller files
  }
}

export async function compressImage(uri: string): Promise<ProcessedImage> {
  const fileInfo = await FileSystem.getInfoAsync(uri)
  const quality = getCompressionQuality(fileInfo.size)

  return await ImageManipulator.manipulateAsync(
    uri,
    [],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
  )
}
```

## Format Conversion

### Convert to Different Formats
```typescript
export async function convertToPNG(uri: string): Promise<ProcessedImage> {
  return await ImageManipulator.manipulateAsync(
    uri,
    [],
    { compress: 0.9, format: ImageManipulator.SaveFormat.PNG }
  )
}

export async function convertToJPEG(uri: string, quality = 0.8): Promise<ProcessedImage> {
  return await ImageManipulator.manipulateAsync(
    uri,
    [],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
  )
}
```

## Batch Processing

### Process Multiple Images
```typescript
export async function processBatch(
  uris: string[],
  options: PhotoProcessingOptions = {}
): Promise<ProcessedPhotoResult[]> {
  const results: ProcessedPhotoResult[] = []

  for (const uri of uris) {
    try {
      const result = await PhotoProcessingService.processPhoto(uri, options)
      results.push(result)
    } catch (error) {
      console.error(`Failed to process ${uri}:`, error)
      // Continue with other images
    }
  }

  return results
}
```

## Metadata Handling

### Extract EXIF Data
```typescript
export interface ImageMetadata {
  width: number
  height: number
  orientation?: number
  datetime?: string
  make?: string
  model?: string
  gpsLatitude?: number
  gpsLongitude?: number
}

export async function extractMetadata(uri: string): Promise<ImageMetadata | null> {
  try {
    const info = await FileSystem.getInfoAsync(uri, { size: false })
    // In a real implementation, you'd use a library to extract EXIF
    // For now, return basic file info
    return {
      width: 0, // Would be extracted from EXIF
      height: 0, // Would be extracted from EXIF
      // ... other metadata
    }
  } catch (error) {
    console.error('Failed to extract metadata:', error)
    return null
  }
}
```

## Error Handling and Validation

### Image Validation
```typescript
export async function validateImage(uri: string): Promise<boolean> {
  try {
    const info = await FileSystem.getInfoAsync(uri)

    if (!info.exists) {
      console.error('Image file does not exist')
      return false
    }

    // Check file size (max 10MB)
    if (info.size > 10 * 1024 * 1024) {
      console.error('Image file too large')
      return false
    }

    // Check file extension
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const extension = uri.toLowerCase().substring(uri.lastIndexOf('.'))
    if (!validExtensions.includes(extension)) {
      console.error('Invalid image format')
      return false
    }

    return true
  } catch (error) {
    console.error('Image validation failed:', error)
    return false
  }
}
```

### Processing Error Handling
```typescript
export async function safeProcessImage(
  uri: string,
  operation: (uri: string) => Promise<ProcessedImage>
): Promise<ProcessedImage | null> {
  try {
    // Validate first
    const isValid = await validateImage(uri)
    if (!isValid) {
      return null
    }

    // Attempt operation
    const result = await operation(uri)
    return result
  } catch (error) {
    console.error('Image processing failed:', error)

    // Try fallback: just compress without other operations
    try {
      return await compressImage(uri)
    } catch (fallbackError) {
      console.error('Fallback processing also failed:', fallbackError)
      return null
    }
  }
}
```

## Memory Management

### Cleanup Temporary Files
```typescript
export async function cleanupTempFiles(): Promise<void> {
  try {
    const tempDir = `${FileSystem.documentDirectory}temp/`
    const files = await FileSystem.readDirectoryAsync(tempDir)

    for (const file of files) {
      const filePath = `${tempDir}${file}`
      const fileInfo = await FileSystem.getInfoAsync(filePath)

      // Delete files older than 1 hour
      if (fileInfo.exists && Date.now() - fileInfo.modificationTime > 60 * 60 * 1000) {
        await FileSystem.deleteAsync(filePath)
      }
    }
  } catch (error) {
    console.error('Cleanup failed:', error)
  }
}
```

### Memory-Efficient Processing
```typescript
export async function processLargeImage(uri: string): Promise<ProcessedImage> {
  // For very large images, process in steps to avoid memory issues
  const fileInfo = await FileSystem.getInfoAsync(uri)

  if (fileInfo.size > 10 * 1024 * 1024) { // > 10MB
    // First, create a smaller version
    const tempResize = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    )

    // Then apply other operations to the smaller version
    const final = await ImageManipulator.manipulateAsync(
      tempResize.uri,
      [{ rotate: 90 }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    )

    // Clean up temp file
    await FileSystem.deleteAsync(tempResize.uri)

    return final
  } else {
    // Normal processing for smaller files
    return await ImageManipulator.manipulateAsync(
      uri,
      [{ rotate: 90 }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    )
  }
}
```

## Testing Image Processing

### Mock ImageManipulator
```typescript
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn((uri, actions, options) => {
    return Promise.resolve({
      uri: uri.replace('original', 'processed'),
      width: 800,
      height: 600,
      base64: 'mockBase64Data',
    })
  }),
  SaveFormat: {
    JPEG: 'jpeg',
    PNG: 'png',
  },
  FlipType: {
    Horizontal: 'horizontal',
    Vertical: 'vertical',
  },
}))
```

### Processing Tests
```typescript
describe('PhotoProcessingService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('processes photo with default options', async () => {
    const mockUri = 'file://test/photo.jpg'

    const result = await PhotoProcessingService.processPhoto(mockUri)

    expect(result.original.uri).toContain('processed')
    expect(result.thumbnail).toBeDefined()
  })

  it('resizes large images', async () => {
    // Mock large file
    const mockUri = 'file://test/large.jpg'
    FileSystem.getInfoAsync.mockResolvedValue({ size: 5 * 1024 * 1024 }) // 5MB

    await PhotoProcessingService.processPhoto(mockUri)

    expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
      mockUri,
      [{ resize: { width: 1200, height: 1200 } }],
      expect.any(Object)
    )
  })
})
```

## Best Practices

1. **Validate images** before processing
2. **Handle memory constraints** for large images
3. **Clean up temporary files** regularly
4. **Use appropriate compression** based on use case
5. **Test with real devices** for performance
6. **Provide fallbacks** for processing failures