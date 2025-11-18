import React from "react"
import { View, ViewStyle, Image, ImageStyle, TextStyle, StyleSheet } from "react-native"
import { Svg, Defs, Pattern, Circle, Rect } from "react-native-svg"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { useStores } from "@/models"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"

export const EncounterDetailScreen = (props: AppStackScreenProps<"EncounterDetail">) => {
  const {
    theme: { colors },
  } = useAppTheme()
  const { navigation, route } = props
  const { encountersStore } = useStores()
  const { encounterId } = route.params

  // Find the encounter by ID
  const encounter = encountersStore.encountersArray.find((e) => e.id === encounterId)

  if (!encounter) {
    return (
      <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
        <View style={$header}>
          <Button text="← Back" onPress={() => navigation.goBack()} preset="default" />
        </View>
        <View style={$centerContent}>
          <Text text="Encounter not found" style={{ color: colors.textDim }} />
        </View>
      </Screen>
    )
  }

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

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      {/* Header with Back Button */}
      <View style={[$header, { paddingBottom: 0 }]}>
        <Button text="← Back" onPress={() => navigation.goBack()} preset="default" />
      </View>

      {/* Hero Section with Photo and Overlays */}
      <View style={$heroSection}>
        {/* Photo with rounded corners and shadow */}
        <View style={$photoContainer}>
          {/* Notebook Background Pattern */}
          <View style={[StyleSheet.absoluteFill, { borderRadius: 20, overflow: 'hidden' }]}>
            <Svg width="100%" height="100%">
              <Defs>
                <Pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <Circle cx="2" cy="2" r="1.5" fill="#A0C4FF" />
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="#F8F9FA" />
              <Rect width="100%" height="100%" fill="url(#dots)" />
            </Svg>
          </View>
          <Image
            source={{ uri: encounter.photos.original }}
            style={$photo}
            resizeMode="contain"
          />
        </View>

        {/* Pet Type Badge - Top Right */}
        <View
          style={[
            $petTypeBadge,
            { backgroundColor: getPetTypeColor(encounter.petType) },
          ]}
        >
          <Text style={$petTypeBadgeEmoji} text={getPetTypeEmoji(encounter.petType)} />
          <Text style={$petTypeBadgeText} text={encounter.petType.toUpperCase()} />
        </View>

        {/* Date Badge - Bottom Left */}
        <View style={[$dateBadge, { backgroundColor: "rgba(0, 0, 0, 0.6)" }]}>
          <Text text="📅" style={{ fontSize: 12, marginRight: 6 }} />
          <Text style={$badgeText} text={encounter.formattedDate} />
        </View>

        {/* Time Badge - Bottom Right */}
        <View style={[$timeBadge, { backgroundColor: "rgba(0, 0, 0, 0.6)" }]}>
          <Text text="🕐" style={{ fontSize: 12, marginRight: 6 }} />
          <Text style={$badgeText} text={encounter.formattedTime} />
        </View>
      </View>

      {/* Encounter Info */}
      <View style={$details}>

        {/* Location */}
        {encounter.hasLocation && (
          <View style={$section}>
            <Text
              preset="bold"
              text="📍 Location"
              style={{ marginBottom: 8, fontSize: 14 }}
            />
            <Text
              text={encounter.locationDisplay}
              style={[$sectionContent, { color: colors.textDim }]}
            />
          </View>
        )}

        {/* Mood Tags */}
        {encounter.mood.length > 0 && (
          <View style={$section}>
            <Text preset="bold" text="😊 Mood" style={{ marginBottom: 8, fontSize: 14 }} />
            <View style={$tagsContainer}>
              {encounter.mood.map((m) => (
                <View
                  key={m}
                  style={[$tag, { backgroundColor: colors.palette.primary100 }]}
                >
                  <Text style={[$tagText, { color: getPetTypeColor(encounter.petType) }]} text={m} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Custom Tags */}
        {encounter.tags.length > 0 && (
          <View style={$section}>
            <Text preset="bold" text="🏷️ Tags" style={{ marginBottom: 8, fontSize: 14 }} />
            <View style={$tagsContainer}>
              {encounter.tags.map((tag) => (
                <View
                  key={tag}
                  style={[$tag, { backgroundColor: colors.palette.accent100 }]}
                >
                  <Text
                    style={[$tagText, { color: getPetTypeColor(encounter.petType) }]}
                    text={tag}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        {encounter.hasNote && (
          <View style={$section}>
            <Text preset="bold" text="📝 Notes" style={{ marginBottom: 8, fontSize: 14 }} />
            <Text text={encounter.note} style={[$sectionContent, { color: colors.text }]} />
          </View>
        )}

        {/* Weather */}
        {encounter.weather && (
          <View style={$section}>
            <Text
              preset="bold"
              text="🌤️ Weather"
              style={{ marginBottom: 8, fontSize: 14 }}
            />
            <Text text={encounter.weather} style={[$sectionContent, { color: colors.textDim }]} />
          </View>
        )}

        {/* Time of Day */}
        <View style={$section}>
          <Text
            preset="bold"
            text="⏰ Time of Day"
            style={{ marginBottom: 8, fontSize: 14 }}
          />
          <Text text={encounter.timeOfDay} style={[$sectionContent, { color: colors.textDim }]} />
        </View>

        {/* Stickers Count */}
        {encounter.hasStickers && (
          <View style={$section}>
            <Text
              preset="bold"
              text="✨ Stickers"
              style={{ marginBottom: 8, fontSize: 14 }}
            />
            <Text
              text={`${encounter.stickers.length} sticker${encounter.stickers.length !== 1 ? "s" : ""}`}
              style={[$sectionContent, { color: colors.textDim }]}
            />
          </View>
        )}
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingBottom: 24,
}

const $centerContent: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 16,
}

const $header: ViewStyle = {
  paddingHorizontal: 20,
  paddingVertical: 12,
}

const $heroSection: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 12,
  position: "relative",
}

const $photoContainer: ViewStyle = {
  width: "100%",
  height: 420,
  borderRadius: 20,
  backgroundColor: "#F8F9FA",
  // iOS shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  // Android elevation
  elevation: 8,
}

const $photo: ImageStyle = {
  width: "100%",
  height: "100%",
  borderRadius: 20,
}

const $petTypeBadge: ViewStyle = {
  position: "absolute",
  top: 28,
  right: 28,
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20,
  // iOS shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  // Android elevation
  elevation: 6,
}

const $petTypeBadgeEmoji: TextStyle = {
  fontSize: 18,
}

const $petTypeBadgeText: TextStyle = {
  fontSize: 12,
  fontWeight: "700",
  color: "#FFF",
  letterSpacing: 0.5,
}

const $dateBadge: ViewStyle = {
  position: "absolute",
  bottom: 28,
  left: 28,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
}

const $timeBadge: ViewStyle = {
  position: "absolute",
  bottom: 28,
  right: 28,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
}

const $badgeText: TextStyle = {
  fontSize: 12,
  fontWeight: "600",
  color: "#FFF",
}

const $details: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 24,
}

const $section: ViewStyle = {
  marginTop: 16,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: "rgba(0, 0, 0, 0.05)",
}

const $sectionContent: TextStyle = {
  fontSize: 14,
  lineHeight: 20,
}

const $tagsContainer: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
}

const $tag: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
}

const $tagText: TextStyle = {
  fontSize: 12,
  fontWeight: "500",
}
