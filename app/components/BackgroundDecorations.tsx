import React, { useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import Svg, { Circle, Path, Ellipse, Defs, Pattern, Rect, G } from "react-native-svg"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withDelay,
  CancelAnimation,
} from "react-native-reanimated"
import { useAppTheme } from "@/theme/context"

const { width, height } = Dimensions.get("window")

interface DecorationElement {
  id: string
  type: "paw" | "blob" | "leaf" | "star" | "heart" | "fishbone" | "yarn" | "cloud"
  x: number
  y: number
  color: "primary" | "secondary" | "accent" | "neutral"
  scale: number
  rotation: number
  opacity: number
  animation: "float" | "pulse" | "spin" | "none"
}

const AnimatedView = Animated.createAnimatedComponent(View)

export function BackgroundDecorations() {
  const {
    theme: { colors },
  } = useAppTheme()

  // Map color names to actual colors
  const colorMap = {
    primary: colors.palette.primary500,
    secondary: colors.palette.secondary500,
    accent: colors.palette.accent500,
    neutral: colors.palette.neutral300,
  }

  // Generate a rich set of decorations
  const decorations: DecorationElement[] = [
    // Top / Header Area
    { id: "t1", type: "paw", x: width * 0.1, y: height * 0.08, color: "primary", scale: 0.8, rotation: -15, opacity: 0.15, animation: "float" },
    { id: "t2", type: "cloud", x: width * 0.8, y: height * 0.05, color: "secondary", scale: 1.2, rotation: 0, opacity: 0.1, animation: "float" },
    { id: "t3", type: "star", x: width * 0.5, y: height * 0.12, color: "accent", scale: 0.6, rotation: 0, opacity: 0.2, animation: "pulse" },

    // Upper Middle
    { id: "um1", type: "fishbone", x: width * 0.85, y: height * 0.25, color: "neutral", scale: 0.9, rotation: 45, opacity: 0.12, animation: "float" },
    { id: "um2", type: "blob", x: width * 0.05, y: height * 0.3, color: "secondary", scale: 1.5, rotation: 0, opacity: 0.08, animation: "none" },
    { id: "um3", type: "heart", x: width * 0.3, y: height * 0.2, color: "primary", scale: 0.5, rotation: -10, opacity: 0.1, animation: "pulse" },

    // Middle
    { id: "m1", type: "yarn", x: width * 0.75, y: height * 0.5, color: "accent", scale: 1.1, rotation: 0, opacity: 0.15, animation: "spin" },
    { id: "m2", type: "paw", x: width * 0.15, y: height * 0.55, color: "secondary", scale: 0.7, rotation: 20, opacity: 0.12, animation: "float" },
    { id: "m3", type: "leaf", x: width * 0.5, y: height * 0.45, color: "neutral", scale: 0.8, rotation: -30, opacity: 0.1, animation: "float" },

    // Lower Middle
    { id: "lm1", type: "blob", x: width * 0.9, y: height * 0.7, color: "primary", scale: 1.3, rotation: 180, opacity: 0.08, animation: "none" },
    { id: "lm2", type: "star", x: width * 0.2, y: height * 0.75, color: "accent", scale: 0.7, rotation: 15, opacity: 0.15, animation: "pulse" },
    { id: "lm3", type: "fishbone", x: width * 0.6, y: height * 0.65, color: "secondary", scale: 0.8, rotation: -10, opacity: 0.1, animation: "float" },

    // Bottom
    { id: "b1", type: "cloud", x: width * 0.1, y: height * 0.9, color: "neutral", scale: 1.4, rotation: 0, opacity: 0.12, animation: "float" },
    { id: "b2", type: "paw", x: width * 0.8, y: height * 0.85, color: "primary", scale: 0.9, rotation: -25, opacity: 0.14, animation: "float" },
    { id: "b3", type: "heart", x: width * 0.45, y: height * 0.92, color: "secondary", scale: 0.6, rotation: 10, opacity: 0.1, animation: "pulse" },
  ]

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base Layer: Notebook Pattern */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id="grid-dots" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
            <Circle cx="2" cy="2" r="1.5" fill={colors.palette.neutral200} opacity="0.6" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grid-dots)" />
      </Svg>

      {/* Decorations Layer */}
      {decorations.map((item, index) => (
        <FloatingDecoration key={item.id} item={item} color={colorMap[item.color]} index={index} />
      ))}
    </View>
  )
}

