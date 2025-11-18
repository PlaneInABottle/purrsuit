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
  StyleSheet,
} from "react-native"
import { Svg, Defs, Pattern, Circle, Rect } from "react-native-svg"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useStores } from "@/models"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import {
  requestLocationPermissions,
  hasLocationPermissions,
  getCurrentLocation,
  reverseGeocodeAsync,
  formatCoordinates,
  formatAddress,
} from "@/services/location"
import type { LocationCoordinates } from "@/services/location"
import { useAppTheme } from "@/theme/context"
import { savePhoto } from "@/utils/fileSystem"

type PetType = "cat" | "dog" | "other"

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
  const [petType, setPetType] = useState<PetType>("cat")
  const [location, setLocation] = useState("")
  const [note, setNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [locationCoords, setLocationCoords] = useState<LocationCoordinates | null>(null)
  const [locationAddress, setLocationAddress] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const petTypeOptions: Array<{ value: PetType; label: string; emoji: string }> = [
    { value: "cat", label: "Cat", emoji: "🐱" },
    { value: "dog", label: "Dog", emoji: "🐶" },
    { value: "other", label: "Other", emoji: "🐾" },
  ]

  async function handleGetCurrentLocation() {
    setIsGettingLocation(true)
    try {
      // Check if we have permissions
      const hasPermission = await hasLocationPermissions()
      if (!hasPermission) {
        // Request permissions
        const result = await requestLocationPermissions()
        if (!result.granted) {
          Alert.alert("Permission Denied", "Location permission is required to use this feature")
          setIsGettingLocation(false)
          return
        }
      }

      // Get current location
      const coords = await getCurrentLocation()
      if (!coords) {
        Alert.alert("Error", "Failed to get location. Please try again.")
        setIsGettingLocation(false)
        return
      }

      setLocationCoords(coords)

      // Try to get address via reverse geocoding
      const address = await reverseGeocodeAsync(coords.latitude, coords.longitude)
      if (address) {
        setLocationAddress(formatAddress(address))
      } else {
        setLocationAddress(null)
      }
    } catch (error) {
      console.error("Failed to get location:", error)
      Alert.alert("Error", "Failed to get location")
    } finally {
      setIsGettingLocation(false)
    }
  }

  function handleClearLocation() {
    setLocationCoords(null)
    setLocationAddress(null)
  }

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

      // Determine location type
      let locationData: {
        type: "none" | "manual" | "gps"
        label?: string
        coordinates?: { latitude: number; longitude: number }
      } = { type: "none" }

      if (locationCoords) {
        // Use GPS location if available
        locationData = {
          type: "gps",
          coordinates: {
            latitude: locationCoords.latitude,
            longitude: locationCoords.longitude,
          },
          label:
            locationAddress || formatCoordinates(locationCoords.latitude, locationCoords.longitude),
        }
      } else if (location.trim()) {
        // Fall back to manual location
        locationData = { type: "manual", label: location.trim() }
      }

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
        location: locationData,
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
      style={$container}
      contentContainerStyle={$scrollContent}
      safeAreaEdges={["top"]}
      backgroundColor="white"
      keyboardShouldPersistTaps="handled"
      KeyboardAvoidingViewProps={{
        enabled: false,
      }}
    >
      {/* Enhanced Header */}
      <View style={$header}>
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
              backgroundColor: "#F8F9FA",
              borderColor: colors.palette.primary200,
            },
          ]}
        >
          {/* Notebook Background Pattern */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <Pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <Circle cx="2" cy="2" r="1.5" fill="#A0C4FF" />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="#F8F9FA" />
            <Rect width="100%" height="100%" fill="url(#dots)" />
          </Svg>
          <Image source={{ uri: photoUri }} style={$photo} resizeMode="contain" />
          <View style={[$photoCornerAccent, { backgroundColor: colors.palette.accent500 }]} />
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
            const bgColor = isSelected
              ? getPetTypeBackground(option.value)
              : "rgba(255, 255, 255, 0.8)"
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
                <Text style={[$petTypeLabel, { color: textColor }]} text={option.label} />
                {isSelected && (
                  <View style={[$selectedIndicator, { backgroundColor: borderColor }]}>
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
            <Text text="Optional" style={[$optionalText, { color: colors.palette.accent600 }]} />
          </View>
        </View>

        {/* GPS Location Display */}
        {locationCoords && (
          <View
            style={[
              $gpsLocationDisplay,
              {
                backgroundColor: colors.palette.primary100,
                borderColor: colors.palette.primary300,
              },
            ]}
          >
            <View style={$gpsLocationContent}>
              <Text
                text="📡 GPS Location Captured"
                style={{ fontSize: 14, fontWeight: "600", marginBottom: 4 }}
              />
              {locationAddress ? (
                <Text
                  text={locationAddress}
                  style={{ fontSize: 13, color: colors.text, marginBottom: 4 }}
                />
              ) : null}
              <Text
                text={`${formatCoordinates(locationCoords.latitude, locationCoords.longitude)}`}
                style={{ fontSize: 12, color: colors.textDim }}
              />
            </View>
            <TouchableOpacity onPress={handleClearLocation} style={$clearButton}>
              <Text text="✕" style={{ fontSize: 18, color: colors.palette.primary600 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* GPS Button */}
        <TouchableOpacity
          onPress={handleGetCurrentLocation}
          disabled={isGettingLocation}
          style={[
            $gpsButton,
            {
              backgroundColor: locationCoords
                ? colors.palette.primary100
                : colors.palette.secondary100,
              borderColor: locationCoords ? colors.palette.primary300 : colors.palette.secondary300,
            },
          ]}
        >
          <Text text="📡" style={{ fontSize: 18, marginRight: 8 }} />
          <Text
            text={
              isGettingLocation
                ? "Getting location..."
                : locationCoords
                  ? "Update GPS"
                  : "Use Current Location"
            }
            style={{ color: colors.text, fontWeight: "500" }}
          />
        </TouchableOpacity>

        {/* Manual Location Input */}
        <Text
          text="Or type a location name"
          style={{ fontSize: 12, color: colors.textDim, marginTop: 12, marginBottom: 8 }}
        />
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
            editable={!locationCoords} // Disable manual input if GPS is set
          />
        </View>
      </View>

      {/* Notes Input - Framed */}
      <View style={[$framedSection, { borderColor: "rgba(0, 0, 0, 0.08)" }]}>
        <View style={$sectionHeader}>
          <Text text="📝" style={{ fontSize: 20, marginRight: 8 }} />
          <Text preset="subheading" text="Notes" />
          <View style={[$optionalBadge, { backgroundColor: colors.palette.accent100 }]}>
            <Text text="Optional" style={[$optionalText, { color: colors.palette.accent600 }]} />
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
              backgroundColor: isSaving ? colors.palette.neutral400 : colors.palette.primary500,
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
  aspectRatio: 3 / 4,
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

const $gpsLocationDisplay: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 1.5,
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
}

const $gpsLocationContent: ViewStyle = {
  flex: 1,
}

const $clearButton: ViewStyle = {
  paddingLeft: 12,
  paddingVertical: 4,
}

const $gpsButton: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1.5,
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginBottom: 12,
}
