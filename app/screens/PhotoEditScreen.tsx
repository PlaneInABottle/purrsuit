import React, { useState, useRef } from "react"
import {
  View,
  ViewStyle,
  Image as RNImage,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { manipulateAsync, SaveFormat } from "expo-image-manipulator"
import { ArrowLeft, Check, RotateCcw } from "lucide-react-native"
import { PanGestureHandler, GestureHandlerRootView, State } from "react-native-gesture-handler"
import {
  Svg,
  Path,
  Defs,
  ClipPath,
  Image as SvgImage,
  Circle,
  Rect,
  Pattern,
} from "react-native-svg"
import { captureRef } from "react-native-view-shot"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"

export const PhotoEditScreen = ({ navigation, route }: AppStackScreenProps<"PhotoEdit">) => {
  const { photoUri } = route.params
  const {
    theme: { colors },
  } = useAppTheme()

  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [isClosed, setIsClosed] = useState(false)
  const captureViewRef = useRef<View>(null)
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 })

  const handleGestureEvent = (event: any) => {
    if (isClosed) return
    const { x, y } = event.nativeEvent
    setPoints((prev) => [...prev, { x, y }])
  }

  const handleStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      if (isClosed) {
        // Reset if starting new drawing after closing (optional, or require reset button)
        // setPoints([])
        // setIsClosed(false)
      }
    } else if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED
    ) {
      if (points.length > 10) {
        setIsClosed(true)
      } else {
        // Too short, clear
        setPoints([])
      }
    }
  }

  const handleReset = () => {
    setPoints([])
    setIsClosed(false)
  }

  const handleSave = async () => {
    if (!isClosed || !captureViewRef.current) return

    try {
      // 1. Capture the full view
      // We enforce dimensions to match the logical point system of the drawing
      const uri = await captureRef(captureViewRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
        width: imageLayout.width,
        height: imageLayout.height,
      })

      // 2. Calculate bounding box
      const xs = points.map((p) => p.x)
      const ys = points.map((p) => p.y)
      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const minY = Math.min(...ys)
      const maxY = Math.max(...ys)

      // 3. Add padding
      const padding = 20
      const cropX = Math.max(0, minX - padding)
      const cropY = Math.max(0, minY - padding)
      const cropWidth = Math.min(imageLayout.width - cropX, maxX - minX + padding * 2)
      const cropHeight = Math.min(imageLayout.height - cropY, maxY - minY + padding * 2)

      // 4. Crop
      const result = await manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: cropX,
              originY: cropY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        { format: SaveFormat.PNG },
      )

      // Pass back the new URI
      // We need to navigate back to CaptureScreen with the new URI,
      // but CaptureScreen expects to be in 'preview' mode.
      // Since we can't easily pass params BACK to a previous screen in the stack without listeners,
      // we might want to navigate to EncounterEdit directly or use a callback.
      // However, the plan was: Capture -> Preview -> Edit -> Save -> Preview (updated).
      // Let's navigate to Capture with params.
      navigation.navigate("MainTabs", {
        screen: "Capture",
        params: { editedPhotoUri: result.uri },
      } as any) // Type casting as MainTabParamList doesn't explicitly have params for Capture yet
    } catch (error) {
      console.error("Failed to save edited image", error)
      Alert.alert("Error", "Failed to save edited image")
    }
  }

  const getPathData = () => {
    if (points.length === 0) return ""

    const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    return isClosed ? `${d} Z` : d
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$container}
      safeAreaEdges={["top", "bottom"]}
      backgroundColor="white"
    >
      <View style={$headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text preset="heading" text="Cut Out Pet" style={$headerTitle} />
          <Text text="Draw a loop to create a sticker" style={$headerSubtitle} />
        </View>
      </View>

      <View style={$canvasContainer} onLayout={(e) => setImageLayout(e.nativeEvent.layout)}>
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

        <GestureHandlerRootView style={$flex1}>
          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleStateChange}
            enabled={!isClosed}
          >
            <View style={$flex1}>
              {/* 
                We use captureRef to capture the result.
                If isClosed, we show the MASKED image.
                If not closed, we show the original image + drawing path.
              */}
              <View ref={captureViewRef} collapsable={false} style={$captureView}>
                {isClosed ? (
                  <Svg style={$flex1}>
                    <Defs>
                      <ClipPath id="clip">
                        <Path d={getPathData()} />
                      </ClipPath>
                    </Defs>

                    {/* Sticker Border Effect */}
                    <Path
                      d={getPathData()}
                      stroke="white"
                      strokeWidth={12}
                      fill="white"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />

                    {/* Masked Image */}
                    <SvgImage
                      href={photoUri}
                      width="100%"
                      height="100%"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#clip)"
                    />
                  </Svg>
                ) : (
                  <>
                    <RNImage source={{ uri: photoUri }} style={$fullSize} resizeMode="cover" />
                    <Svg style={[StyleSheet.absoluteFill, $absoluteFill]}>
                      <Path
                        d={getPathData()}
                        stroke={colors.palette.primary500}
                        strokeWidth={3}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </>
                )}
              </View>
            </View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </View>

      <View style={$floatingControls}>
        <TouchableOpacity
          onPress={handleReset}
          style={[$iconButton, { backgroundColor: colors.palette.neutral100 }]}
        >
          <RotateCcw size={24} color={colors.text} />
          <Text text="Reset" style={$iconButtonLabel} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          disabled={!isClosed}
          style={[
            $primaryButton,
            {
              backgroundColor: isClosed ? colors.palette.primary500 : colors.palette.neutral300,
              opacity: isClosed ? 1 : 0.7,
            },
          ]}
        >
          <Text text="Save Sticker" style={$primaryButtonText} />
          <Check size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}

const $headerContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 10,
  gap: 16,
  zIndex: 10,
  backgroundColor: "white",
}

const $backButton: ViewStyle = {
  padding: 8,
  marginLeft: -8,
}

const $headerTitle: TextStyle = {
  fontSize: 24,
  marginBottom: 2,
}

const $headerSubtitle: TextStyle = {
  fontSize: 14,
  opacity: 0.6,
}

const $canvasContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#F8F9FA",
  overflow: "hidden",
  marginHorizontal: 16,
  marginBottom: 140, // Increased to avoid occlusion by floating controls
  marginTop: 10,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.05)",
}

const $floatingControls: ViewStyle = {
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

const $flex1: ViewStyle = {
  flex: 1,
}

const $captureView: ViewStyle = {
  flex: 1,
  backgroundColor: "transparent",
}

const $fullSize: ViewStyle = {
  width: "100%",
  height: "100%",
}

const $absoluteFill: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}
