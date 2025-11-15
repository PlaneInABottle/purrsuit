import { useState } from "react"
import {
  View,
  ViewStyle,
  Image,
  ImageStyle,
  TextInput,
  TextStyle,
  TouchableOpacity,
  Alert,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { BackgroundDecorations } from "@/components/BackgroundDecorations"
import { useAppTheme } from "@/theme/context"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useStores } from "@/models"
import { savePhoto } from "@/utils/fileSystem"

type PetType = "cat" | "dog" | "other" | "unknown"

export const EncounterEditScreen = ({
  route,
  navigation,
}: AppStackScreenProps<"EncounterEdit">) => {
  const {
    theme: { colors, spacing },
  } = useAppTheme()
  const { encountersStore } = useStores()
  const { photoUri, encounterId } = route.params

  // Form state
  const [petType, setPetType] = useState<PetType>("unknown")
  const [location, setLocation] = useState("")
  const [note, setNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const petTypeOptions: Array<{ value: PetType; label: string; emoji: string }> = [
    { value: "cat", label: "Cat", emoji: "🐱" },
    { value: "dog", label: "Dog", emoji: "🐶" },
    { value: "other", label: "Other", emoji: "🐾" },
    { value: "unknown", label: "Unknown", emoji: "❓" },
  ]

  async function handleSave() {
    setIsSaving(true)
    try {
      // Save photo to file system
      const { photoUri: savedPhotoUri, thumbnailUri } = await savePhoto(photoUri, encounterId)

      // Determine time of day
      const hour = new Date().getHours()
      let timeOfDay: "morning" | "afternoon" | "evening" | "night"
      if (hour >= 5 && hour < 12) timeOfDay = "morning"
      else if (hour >= 12 && hour < 17) timeOfDay = "afternoon"
      else if (hour >= 17 && hour < 21) timeOfDay = "evening"
      else timeOfDay = "night"

      // Create encounter
      encountersStore.addEncounter({
        id: encounterId,
        timestamp: Date.now(),
        photos: {
          original: savedPhotoUri,
          thumbnail: thumbnailUri,
        },
        petType,
        timeOfDay,
        location: location.trim() ? { type: "manual", label: location.trim() } : { type: "none" },
        note: note.trim() || undefined,
      })

      // Navigate back to home
      navigation.navigate("MainTabs", { screen: "Home" })
    } catch (error) {
      console.error("Failed to save encounter:", error)
      Alert.alert("Error", "Failed to save encounter")
    } finally {
      setIsSaving(false)
    }
  }

  function handleCancel() {
    Alert.alert("Discard Changes?", "Are you sure you want to discard this encounter?", [
      { text: "Keep Editing", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.navigate("MainTabs", { screen: "Capture" }),
      },
    ])
  }

  // Helper function to get pet type color
  const getPetTypeColor = (type: PetType) => {
    switch (type) {
      case "cat":
        return colors.palette.primary600
      case "dog":
        return colors.palette.secondary600
      case "other":
        return colors.palette.accent600
      default:
        return colors.text
    }
  }

  // Helper function to get pet type background
  const getPetTypeBackground = (type: PetType) => {
    switch (type) {
      case "cat":
        return colors.palette.primary100
      case "dog":
        return colors.palette.secondary100
      case "other":
        return colors.palette.accent100
      default:
        return "rgba(255, 255, 255, 0.8)"
    }
  }

  // Helper function to get pet type border color
  const getPetTypeBorder = (type: PetType) => {
    switch (type) {
      case "cat":
        return colors.palette.primary500
      case "dog":
        return colors.palette.secondary500
      case "other":
        return colors.palette.accent500
      default:
        return colors.palette.neutral400
    }
  }

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$scrollContent}
      safeAreaEdges={["top"]}
      keyboardShouldPersistTaps="handled"
      KeyboardAvoidingViewProps={{
        enabled: false,
      }}
    >
      {/* Background Decorations */}
      <BackgroundDecorations />

      {/* Enhanced Header */}
      <View style={[$header, { backgroundColor: "rgba(255, 255, 255, 0.95)" }]}>
        <TouchableOpacity
          onPress={handleCancel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={$cancelButton}
        >
          <Text style={{ color: colors.palette.primary600, fontSize: 16 }} text="Cancel" />
        </TouchableOpacity>
        <View style={$headerCenter}>
          <Text text="✨" style={{ fontSize: 20, marginRight: 8 }} />
          <Text preset="subheading" text="Add Details" />
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* Celebratory Photo Preview Section */}
      <View style={$photoSection}>
        <Text preset="subheading" text="📸 Your Capture" style={{ marginBottom: spacing.md }} />
        <View
          style={[
            $photoFrame,
            {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderColor: colors.palette.primary200,
            },
          ]}
        >
          <Image source={{ uri: photoUri }} style={$photo} resizeMode="cover" />
          <View
            style={[
              $photoCornerAccent,
              { backgroundColor: colors.palette.accent500 },
            ]}
          />
        </View>
      </View>

      {/* Pet Type Selector - Framed */}
      <View style={[$framedSection, { borderColor: "rgba(0, 0, 0, 0.08)" }]}>
        <View style={$sectionHeader}>
          <Text text="🐾" style={{ fontSize: 20, marginRight: 8 }} />
          <Text preset="subheading" text="Pet Type" />
        </View>

        <View style={$petTypeGrid}>
          {petTypeOptions.map((option) => {
            const isSelected = petType === option.value
            const bgColor = isSelected ? getPetTypeBackground(option.value) : "rgba(255, 255, 255, 0.8)"
            const borderColor = isSelected ? getPetTypeBorder(option.value) : colors.separator
            const textColor = isSelected ? getPetTypeColor(option.value) : colors.text

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  $petTypeButton,
                  {
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    borderWidth: isSelected ? 2.5 : 1.5,
                  },
                ]}
                onPress={() => setPetType(option.value)}
              >
                <Text style={$petTypeEmoji} text={option.emoji} />
                <Text
                  style={[$petTypeLabel, { color: textColor }]}
                  text={option.label}
                />
                {isSelected && (
                  <View
                    style={[
                      $selectedIndicator,
                      { backgroundColor: borderColor },
                    ]}
                  >
                    <Text
                      text="✓"
                      style={{
                        color: "#FFF",
                        fontSize: 10,
                        fontWeight: "700",
                      }}
                    />
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Location Input - Framed */}
      <View style={[$framedSection, { borderColor: "rgba(0, 0, 0, 0.08)" }]}>
        <View style={$sectionHeader}>
          <Text text="📍" style={{ fontSize: 20, marginRight: 8 }} />
          <Text preset="subheading" text="Location" />
          <View style={[$optionalBadge, { backgroundColor: colors.palette.accent100 }]}>
            <Text
              text="Optional"
              style={[$optionalText, { color: colors.palette.accent600 }]}
            />
          </View>
        </View>

        <View
          style={[
            $inputWrapper,
            {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderColor: location ? colors.palette.primary300 : colors.separator,
            },
          ]}
        >
          <TextInput
            style={[$inputField, { color: colors.text }]}
            value={location}
            onChangeText={setLocation}
            placeholder="Where did you meet?"
            placeholderTextColor={colors.textDim}
          />
        </View>
      </View>

      {/* Notes Input - Framed */}
      <View style={[$framedSection, { borderColor: "rgba(0, 0, 0, 0.08)" }]}>
        <View style={$sectionHeader}>
          <Text text="📝" style={{ fontSize: 20, marginRight: 8 }} />
          <Text preset="subheading" text="Notes" />
          <View style={[$optionalBadge, { backgroundColor: colors.palette.accent100 }]}>
            <Text
              text="Optional"
              style={[$optionalText, { color: colors.palette.accent600 }]}
            />
          </View>
        </View>

        <View
          style={[
            $textAreaWrapper,
            {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderColor: note ? colors.palette.primary300 : colors.separator,
            },
          ]}
        >
          <TextInput
            style={[$textAreaField, { color: colors.text }]}
            value={note}
            onChangeText={setNote}
            placeholder="Add notes about this encounter..."
            placeholderTextColor={colors.textDim}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Enhanced Save Button */}
      <View style={$saveButtonContainer}>
        <Button
          preset="primary"
          text={isSaving ? "Saving... ⏳" : "Save Encounter ✨"}
          onPress={handleSave}
          disabled={isSaving}
          style={[
            $saveButton,
            {
              backgroundColor: isSaving
                ? colors.palette.neutral400
                : colors.palette.primary500,
              shadowColor: colors.palette.primary500,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            },
          ]}
        />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 16,
  borderBottomWidth: 0,
  minHeight: 60,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
}

const $cancelButton: ViewStyle = {
  paddingVertical: 4,
  paddingHorizontal: 8,
}

const $headerCenter: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $scrollContent: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 140,
  paddingTop: 8,
}

