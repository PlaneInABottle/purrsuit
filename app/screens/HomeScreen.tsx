import React from "react"
import { View, ViewStyle } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"

export const HomeScreen = (_props: MainTabScreenProps<"Home">) => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <View style={$header}>
        <Text preset="heading" text="My Collection" />
      </View>
      <View style={[$content, { backgroundColor: colors.background }]}>
        <Text
          style={{ color: colors.textDim }}
          text="No encounters yet. Tap the camera to start!"
        />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $header: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
}

const $content: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 16,
}
