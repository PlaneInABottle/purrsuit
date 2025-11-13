import React, { useState, useRef } from "react"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  Alert,
} from "react-native"
import { CameraView } from "expo-camera"
import type { CameraType, FlashMode } from "expo-camera"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import {
  requestCameraPermissions,
  hasCameraPermissions,
  pickImageFromLibrary,
  toggleCameraType,
  cycleFlashMode,
  getFlashModeIcon,
} from "@/services/camera"
import { generateUUID } from "@/utils/uuid"

type CaptureStep = "camera" | "preview"

export const CaptureScreen = (_props: MainTabScreenProps<"Capture">) => {
  const {
    theme: { colors },
  } = useAppTheme()

  // Camera state
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [cameraType, setCameraType] = useState<CameraType>("back")
  const [flashMode, setFlashMode] = useState<FlashMode>("off")
  const [captureStep, setCaptureStep] = useState<CaptureStep>("camera")
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)

  const cameraRef = useRef<CameraView>(null)

  // Request permissions on mount
  React.useEffect(() => {
    checkPermissions()
  }, [])

  async function checkPermissions() {
    const granted = await hasCameraPermissions()
    if (!granted) {
      const result = await requestCameraPermissions()
      setHasPermission(result.granted)
    } else {
      setHasPermission(true)
    }
  }

  async function handleCapture() {
    if (!cameraRef.current) return

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      })

      if (photo?.uri) {
        setCapturedPhoto(photo.uri)
        setCaptureStep("preview")
      }
    } catch (error) {
      console.error("Failed to capture photo:", error)
      Alert.alert("Error", "Failed to capture photo")
    }
  }

  async function handlePickFromLibrary() {
    try {
      const uri = await pickImageFromLibrary()
      if (uri) {
        setCapturedPhoto(uri)
        setCaptureStep("preview")
      }
    } catch (error) {
      console.error("Failed to pick image:", error)
      Alert.alert("Error", "Failed to pick image from library")
    }
  }

  function handleRetake() {
    setCapturedPhoto(null)
    setCaptureStep("camera")
  }

  function handleConfirm() {
    if (!capturedPhoto) return

    // Generate unique ID for this encounter
    const encounterId = generateUUID()

    // Navigate to edit screen with photo
    _props.navigation.navigate("EncounterEdit", {
      photoUri: capturedPhoto,
      encounterId,
    })

    // Reset capture state
    setCapturedPhoto(null)
    setCaptureStep("camera")
  }

  // Permission states
  if (hasPermission === null) {
    return (
      <Screen preset="fixed" contentContainerStyle={$container}>
        <View style={$centerContent}>
          <Text text="Requesting camera permissions..." />
        </View>
      </Screen>
    )
  }

  if (hasPermission === false) {
    return (
      <Screen preset="fixed" contentContainerStyle={$container}>
        <View style={$centerContent}>
          <Text preset="heading" style={$permissionIcon}>
            📷
          </Text>
          <Text text="Camera access required" preset="subheading" />
          <Text
            text="Please grant camera permissions to capture photos"
            style={{ color: colors.textDim, marginTop: 8, textAlign: "center" }}
          />
          <Button text="Grant Permission" onPress={checkPermissions} style={{ marginTop: 24 }} />
        </View>
      </Screen>
    )
  }

  // Preview mode
  if (captureStep === "preview" && capturedPhoto) {
    return (
      <Screen preset="fixed" contentContainerStyle={$container}>
        <View style={$previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={$previewImage} resizeMode="contain" />
        </View>

        <View style={$previewControls}>
          <Button text="Retake" preset="default" onPress={handleRetake} />
          <Button text="Next" preset="primary" onPress={handleConfirm} />
        </View>
      </Screen>
    )
  }

  // Camera mode
  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={[]}>
      <CameraView ref={cameraRef} style={$camera} facing={cameraType} flash={flashMode}>
        {/* Top controls */}
        <View style={$topControls}>
          <TouchableOpacity
            style={[$controlButton, { backgroundColor: colors.overlay50 }]}
            onPress={() => setFlashMode(cycleFlashMode(flashMode))}
          >
            <Text style={$controlIcon} text={getFlashModeIcon(flashMode)} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[$controlButton, { backgroundColor: colors.overlay50 }]}
            onPress={() => setCameraType(toggleCameraType(cameraType))}
          >
            <Text style={$controlIcon} text="🔄" />
          </TouchableOpacity>
        </View>

        {/* Bottom controls */}
        <View style={$bottomControls}>
          <TouchableOpacity
            style={[$libraryButton, { backgroundColor: colors.overlay50 }]}
            onPress={handlePickFromLibrary}
          >
            <Text style={$controlIcon} text="🖼️" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[$captureButton, { backgroundColor: colors.overlay20 }]}
            onPress={handleCapture}
          >
            <View style={[$captureButtonInner, { borderColor: colors.palette.neutral100 }]} />
          </TouchableOpacity>

          <View style={$libraryButton} />
        </View>
      </CameraView>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $centerContent: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
}

const $permissionIcon: TextStyle = {
  fontSize: 64,
  marginBottom: 16,
}

const $camera: ViewStyle = {
  flex: 1,
}

const $topControls: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 24,
  paddingTop: 60,
}

const $bottomControls: ViewStyle = {
  position: "absolute",
  bottom: 40,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  paddingHorizontal: 24,
}

const $controlButton: ViewStyle = {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: "center",
  alignItems: "center",
}

const $controlIcon: TextStyle = {
  fontSize: 28,
}

const $captureButton: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
  justifyContent: "center",
  alignItems: "center",
}

const $captureButtonInner: ViewStyle = {
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: "white",
  borderWidth: 3,
}

const $libraryButton: ViewStyle = {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: "center",
  alignItems: "center",
}

const $previewContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "black",
}

const $previewImage: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $previewControls: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-around",
  padding: 24,
  gap: 16,
}
