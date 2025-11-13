import React from "react"
import { View, ViewStyle } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import { useAppTheme } from "@/theme/context"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"

export const StatsScreen = (_props: MainTabScreenProps<"Stats">) => {
  const {
    theme: { colors, spacing },
  } = useAppTheme()

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <View style={$header}>
        <Text preset="heading" text="Your Progress" />
      </View>

      <View style={$statsGrid}>
        <Card
          style={$statCard}
          ContentComponent={
            <View style={$statContent}>
              <Text preset="subheading" text="0" style={{ color: colors.palette.primary500 }} />
              <Text text="Encounters" style={{ color: colors.textDim }} />
            </View>
          }
        />

        <Card
          style={$statCard}
          ContentComponent={
            <View style={$statContent}>
              <Text preset="subheading" text="0" style={{ color: colors.palette.secondary500 }} />
              <Text text="Day Streak" style={{ color: colors.textDim }} />
            </View>
          }
        />

        <Card
          style={$statCard}
          ContentComponent={
            <View style={$statContent}>
              <Text preset="subheading" text="0/8" style={{ color: colors.palette.accent500 }} />
              <Text text="Badges" style={{ color: colors.textDim }} />
            </View>
          }
        />
      </View>

      <View style={$section}>
        <Text preset="subheading" text="Achievements" style={{ marginBottom: spacing.sm }} />
        <Text text="Complete encounters to unlock badges!" style={{ color: colors.textDim }} />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingBottom: 24,
}

const $header: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
}

const $statsGrid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  paddingHorizontal: 8,
  gap: 8,
}

const $statCard: ViewStyle = {
  flex: 1,
  minWidth: "30%",
}

const $statContent: ViewStyle = {
  alignItems: "center",
  padding: 16,
}

const $section: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 24,
}
