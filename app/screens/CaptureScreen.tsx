import React, { useState, useRef } from "react"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Image,
  ImageStyle,
  Alert,
  StyleSheet,
} from "react-native"
import { CameraView } from "expo-camera"
import type { CameraType, FlashMode } from "expo-camera"
import { Svg, Defs, Pattern, Circle, Rect } from "react-native-svg"
import { RefreshCw, Image as ImageIcon, Camera, Zap, ZapOff, CircleSlash, PawPrint, RotateCcw, ArrowRight, Scissors } from "lucide-react-native"
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
  getFlashModeType,
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

  // Handle returned edited photo
  React.useEffect(() => {
    if (_props.route.params?.editedPhotoUri) {
      setCapturedPhoto(_props.route.params.editedPhotoUri)
      setCaptureStep("preview")
    }
  }, [_props.route.params?.editedPhotoUri])

  // Helper function to render flash mode icon
  const renderFlashIcon = () => {
    const flashType = getFlashModeType(flashMode)
    const iconSize = 28
    const color = colors.palette.neutral100

    switch (flashType) {
      case "on":
        return <Zap size={iconSize} color={color} strokeWidth={2} fill={color} />
      case "auto":
        return <ZapOff size={iconSize} color={color} strokeWidth={2} />
      case "off":
      default:
        return <CircleSlash size={iconSize} color={color} strokeWidth={2} />
    }
  }

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

  function handleEdit() {
    if (!capturedPhoto) return
    _props.navigation.navigate("PhotoEdit", { photoUri: capturedPhoto })
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
          <Camera size={64} color={colors.textDim} strokeWidth={1.5} style={{ marginBottom: 16 }} />
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
        <View style={$headerContainer}>
          <View>
            <Text preset="heading" text="Review Capture" style={$headerTitle} />
            <Text text="Perfect! Or want to try again?" style={$headerSubtitle} />
          </View>
        </View>

        <View style={$previewContainer}>
          {/* Notebook Background Pattern */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <Pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <Circle cx="2" cy="2" r="1.5" fill="#A0C4FF" />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="#F8F9FA" />
            <Rect width="100%" height="100%" fill="url(#dots)" />
          </Svg>
          <Image source={{ uri: capturedPhoto }} style={$previewImage} resizeMode="cover" />
        </View>

        <View style={$previewControls}>
          <TouchableOpacity
            onPress={handleRetake}
            style={[$iconButton, { backgroundColor: colors.palette.neutral100 }]}
          >
            <RotateCcw size={24} color={colors.text} />
            <Text text="Retake" style={$iconButtonLabel} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEdit}
            style={[$iconButton, { backgroundColor: colors.palette.neutral100 }]}
          >
            <Scissors size={24} color={colors.text} />
            <Text text="Edit" style={$iconButtonLabel} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirm}
            style={[$primaryButton, { backgroundColor: colors.palette.primary500 }]}
          >
            <Text text="Next" style={$primaryButtonText} />
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
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
            {renderFlashIcon()}
          </TouchableOpacity>

          <TouchableOpacity
            style={[$controlButton, { backgroundColor: colors.overlay50 }]}
            onPress={() => setCameraType(toggleCameraType(cameraType))}
          >
            <RefreshCw size={28} color={colors.palette.neutral100} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Bottom controls */}
        <View style={$bottomControls}>
          <TouchableOpacity
            style={[$libraryButton, { backgroundColor: colors.overlay50 }]}
            onPress={handlePickFromLibrary}
          >
            <ImageIcon size={28} color={colors.palette.neutral100} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[$captureButton, { backgroundColor: colors.overlay20 }]}
            onPress={handleCapture}
          >
            <View style={[$captureButtonInner, { borderColor: colors.palette.neutral100 }]} />
            <PawPrint
              size={36}
              color={colors.palette.primary500}
              strokeWidth={2}
              style={{ position: "absolute" }}
            />
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

const $headerContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 10,
  gap: 16,
  backgroundColor: "white",
}

const $headerTitle: TextStyle = {
  fontSize: 24,
  marginBottom: 2,
}

const $headerSubtitle: TextStyle = {
  fontSize: 14,
  opacity: 0.6,
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
  backgroundColor: "#F8F9FA",
  marginHorizontal: 16,
  marginBottom: 140, // Increased to avoid occlusion by floating controls
  marginTop: 10,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.05)",
  overflow: "hidden",
}

const $previewImage: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $previewControls: ViewStyle = {
  position: "absolute",
  bottom: 40,
  left: 20,
  right: 20,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 12,
  backgroundColor: "white",
  borderRadius: 24,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
  gap: 12,
}

const $iconButton: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  width: 60,
  height: 60,
  borderRadius: 30,
  gap: 4,
}

const $iconButtonLabel: TextStyle = {
  fontSize: 10,
  fontWeight: "600",
}

const $primaryButton: ViewStyle = {
  flex: 1,
  height: 60,
  borderRadius: 30,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginLeft: 8,
}

const $primaryButtonText: TextStyle = {
  color: "white",
  fontSize: 16,
  fontWeight: "700",
}
