# Camera Patterns in Purrsuit

This document reflects the actual implementation patterns in the Purrsuit Mobile App.

## Camera Service (`app/services/camera.ts`)

Uses `expo-camera` and `expo-image-picker`.

```typescript
export async function requestCameraPermissions(): Promise<CameraPermissionStatus> {
  const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync()
  return { granted: status === "granted", canAskAgain }
}

export function toggleCameraType(current: CameraType): CameraType {
  return current === "back" ? "front" : "back"
}

export function cycleFlashMode(current: FlashMode): FlashMode {
  const modes: FlashMode[] = ["off", "on", "auto"]
  const nextIndex = (modes.indexOf(current) + 1) % modes.length
  return modes[nextIndex]
}
```

## Camera Component (`app/screens/CaptureScreen.tsx`)

Uses `CameraView` and Lucide icons.

```typescript
import { CameraView } from "expo-camera"
import { RefreshCw, Zap, ZapOff, CircleSlash, PawPrint } from "lucide-react-native"

export const CaptureScreen = () => {
  const cameraRef = useRef<CameraView>(null)
  
  const handleCapture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 1 })
    if (photo?.uri) setCapturedPhoto(photo.uri)
  }

  return (
    <CameraView ref={cameraRef} style={styles.camera} facing={cameraType} flash={flashMode}>
      {/* UI with Lucide icons */}
    </CameraView>
  )
}
```

## Sticker Creation (`app/screens/PhotoEditScreen.tsx`)

Advanced editing using SVG masks and `captureRef`.

```typescript
const handleSave = async () => {
  // Capture view with sticker drawing
  const uri = await captureRef(captureViewRef, { format: "png", quality: 1 })
  
  // Crop to bounding box
  const result = await manipulateAsync(
    uri,
    [{ crop: { originX, originY, width, height } }],
    { format: SaveFormat.PNG }
  )
  
  navigation.navigate("Capture", { editedPhotoUri: result.uri })
}
```