const $photoSection: ViewStyle = {
  marginTop: 16,
}

const $photoFrame: ViewStyle = {
  borderRadius: 16,
  overflow: "hidden",
  aspectRatio: 1,
  borderWidth: 3,
  shadowColor: "#FF8A80",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 6,
  position: "relative",
}

const $photoCornerAccent: ViewStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  width: 50,
  height: 50,
  borderBottomLeftRadius: 50,
  opacity: 0.3,
}

const $photo: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $framedSection: ViewStyle = {
  borderWidth: 1,
  borderRadius: 12,
  padding: 16,
  marginTop: 16,
  backgroundColor: "rgba(255, 255, 255, 0.5)",
}

const $sectionHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 16,
}

const $optionalBadge: ViewStyle = {
  marginLeft: "auto",
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 8,
}

const $optionalText: TextStyle = {
  fontSize: 10,
  fontWeight: "600",
  textTransform: "uppercase",
}

const $petTypeGrid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  rowGap: 12,
}

const $petTypeButton: ViewStyle = {
  width: "47%",
  paddingTop: 16,
  paddingHorizontal: 12,
  paddingBottom: 16,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 130,
  position: "relative",
}

const $petTypeEmoji: TextStyle = {
  fontSize: 32,
  marginBottom: 8,
  lineHeight: 40,
  includeFontPadding: false,
}

const $petTypeLabel: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
}

const $selectedIndicator: ViewStyle = {
  position: "absolute",
  top: 8,
  right: 8,
  width: 20,
  height: 20,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
}

const $inputWrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1.5,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
}

const $inputField: TextStyle = {
  flex: 1,
  fontSize: 16,
  padding: 0,
}

const $textAreaWrapper: ViewStyle = {
  borderWidth: 1.5,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  minHeight: 100,
}

const $textAreaField: TextStyle = {
  fontSize: 16,
  padding: 0,
  minHeight: 80,
}

const $saveButtonContainer: ViewStyle = {
  marginTop: 32,
  paddingHorizontal: 8,
}

const $saveButton: ViewStyle = {
  minHeight: 56,
  borderRadius: 16,
}
