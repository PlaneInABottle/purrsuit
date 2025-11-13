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

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$scrollContent}
      safeAreaEdges={["top"]}
      keyboardShouldPersistTaps="handled"
      KeyboardAvoidingViewProps={{
        enabled: false, // Disable native KeyboardAvoidingView to prevent conflict
      }}
    >
      {/* Header */}
      <View style={[$header, { borderBottomColor: colors.separator }]}>
        <TouchableOpacity
          onPress={handleCancel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={{ color: colors.textDim }} text="Cancel" />
        </TouchableOpacity>
        <Text preset="subheading" text="Add Details" />
        <View style={{ width: 60 }} />
      </View>

      {/* Photo Preview */}
      <View style={[$photoContainer, { backgroundColor: colors.palette.neutral200 }]}>
        <Image source={{ uri: photoUri }} style={$photo} resizeMode="cover" />
      </View>

      {/* Pet Type Selector */}
      <View style={{ marginTop: spacing.lg }}>
        <Text preset="subheading" style={{ marginBottom: spacing.sm }} text="Pet Type" />
        <View style={$petTypeGrid}>
          {petTypeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                $petTypeButton,
                {
                  backgroundColor:
                    petType === option.value
                      ? colors.palette.primary100
                      : colors.palette.neutral100,
                  borderColor:
                    petType === option.value ? colors.palette.primary500 : colors.separator,
                },
              ]}
              onPress={() => setPetType(option.value)}
            >
              <Text style={$petTypeEmoji} text={option.emoji} />
              <Text
                style={[
                  $petTypeLabel,
                  { color: petType === option.value ? colors.palette.primary600 : colors.text },
                ]}
                text={option.label}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location Input */}
      <View style={{ marginTop: spacing.lg }}>
        <Text preset="subheading" style={{ marginBottom: spacing.sm }} text="Location" />
        <TextInput
          style={[
            $input,
            {
              backgroundColor: colors.palette.neutral100,
              borderColor: colors.separator,
              color: colors.text,
            },
          ]}
          value={location}
          onChangeText={setLocation}
          placeholder="Where did you meet? (optional)"
          placeholderTextColor={colors.textDim}
        />
      </View>

      {/* Notes Input */}
      <View style={{ marginTop: spacing.lg }}>
        <Text preset="subheading" style={{ marginBottom: spacing.sm }} text="Notes" />
        <TextInput
          style={[
            $input,
            $textArea,
            {
              backgroundColor: colors.palette.neutral100,
              borderColor: colors.separator,
              color: colors.text,
            },
          ]}
          value={note}
          onChangeText={setNote}
          placeholder="Add notes about this encounter... (optional)"
          placeholderTextColor={colors.textDim}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Save Button */}
      <Button
        preset="primary"
        text={isSaving ? "Saving..." : "Save Encounter"}
        onPress={handleSave}
        disabled={isSaving}
        style={{ marginTop: spacing.xl }}
      />
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
  paddingVertical: 12,
  borderBottomWidth: 1,
  minHeight: 52,
}

const $scrollContent: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 120,
}

const $photoContainer: ViewStyle = {
  marginTop: 16,
  borderRadius: 12,
  overflow: "hidden",
  aspectRatio: 1,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
}

const $photo: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $petTypeGrid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  rowGap: 12,
}

const $petTypeButton: ViewStyle = {
  width: "47%",
  padding: 16,
  borderRadius: 12,
  borderWidth: 2,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 90,
}

const $petTypeEmoji: TextStyle = {
  fontSize: 32,
  marginBottom: 4,
}

const $petTypeLabel: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
}

const $input: TextStyle = {
  borderWidth: 1,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 16,
}

const $textArea: TextStyle = {
  minHeight: 100,
  paddingTop: 12,
}
