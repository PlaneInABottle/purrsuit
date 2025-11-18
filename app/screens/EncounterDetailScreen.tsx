import React from "react"
import { View, ViewStyle, Image, ImageStyle, TextStyle, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Svg, Defs, Pattern, Circle, Rect } from "react-native-svg"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import { useStores } from "@/models"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { ArrowLeft, Calendar, Clock, MapPin, CloudSun, Tag, Smile, FileText } from "lucide-react-native"

export const EncounterDetailScreen = (props: AppStackScreenProps<"EncounterDetail">) => {
  const {
    theme: { colors, spacing },
  } = useAppTheme()
  const { navigation, route } = props
  const { encountersStore } = useStores()
  const { encounterId } = route.params

  // Find the encounter by ID
  const encounter = encountersStore.encountersArray.find((e) => e.id === encounterId)

  if (!encounter) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
        <View style={$header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
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

  const getPetTypeBackground = (petType: string): string => {
    const type = petType.toLowerCase()
    switch (type) {
      case "cat":
        return colors.palette.primary100
      case "dog":
        return colors.palette.secondary100
      case "other":
        return colors.palette.accent100
      default:
        return colors.palette.neutral100
    }
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container} style={{ backgroundColor: "white" }}>
      {/* Header */}
      <View style={$header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={$backButton}
        >
          <ArrowLeft size={24} color={colors.palette.primary600} />
        </TouchableOpacity>
        <View style={$headerCenter}>
          <Text text={getPetTypeEmoji(encounter.petType)} style={{ fontSize: 20, marginRight: 8 }} />
          <Text preset="subheading" text="Encounter Details" />
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Hero Section with Photo */}
      <View style={$heroSection}>
        <View style={$photoContainer}>
          {/* Notebook Background Pattern */}
          <View style={[StyleSheet.absoluteFill, { borderRadius: 24, overflow: 'hidden' }]}>
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
          
          {/* Corner Accent */}
          <View
            style={[
              $photoCornerAccent,
              { backgroundColor: getPetTypeColor(encounter.petType) },
            ]}
          />
        </View>
      </View>

      {/* Content Section */}
      <View style={$contentSection}>
        {/* Pet Type Badge */}
        <View style={$petTypeContainer}>
          <View style={[$petTypeBadge, { backgroundColor: getPetTypeBackground(encounter.petType) }]}>
            <Text style={{ fontSize: 24, marginRight: 8 }} text={getPetTypeEmoji(encounter.petType)} />
            <Text 
              style={[$petTypeText, { color: getPetTypeColor(encounter.petType) }]} 
              text={encounter.petType.charAt(0).toUpperCase() + encounter.petType.slice(1)} 
            />
          </View>
        </View>

        {/* Info Grid */}
        <View style={$infoGrid}>
          {/* Date */}
          <View style={$infoItem}>
            <View style={[$iconCircle, { backgroundColor: colors.palette.neutral100 }]}>
              <Calendar size={20} color={colors.palette.primary500} />
            </View>
            <View>
              <Text style={$infoLabel} text="Date" />
              <Text style={$infoValue} text={encounter.formattedDate} />
            </View>
          </View>

          {/* Time */}
          <View style={$infoItem}>
            <View style={[$iconCircle, { backgroundColor: colors.palette.neutral100 }]}>
              <Clock size={20} color={colors.palette.secondary500} />
            </View>
            <View>
              <Text style={$infoLabel} text="Time" />
              <Text style={$infoValue} text={encounter.formattedTime} />
            </View>
          </View>
        </View>

        {/* Location Card */}
        {encounter.hasLocation && (
          <View style={[$card, { borderColor: colors.palette.neutral200 }]}>
            <View style={$cardHeader}>
              <MapPin size={18} color={colors.palette.accent500} />
              <Text style={$cardTitle} text="Location" />
            </View>
            <Text style={$cardContent} text={encounter.locationDisplay} />
          </View>
        )}

        {/* Notes Card */}
        {encounter.hasNote && (
          <View style={[$card, { borderColor: colors.palette.neutral200 }]}>
            <View style={$cardHeader}>
              <FileText size={18} color={colors.palette.primary500} />
              <Text style={$cardTitle} text="Notes" />
            </View>
            <Text style={$cardContent} text={encounter.note} />
          </View>
        )}

        {/* Tags & Moods */}
        {(encounter.mood.length > 0 || encounter.tags.length > 0) && (
          <View style={[$card, { borderColor: colors.palette.neutral200 }]}>
            <View style={$cardHeader}>
              <Tag size={18} color={colors.palette.secondary500} />
              <Text style={$cardTitle} text="Tags & Mood" />
            </View>
            <View style={$tagsContainer}>
              {encounter.mood.map((m) => (
                <View key={m} style={[$tag, { backgroundColor: colors.palette.primary100 }]}>
                  <Text style={[$tagText, { color: colors.palette.primary600 }]} text={m} />
                </View>
              ))}
              {encounter.tags.map((t) => (
                <View key={t} style={[$tag, { backgroundColor: colors.palette.accent100 }]}>
                  <Text style={[$tagText, { color: colors.palette.accent600 }]} text={t} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Weather */}
        {encounter.weather && (
          <View style={$metaRow}>
            <View style={[$metaItem, { backgroundColor: colors.palette.neutral100 }]}>
              <CloudSun size={16} color={colors.textDim} />
              <Text style={$metaText} text={encounter.weather} />
            </View>
          </View>
        )}
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  flexGrow: 1,
  backgroundColor: "white",
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 10,
  borderBottomWidth: 0,
  minHeight: 60,
  backgroundColor: "white",
}

const $backButton: ViewStyle = {
  padding: 8,
  marginLeft: -8,
}

const $headerCenter: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $centerContent: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 16,
}

const $heroSection: ViewStyle = {
  paddingHorizontal: 20,
  marginTop: 10,
  marginBottom: 24,
}

const $photoContainer: ViewStyle = {
  width: "100%",
  aspectRatio: 3 / 4,
  borderRadius: 24,
  backgroundColor: "#F8F9FA",
  borderWidth: 3,
  borderColor: "#E0E0E0",
  // iOS shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
  // Android elevation
  elevation: 8,
  position: "relative",
}

const $photo: ImageStyle = {
  width: "100%",
  height: "100%",
  borderRadius: 20,
}

const $photoCornerAccent: ViewStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  width: 60,
  height: 60,
  borderBottomLeftRadius: 60,
  opacity: 0.2,
  borderTopRightRadius: 20,
}

const $contentSection: ViewStyle = {
  paddingHorizontal: 20,
  paddingBottom: 40,
}

const $petTypeContainer: ViewStyle = {
  alignItems: "center",
  marginTop: -40, // Overlap with photo
  marginBottom: 24,
  zIndex: 10,
}

const $petTypeBadge: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 24,
  paddingVertical: 12,
  borderRadius: 30,
  borderWidth: 4,
  borderColor: "white",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
}

const $petTypeText: TextStyle = {
  fontSize: 18,
  fontWeight: "700",
}

const $infoGrid: ViewStyle = {
  flexDirection: "row",
  gap: 16,
  marginBottom: 24,
}

const $infoItem: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  backgroundColor: "white",
  padding: 12,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#F0F0F0",
}

const $iconCircle: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
}

const $infoLabel: TextStyle = {
  fontSize: 12,
  color: "#888",
  marginBottom: 2,
}

const $infoValue: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  color: "#333",
}

const $card: ViewStyle = {
  backgroundColor: "white",
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
}

const $cardHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginBottom: 12,
}

const $cardTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
}

const $cardContent: TextStyle = {
  fontSize: 15,
  lineHeight: 22,
  color: "#555",
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
  fontWeight: "600",
}

const $metaRow: ViewStyle = {
  flexDirection: "row",
  gap: 12,
  marginTop: 8,
}

const $metaItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 20,
}

const $metaText: TextStyle = {
  fontSize: 13,
  fontWeight: "500",
  color: "#666",
}