const FloatingDecoration = ({
  item,
  color,
  index,
}: {
  item: DecorationElement
  color: string
  index: number
}) => {
  const translateY = useSharedValue(0)
  const rotate = useSharedValue(item.rotation)
  const scale = useSharedValue(item.scale)
  const opacity = useSharedValue(item.opacity)

  useEffect(() => {
    const delay = index * 200 // Stagger animations

    if (item.animation === "float") {
      translateY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-15, { duration: 2000 + index * 100, easing: Easing.inOut(Easing.quad) }),
            withTiming(0, { duration: 2000 + index * 100, easing: Easing.inOut(Easing.quad) }),
          ),
          -1,
          true,
        ),
      )
    } else if (item.animation === "pulse") {
      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(item.scale * 1.2, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
            withTiming(item.scale, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
          ),
          -1,
          true,
        ),
      )
    } else if (item.animation === "spin") {
      rotate.value = withDelay(
        delay,
        withRepeat(
          withTiming(item.rotation + 360, { duration: 8000, easing: Easing.linear }),
          -1,
          false,
        ),
      )
    }
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: item.x },
        { translateY: item.y + translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    }
  })

  return (
    <AnimatedView style={[{ position: "absolute", top: 0, left: 0 }, animatedStyle]}>
      <Svg width={60} height={60} viewBox="0 0 60 60">
        <DecorationShape type={item.type} color={color} />
      </Svg>
    </AnimatedView>
  )
}

const DecorationShape = ({ type, color }: { type: string; color: string }) => {
  switch (type) {
    case "paw":
      return (
        <G>
          <Ellipse cx="30" cy="35" rx="14" ry="12" fill={color} />
          <Circle cx="14" cy="18" r="5" fill={color} />
          <Circle cx="26" cy="10" r="5" fill={color} />
          <Circle cx="38" cy="10" r="5" fill={color} />
          <Circle cx="48" cy="18" r="5" fill={color} />
        </G>
      )
    case "cloud":
      return (
        <Path
          d="M15,35 Q15,25 25,25 Q30,15 40,20 Q50,15 55,25 Q60,30 55,40 Q50,45 40,45 Q30,50 20,45 Q10,45 15,35"
          fill={color}
        />
      )
    case "star":
      return (
        <Path
          d="M30,5 L37,20 L53,22 L41,32 L44,48 L30,40 L16,48 L19,32 L7,22 L23,20 Z"
          fill={color}
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )
    case "heart":
      return (
        <Path
          d="M30,50 C30,50 55,35 55,20 C55,10 45,5 37,10 C33,12 30,15 30,15 C30,15 27,12 23,10 C15,5 5,10 5,20 C5,35 30,50 30,50 Z"
          fill={color}
        />
      )
    case "fishbone":
      return (
        <G>
          <Path d="M10,30 L50,30" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <Path d="M45,30 L55,20 L55,40 Z" fill={color} />
          <Path d="M15,20 L15,40 M25,18 L25,42 M35,20 L35,40" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <Circle cx="8" cy="30" r="4" fill={color} />
        </G>
      )
    case "yarn":
      return (
        <G>
          <Circle cx="30" cy="30" r="18" fill={color} opacity="0.6" />
          <Path d="M20,25 Q30,15 40,25 T40,35 T20,35" stroke={color} strokeWidth="2" fill="none" />
          <Path d="M25,20 Q35,30 25,40" stroke={color} strokeWidth="2" fill="none" />
          <Path d="M35,20 Q25,30 35,40" stroke={color} strokeWidth="2" fill="none" />
          <Path d="M30,30 L50,50" stroke={color} strokeWidth="2" />
        </G>
      )
    case "leaf":
      return (
        <Path
          d="M30,5 Q45,15 50,30 Q45,45 30,55 Q15,45 10,30 Q15,15 30,5 M30,5 L30,55"
          fill={color}
          stroke={color}
          strokeWidth="1"
        />
      )
    case "blob":
    default:
      return (
        <Path
          d="M30,10 Q50,5 55,25 Q60,45 40,50 Q20,55 10,40 Q0,25 15,15 Q20,5 30,10"
          fill={color}
        />
      )
  }
}
