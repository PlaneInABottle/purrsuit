import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Switch } from "@/components/Toggle/Switch"
import { useAppTheme } from "@/theme/context"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"

export const ProfileScreen = observer(function ProfileScreen(
  _props: MainTabScreenProps<"Profile">,
) {
  const {
    theme: { colors },
    themeContext,
    setThemeContextOverride,
  } = useAppTheme()

  const isDarkMode = themeContext === "dark"

  const handleThemeToggle = (value: boolean) => {
    setThemeContextOverride(value ? "dark" : "light")
  }

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={$header}>
        <Text preset="heading" text="Settings" />
        <Text style={{ color: colors.textDim, marginTop: 4 }} text="Customize your experience" />
      </View>

      {/* Appearance Section */}
      <View style={[$section, { backgroundColor: colors.palette.neutral100 }]}>
        <View style={$sectionHeader}>
          <Text style={[$sectionTitle, { color: colors.textDim }]} text="🌙 Appearance" />
        </View>

        {/* Dark Mode Toggle Row */}
        <View style={$settingRow}>
          <View style={$settingInfo}>
            <Text style={[$settingLabel, { color: colors.text }]} text="Dark Mode" />
            <Text
              style={[$settingHelper, { color: colors.textDim }]}
              text="Use dark theme for better night viewing"
            />
          </View>
          <Switch value={isDarkMode} onValueChange={handleThemeToggle} />
        </View>
      </View>

      {/* Future sections can be added here */}
      {/* Example:
      <View style={[$section, { backgroundColor: colors.palette.neutral100 }]}>
        <View style={$sectionHeader}>
          <Text style={[$sectionTitle, { color: colors.textDim }]} text="🔔 Notifications" />
        </View>
        ... more settings rows ...
      </View>
      */}
    </Screen>
  )
})

const $container: ViewStyle = {
  flex: 1,
  paddingBottom: 100, // Space for tab bar
}

const $header: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
}

const $section: ViewStyle = {
  marginHorizontal: 16,
  marginBottom: 16,
  borderRadius: 12,
  overflow: "hidden",
  // Shadow for iOS
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  // Elevation for Android
  elevation: 2,
}

const $sectionHeader: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 8,
}

const $sectionTitle: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: 0.5,
}

const $settingRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingVertical: 12,
  minHeight: 56,
}

const $settingInfo: ViewStyle = {
  flex: 1,
  marginRight: 16,
}

const $settingLabel: TextStyle = {
  fontSize: 16,
  fontWeight: "500",
}

const $settingHelper: TextStyle = {
  fontSize: 14,
  marginTop: 2,
}
