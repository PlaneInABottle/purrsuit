import React from "react"
import { View, ViewStyle, Image, ImageStyle, FlatList, TextStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Svg, Defs, Pattern, Circle, Rect } from "react-native-svg"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { BackgroundDecorations } from "@/components/BackgroundDecorations"
import { useAppTheme } from "@/theme/context"
import { useStores } from "@/models"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"

export const HomeScreen = observer(function HomeScreen(_props: MainTabScreenProps<"Home">) {
  const {
    theme: { colors, spacing },
  } = useAppTheme()
  const { encountersStore } = useStores()

  const encounters = encountersStore.encountersArray

  // Helper function to get pet type emoji
  const getPetTypeEmoji = (petType: string): string => {
    const type = petType.toLowerCase()
    switch (type) {
      case "cat":
        return "🐱"
      case "dog":
        return "🐶"
      case "other":
        return "🐾"
      default:
        return "❓"
    }
  }

  // Helper function to get pet type color
  const getPetTypeColor = (petType: string): string => {
    const type = petType.toLowerCase()
    switch (type) {
      case "cat":
        return colors.palette.primary600
      case "dog":
        return colors.palette.secondary600
      case "other":
        return colors.palette.accent600
      default:
        return colors.palette.neutral600
    }
  }

  // Empty state
  if (encounters.length === 0) {
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        {/* Background Decorations */}
        <BackgroundDecorations />

        {/* Header */}
        <View style={$header}>
          <View style={$headerTop}>
            <Text preset="heading" text="🏠 My Collection" />
          </View>
        </View>

        {/* Enhanced Empty State */}
        <View style={$emptyStateContainer}>
          <Text style={$emptyIcon} text="📷🐾" />
          <Text preset="subheading" text="No encounters yet" style={{ marginTop: spacing.md, marginBottom: spacing.xs }} />
          <Text
            style={[$emptyDescription, { color: colors.textDim }]}
            text="Tap the camera to start your pet collection journey!"
          />

          {/* Suggestions Card */}
          <View style={[$suggestionCard, { backgroundColor: colors.palette.primary100 }]}>
            <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: spacing.sm }} text="💡 Try capturing:" />
            <Text style={[$suggestionItem, { color: colors.textDim }]} text="• Your neighbor's cat or dog" />
            <Text style={[$suggestionItem, { color: colors.textDim }]} text="• Pets at the park" />
            <Text style={[$suggestionItem, { color: colors.textDim }]} text="• Wildlife you encounter" />
          </View>
        </View>
      </Screen>
    )
  }

  // Grid view with encounters
  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      {/* Background Decorations */}
      <BackgroundDecorations />

      {/* Header Section with Gradient */}
      <View style={$headerContainer}>
        <Text preset="heading" text="My Collection" style={$headerTitle} />
        <Text text="Your captured moments" style={$headerSubtitle} />
      </View>

      {/* Grid List */}
      <FlatList
        data={encounters}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={$gridContent}
        scrollEnabled={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        renderItem={({ item }) => (
          <View style={$gridItem}>
            {/* Card Container with enhanced styling */}
            <View style={[$cardContainer, { backgroundColor: "#F8F9FA" }]}>
              {/* Notebook Background Pattern */}
              <View style={StyleSheet.absoluteFill}>
                <Svg width="100%" height="100%">
                  <Defs>
                    <Pattern id="dots" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                      <Circle cx="1.5" cy="1.5" r="1" fill="#A0C4FF" />
                    </Pattern>
                  </Defs>
                  <Rect width="100%" height="100%" fill="#F8F9FA" />
                  <Rect width="100%" height="100%" fill="url(#dots)" />
                </Svg>
              </View>

              {/* Image Section */}
              <Image source={{ uri: item.photos.thumbnail }} style={$thumbnail} resizeMode="contain" />

              {/* GPS Location Badge */}
              {item.location.type === "gps" && (
                <View
                  style={[
                    $gpsBadge,
                    { backgroundColor: colors.palette.primary500 },
                  ]}
                >
                  <Text text="📍" style={{ fontSize: 10 }} />
                </View>
              )}

              {/* Info Section - Framed Style */}
              <View style={[$cardInfoSection, { backgroundColor: "rgba(255, 255, 255, 0.95)" }]}>
                {/* Pet Type Row */}
                <View style={$petTypeRow}>
                  <Text style={$petTypeEmoji} text={getPetTypeEmoji(item.petType)} />
                  <Text
                    style={[$petTypeText, { color: getPetTypeColor(item.petType) }]}
                    text={item.petType}
                  />
                </View>

                {/* Date Row */}
                <Text style={[$dateRow, { color: colors.textDim }]} text={item.formattedDate} />
              </View>
            </View>
          </View>
        )}
      />
    </Screen>
  )
})

const $container: ViewStyle = {
  flex: 1,
}

const $headerContainer: ViewStyle = {
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 10,
}

const $headerTitle: TextStyle = {
  fontSize: 28,
  marginBottom: 4,
}

const $headerSubtitle: TextStyle = {
  fontSize: 14,
  opacity: 0.6,
}

const $countBadge: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
}

const $countText: TextStyle = {
  fontSize: 12,
  fontWeight: "600",
}

const $content: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 16,
}

const $gridContent: ViewStyle = {
  paddingHorizontal: 12,
  paddingTop: 8,
  paddingBottom: 100, // Space for tab bar
}

const $gridItem: ViewStyle = {
  flex: 1,
  margin: 10,
  maxWidth: "48%",
}

const $cardContainer: ViewStyle = {
  borderRadius: 16,
  overflow: "hidden",
  // Shadow for iOS
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.12,
  shadowRadius: 6,
  // Elevation for Android
  elevation: 4,
}

const $thumbnail: ImageStyle = {
  width: "100%",
  aspectRatio: 1,
}

const $cardInfoSection: ViewStyle = {
  padding: 12,
  gap: 6,
}

const $petTypeRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $petTypeEmoji: TextStyle = {
  fontSize: 18,
}

const $petTypeText: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  textTransform: "capitalize",
}

const $dateRow: TextStyle = {
  fontSize: 11,
}

const $gpsBadge: ViewStyle = {
  position: "absolute",
  top: 8,
  right: 8,
  width: 28,
  height: 28,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
}

// Empty State Styles
const $emptyStateContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 32,
}

const $emptyIcon: TextStyle = {
  fontSize: 64,
  marginBottom: 16,
}

const $emptyDescription: TextStyle = {
  fontSize: 14,
  textAlign: "center",
}

const $suggestionCard: ViewStyle = {
  borderRadius: 12,
  padding: 16,
  marginTop: 24,
  width: "100%",
  borderRadius: 12,
}

const $suggestionItem: TextStyle = {
  fontSize: 12,
  marginBottom: 6,
}
