import React, { useState, useRef } from "react"
import { View, ViewStyle, Image as RNImage, Dimensions, Alert, TouchableOpacity, StyleSheet } from "react-native"
import { Svg, Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg"
import { PanGestureHandler, GestureHandlerRootView, State } from "react-native-gesture-handler"
import ViewShot, { captureRef } from "react-native-view-shot"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { ArrowLeft, Check, RotateCcw, Scissors } from "lucide-react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export const PhotoEditScreen = ({ navigation, route }: AppStackScreenProps<"PhotoEdit">) => {
  const { photoUri } = route.params
  const {
    theme: { colors, spacing },
  } = useAppTheme()

  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
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
      setIsDrawing(true)
      if (isClosed) {
        // Reset if starting new drawing after closing (optional, or require reset button)
        // setPoints([])
        // setIsClosed(false)
      }
    } else if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      setIsDrawing(false)
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
      const uri = await captureRef(captureViewRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      })
      
      // Pass back the new URI
      // We need to navigate back to CaptureScreen with the new URI, 
      // but CaptureScreen expects to be in 'preview' mode.
      // Since we can't easily pass params BACK to a previous screen in the stack without listeners,
      // we might want to navigate to EncounterEdit directly or use a callback.
      // However, the plan was: Capture -> Preview -> Edit -> Save -> Preview (updated).
      // Let's navigate to Capture with params.
      navigation.navigate("MainTabs", {
        screen: "Capture",
        params: { editedPhotoUri: uri },
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
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top", "bottom"]}>
      <View style={$header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$iconButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text preset="heading" text="Cut Out Pet ✂️" style={{ fontSize: 20 }} />
        <View style={{ width: 40 }} />
      </View>

      <View style={$instructions}>
        <Text 
          text={isClosed ? "Looks good! Save or Reset." : "Draw a loop around your pet with your finger."} 
          style={{ textAlign: "center", color: colors.textDim }}
        />
      </View>

      <View 
        style={$canvasContainer} 
        onLayout={(e) => setImageLayout(e.nativeEvent.layout)}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleStateChange}
            enabled={!isClosed}
          >
            <View style={{ flex: 1 }}>
              {/* 
                We use captureRef to capture the result.
                If isClosed, we show the MASKED image.
                If not closed, we show the original image + drawing path.
              */}
              <View ref={captureViewRef} collapsable={false} style={{ flex: 1, backgroundColor: "transparent" }}>
                {isClosed ? (
                  <Svg style={{ flex: 1 }}>
                    <Defs>
                      <ClipPath id="clip">
                        <Path d={getPathData()} />
                      </ClipPath>
                    </Defs>
                    {/* Background transparent */}
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
                    <RNImage 
                      source={{ uri: photoUri }} 
                      style={{ width: "100%", height: "100%" }} 
                      resizeMode="cover" 
                    />
                    <Svg style={[StyleSheet.absoluteFill, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
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

      <View style={$footer}>
        <Button
          text="Reset"
          preset="default"
          onPress={handleReset}
          style={$button}
          LeftAccessory={(props) => <RotateCcw size={20} color={colors.text} style={props.style} />}
        />
        <Button
          text="Save"
          preset="primary"
          onPress={handleSave}
          disabled={!isClosed}
          style={$button}
          LeftAccessory={(props) => <Check size={20} color={colors.palette.neutral100} style={props.style} />}
        />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "#000",
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: "white",
}

const $iconButton: ViewStyle = {
  padding: 8,
}

const $instructions: ViewStyle = {
  padding: 12,
  backgroundColor: "white",
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
}

const $canvasContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#1a1a1a", // Dark background to see the cutout better
  overflow: 'hidden',
}

const $footer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-around",
  padding: 16,
  backgroundColor: "white",
  gap: 16,
}

const $button: ViewStyle = {
  flex: 1,
}
