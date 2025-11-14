import React from "react"
import { View, StyleSheet } from "react-native"
import Svg, { Circle, Path, Ellipse, Defs, LinearGradient, Stop } from "react-native-svg"
import { useAppTheme } from "@/theme/context"

interface DecorationElement {
  type: "paw" | "blob" | "leaf" | "crescent" | "wave" | "branch" | "ball" | "whisker"
  x: number
  y: number
  color: "primary" | "secondary" | "accent"
  opacity: number
}

export function BackgroundDecorations() {
  const {
    theme: { colors },
  } = useAppTheme()

  // Map color names to actual colors
  const colorMap = {
    primary: colors.palette.primary500,   // Coral #FF8A80
    secondary: colors.palette.secondary500, // Lavender #9575CD
    accent: colors.palette.accent500,      // Yellow #FFD54F
  }

  // Decorations distributed across screen zones
  const decorations: DecorationElement[] = [
    // Top zone
    { type: "paw", x: 50, y: 100, color: "primary", opacity: 0.16 },
    { type: "leaf", x: 300, y: 80, color: "secondary", opacity: 0.14 },
    { type: "ball", x: 280, y: 150, color: "accent", opacity: 0.15 },

    // Upper middle zone
    { type: "blob", x: 30, y: 280, color: "secondary", opacity: 0.13 },
    { type: "whisker", x: 320, y: 320, color: "primary", opacity: 0.12 },
    { type: "crescent", x: 50, y: 380, color: "accent", opacity: 0.14 },

    // Middle zone
    { type: "branch", x: 300, y: 450, color: "secondary", opacity: 0.13 },
    { type: "wave", x: 100, y: 500, color: "primary", opacity: 0.15 },
    { type: "leaf", x: 40, y: 550, color: "accent", opacity: 0.12 },

    // Lower middle zone
    { type: "blob", x: 280, y: 650, color: "primary", opacity: 0.13 },
    { type: "paw", x: 60, y: 700, color: "secondary", opacity: 0.16 },
    { type: "ball", x: 320, y: 750, color: "accent", opacity: 0.13 },

    // Bottom zone
    { type: "crescent", x: 150, y: 850, color: "primary", opacity: 0.12 },
    { type: "whisker", x: 280, y: 900, color: "secondary", opacity: 0.13 },
  ]

  const renderPaw = (decoration: DecorationElement, index: number, color: string) => {
    return [
      // Main pad
      <Ellipse
        key={`paw-${index}-main`}
        cx={decoration.x}
        cy={decoration.y}
        rx="8"
        ry="10"
        fill={color}
        opacity={decoration.opacity}
      />,
      // Top left toe
      <Circle
        key={`paw-${index}-tl`}
        cx={decoration.x - 12}
        cy={decoration.y - 14}
        r="4"
        fill={color}
        opacity={decoration.opacity}
      />,
      // Top right toe
      <Circle
        key={`paw-${index}-tr`}
        cx={decoration.x + 12}
        cy={decoration.y - 14}
        r="4"
        fill={color}
        opacity={decoration.opacity}
      />,
      // Bottom left toe
      <Circle
        key={`paw-${index}-bl`}
        cx={decoration.x - 8}
        cy={decoration.y + 8}
        r="4"
        fill={color}
        opacity={decoration.opacity}
      />,
      // Bottom right toe
      <Circle
        key={`paw-${index}-br`}
        cx={decoration.x + 8}
        cy={decoration.y + 8}
        r="4"
        fill={color}
        opacity={decoration.opacity}
      />,
    ]
  }

  const renderBranch = (decoration: DecorationElement, index: number, color: string) => {
    return [
      // Main branch
      <Path
        key={`branch-${index}-main`}
        d={`M${decoration.x},${decoration.y} L${decoration.x + 35},${decoration.y - 20}`}
        stroke={color}
        strokeWidth="2"
        opacity={decoration.opacity}
        fill="none"
      />,
      // Right twig
      <Path
        key={`branch-${index}-r`}
        d={`M${decoration.x + 35},${decoration.y - 20} L${decoration.x + 50},${decoration.y - 30}`}
        stroke={color}
        strokeWidth="1.5"
        opacity={decoration.opacity}
        fill="none"
      />,
      // Left twig
      <Path
        key={`branch-${index}-l`}
        d={`M${decoration.x + 35},${decoration.y - 20} L${decoration.x + 45},${decoration.y - 8}`}
        stroke={color}
        strokeWidth="1.5"
        opacity={decoration.opacity}
        fill="none"
      />,
    ]
  }

  const renderBall = (decoration: DecorationElement, index: number, color: string) => {
    return [
      // Large ball
      <Circle
        key={`ball-${index}-lg`}
        cx={decoration.x}
        cy={decoration.y}
        r="12"
        fill={color}
        opacity={decoration.opacity}
      />,
      // Medium ball
      <Circle
        key={`ball-${index}-md`}
        cx={decoration.x + 8}
        cy={decoration.y + 15}
        r="8"
        fill={color}
        opacity={decoration.opacity * 0.85}
      />,
      // Small ball
      <Circle
        key={`ball-${index}-sm`}
        cx={decoration.x - 5}
        cy={decoration.y + 25}
        r="5"
        fill={color}
        opacity={decoration.opacity * 0.7}
      />,
    ]
  }

  const renderWhisker = (decoration: DecorationElement, index: number, color: string) => {
    return [
      // Top whisker
      <Path
        key={`whisker-${index}-top`}
        d={`M${decoration.x - 25},${decoration.y - 5} Q${decoration.x},${decoration.y - 12} ${decoration.x + 25},${decoration.y - 8}`}
        stroke={color}
        strokeWidth="1.5"
        opacity={decoration.opacity}
        fill="none"
      />,
      // Bottom whisker
      <Path
        key={`whisker-${index}-bot`}
        d={`M${decoration.x - 25},${decoration.y + 5} Q${decoration.x},${decoration.y + 12} ${decoration.x + 25},${decoration.y + 8}`}
        stroke={color}
        strokeWidth="1.5"
        opacity={decoration.opacity}
        fill="none"
      />,
    ]
  }

  const renderDecoration = (decoration: DecorationElement, index: number): React.ReactNode => {
    const color = colorMap[decoration.color]

    switch (decoration.type) {
      case "paw":
        return renderPaw(decoration, index, color)

      case "blob":
        // Organic blob shape
        return (
          <Path
            key={`blob-${index}`}
            d={`M${decoration.x},${decoration.y - 35} Q${decoration.x + 35},${decoration.y - 30} ${decoration.x + 40},${decoration.y} Q${decoration.x + 35},${decoration.y + 40} ${decoration.x},${decoration.y + 45} Q${decoration.x - 35},${decoration.y + 40} ${decoration.x - 40},${decoration.y} Q${decoration.x - 35},${decoration.y - 30} ${decoration.x},${decoration.y - 35}`}
            fill={color}
            opacity={decoration.opacity}
          />
        )

      case "leaf":
        // Teardrop/leaf shape
        return (
          <Path
            key={`leaf-${index}`}
            d={`M${decoration.x},${decoration.y - 25} Q${decoration.x + 20},${decoration.y} ${decoration.x},${decoration.y + 35} Q${decoration.x - 20},${decoration.y} ${decoration.x},${decoration.y - 25}`}
            fill={color}
            opacity={decoration.opacity}
          />
        )

      case "crescent":
        // Crescent moon shape
        return (
          <Path
            key={`crescent-${index}`}
            d={`M${decoration.x},${decoration.y - 30} A35,35 0 0,1 ${decoration.x},${decoration.y + 30} A28,28 0 0,0 ${decoration.x},${decoration.y - 30}`}
            fill={color}
            opacity={decoration.opacity}
          />
        )

      case "wave":
        // Wavy curved line
        return (
          <Path
            key={`wave-${index}`}
            d={`M${decoration.x - 50},${decoration.y} Q${decoration.x - 25},${decoration.y - 15} ${decoration.x},${decoration.y} T${decoration.x + 50},${decoration.y}`}
            stroke={color}
            strokeWidth="2.5"
            opacity={decoration.opacity}
            fill="none"
          />
        )

      case "branch":
        return renderBranch(decoration, index, color)

      case "ball":
        return renderBall(decoration, index, color)

      case "whisker":
        return renderWhisker(decoration, index, color)

      default:
        return null
    }
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg height="100%" width="100%" style={{ position: "absolute" }}>
        <Defs>
          {/* Optional gradient for subtle depth */}
          <LinearGradient id="coral-fade" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colorMap.primary} stopOpacity={String(0.08)} />
            <Stop offset="1" stopColor={colorMap.primary} stopOpacity={String(0.02)} />
          </LinearGradient>
        </Defs>

        {/* Render all decorations */}
        {decorations.map((decoration, index) => renderDecoration(decoration, index))}
      </Svg>
    </View>
  )
}
