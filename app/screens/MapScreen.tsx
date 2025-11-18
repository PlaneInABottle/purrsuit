import React, { useEffect, useState, useRef } from "react"
import { View, ViewStyle, TouchableOpacity, Alert, StyleSheet, TextStyle, Platform } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { useStores } from "@/models"
import { useAppTheme } from "@/theme/context"
import { Text } from "@/components/Text"
import { Screen } from "@/components/Screen"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"

type PetType = "cat" | "dog" | "other" | "unknown"

const getPetTypeColor = (type: PetType): string => {
  switch (type) {
    case "cat":
      return "#FF9800" // Orange
    case "dog":
      return "#2196F3" // Blue
    case "other":
      return "#9C27B0" // Purple
    default:
      return "#757575" // Gray
  }
}

const getPetTypeEmoji = (type: PetType): string => {
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

export const MapScreen = ({ navigation }: AppStackScreenProps<"Home">) => {
  const {
    theme: { colors },
  } = useAppTheme()
  const { encountersStore } = useStores()
  const mapRef = useRef<MapView>(null)
  const [selectedPetType, setSelectedPetType] = useState<PetType | "all">("all")
  const [initialRegionSet, setInitialRegionSet] = useState(false)
  const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(null)

  // Get encounters with GPS coordinates
  const gpsEncounters = encountersStore.encountersArray
    .filter((encounter) => encounter.location.type === "gps" && encounter.location.coordinates)
    .filter((encounter) => {
      if (selectedPetType === "all") return true
      return encounter.petType === selectedPetType
    })

  // Debug logging
  React.useEffect(() => {
    console.log("🗺️ MapScreen Debug:")
    console.log("  Total encounters:", encountersStore.encountersArray.length)
    console.log("  GPS encounters:", gpsEncounters.length)
  }, [gpsEncounters.length, encountersStore.encountersArray.length])

  // Set initial region to first GPS encounter or default
  useEffect(() => {
    if (!initialRegionSet && gpsEncounters.length > 0) {
      const firstEncounter = gpsEncounters[0]
      const coords = firstEncounter.location.coordinates
      if (coords && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000,
        )
        setInitialRegionSet(true)
      }
    }
  }, [gpsEncounters, initialRegionSet])

  const fitAllMarkers = () => {
    if (gpsEncounters.length === 0) {
      Alert.alert("No GPS Locations", "No encounters with GPS location data yet.")
      return
    }

    const coordinates = gpsEncounters
      .map((encounter) => encounter.location.coordinates!)
      .map((coords) => ({
        latitude: coords.latitude,
        longitude: coords.longitude,
      }))

    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      })
    }
  }

  const handleViewDetails = (encounterId: string) => {
    navigation.navigate("EncounterDetail", { encounterId })
  }

  const handleMarkerPress = (id: string) => {
    setSelectedEncounterId(id)
  }

  const handleMapPress = () => {
    setSelectedEncounterId(null)
  }

  const selectedEncounter = selectedEncounterId 
    ? gpsEncounters.find(e => e.id === selectedEncounterId) 
    : null

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContent}>
      {/* Header Section with Gradient */}
      <View style={$headerContainer}>
        <Text preset="heading" text="Encounter Map" style={$headerTitle} />
        <Text text="Explore your findings" style={$headerSubtitle} />
      </View>

      {/* Pet Type Filter */}
      <View style={$filterContainer}>
        <Text style={[$filterLabel, { color: colors.textDim }]} text="Filter by pet type:" />
        <View style={$filterButtonsRow}>
          {(["all", "cat", "dog", "other"] as const).map((type) => {
            const isSelected = selectedPetType === type
            const bgColor = isSelected
              ? type === "all"
                ? colors.palette.primary500
                : getPetTypeColor(type as PetType)
              : colors.palette.neutral100
            const textColor = isSelected ? "#FFF" : colors.text

            return (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedPetType(type)}
                style={[
                  $filterButton,
                  {
                    backgroundColor: bgColor,
                    borderColor: isSelected ? "transparent" : colors.separator,
                  },
                ]}
              >
                <Text
                  text={type === "all" ? "All" : getPetTypeEmoji(type as PetType)}
                  style={{ color: textColor, fontWeight: isSelected ? "600" : "500" }}
                />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Map View */}
      <View style={$mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
          showsMyLocationButton
          onMapReady={() => console.log("✅ MapView is READY")}
          onError={(e) => console.error("❌ MapView ERROR:", e)}
          onLayout={(e) => console.log("📏 MapView layout:", e.nativeEvent.layout)}
          onPress={handleMapPress}
        >
          {gpsEncounters.map((encounter) => {
            const coords = encounter.location.coordinates
            if (!coords) return null

            return (
              <Marker
                key={encounter.id}
                coordinate={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                }}
                anchor={{ x: 0.5, y: 1 }}
                onPress={(e) => {
                  e.stopPropagation()
                  handleMarkerPress(encounter.id)
                }}
              >
                {/* Custom small circular marker with pet type emoji */}
                <View
                  style={[
                    $petMarker,
                    {
                      backgroundColor: getPetTypeColor(encounter.petType),
                      borderColor: getPetTypeColor(encounter.petType),
                      transform: [{ scale: selectedEncounterId === encounter.id ? 1.2 : 1 }]
                    },
                  ]}
                >
                  <Text style={$markerEmoji} text={getPetTypeEmoji(encounter.petType)} />
                </View>
              </Marker>
            )
          })}
        </MapView>

        {/* Bottom Card for Selected Encounter */}
        {selectedEncounter && (
          <View style={$bottomCardContainer}>
            <View style={[$calloutContainer, { width: "100%", backgroundColor: colors.background }]}>
              {/* Header with pet type emoji and color */}
              <View
                style={[
                  $calloutHeader,
                  { backgroundColor: getPetTypeColor(selectedEncounter.petType) },
                ]}
              >
                <Text style={$calloutHeaderEmoji} text={getPetTypeEmoji(selectedEncounter.petType)} />
                <Text
                  style={$calloutHeaderText}
                  text={
                    selectedEncounter.petType.charAt(0).toUpperCase() + selectedEncounter.petType.slice(1)
                  }
                />
                <TouchableOpacity 
                  style={$closeButton} 
                  onPress={() => setSelectedEncounterId(null)}
                >
                  <Text text="✕" style={{ color: "white", fontWeight: "bold" }} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={$calloutContent}>
                <View style={$calloutRow}>
                  <Text style={[$calloutLabel, { color: colors.textDim }]} text="📅 Date:" />
                  <Text
                    style={[$calloutValue, { color: colors.text }]}
                    text={new Date(selectedEncounter.timestamp).toLocaleDateString()}
                  />
                </View>

                <View style={$calloutRow}>
                  <Text style={[$calloutLabel, { color: colors.textDim }]} text="⏰ Time:" />
                  <Text
                    style={[$calloutValue, { color: colors.text }]}
                    text={new Date(selectedEncounter.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                </View>
                
                {selectedEncounter.note && (
                  <View style={$calloutRow}>
                    <Text style={[$calloutLabel, { color: colors.textDim }]} text="📝 Note:" />
                    <Text
                      style={[$calloutValue, { color: colors.text }]}
                      text={selectedEncounter.note}
                      numberOfLines={1}
                    />
                  </View>
                )}
              </View>

              {/* Button */}
              <TouchableOpacity
                onPress={() => handleViewDetails(selectedEncounter.id)}
                style={[
                  $calloutButton,
                  { backgroundColor: getPetTypeColor(selectedEncounter.petType) },
                ]}
              >
                <Text style={$calloutButtonText} text="View Full Details" />
                <Text style={$calloutButtonArrow} text="→" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Fit All Button - Hide when card is shown */}
        {gpsEncounters.length > 0 && !selectedEncounterId && (
          <TouchableOpacity
            onPress={fitAllMarkers}
            style={[
              $fitAllButton,
              {
                backgroundColor: colors.palette.primary500,
                shadowColor: colors.palette.primary500,
              },
            ]}
          >
            <Text text="📍 Fit All" style={{ color: "#FFF", fontWeight: "600", fontSize: 12 }} />
          </TouchableOpacity>
        )}
      </View>
    </Screen>
  )
}

const $screenContent: ViewStyle = {
  flex: 1,
  flexDirection: "column",
}

const $headerContainer: ViewStyle = {
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 10,
  flexShrink: 0,
}

const $headerTitle: TextStyle = {
  fontSize: 28,
  marginBottom: 4,
}

const $headerSubtitle: TextStyle = {
  fontSize: 14,
  opacity: 0.6,
}

const $filterContainer: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "rgba(0, 0, 0, 0.05)",
  flexShrink: 0,
}

const $filterLabel: TextStyle = {
  fontSize: 12,
  fontWeight: "500",
  marginBottom: 10,
}

const $filterButtonsRow: ViewStyle = {
  flexDirection: "row",
  gap: 8,
}

const $filterButton: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 16,
  borderWidth: 1,
  alignItems: "center",
  justifyContent: "center",
  minWidth: 45,
}

const $mapContainer: ViewStyle = {
  flex: 1,
  position: "relative",
}

const $fitAllButton: ViewStyle = {
  position: "absolute",
  bottom: 20,
  right: 16,
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
}

const $petMarker: ViewStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  borderWidth: 1.5,
  alignItems: "center",
  justifyContent: "center",
  // iOS shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3,
  // Android elevation
  elevation: 4,
}

const $markerEmoji: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
}

const $calloutContainer: ViewStyle = {
  width: 200,
  borderRadius: 12,
  overflow: "hidden",
  // iOS shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  // Android elevation
  elevation: 6,
}

const $calloutHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 8,
  paddingHorizontal: 12,
  gap: 6,
}

const $calloutHeaderEmoji: TextStyle = {
  fontSize: 20,
}

const $calloutHeaderText: TextStyle = {
  fontSize: 15,
  fontWeight: "700",
  color: "#FFF",
}

const $calloutContent: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 8,
  gap: 6,
}

const $calloutRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
}

const $calloutLabel: TextStyle = {
  fontSize: 11,
  fontWeight: "500",
  minWidth: 70,
}

const $calloutValue: TextStyle = {
  fontSize: 13,
  fontWeight: "600",
  flex: 1,
}

const $calloutButton: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginHorizontal: 10,
  marginBottom: 10,
  borderRadius: 8,
  gap: 6,
  // iOS shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  // Android elevation
  elevation: 2,
}

const $calloutButtonText: TextStyle = {
  fontSize: 12,
  fontWeight: "700",
  color: "#FFF",
}

const $calloutButtonArrow: TextStyle = {
  fontSize: 14,
  fontWeight: "700",
  color: "#FFF",
}

const $bottomCardContainer: ViewStyle = {
  position: "absolute",
  bottom: 30,
  left: 16,
  right: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 8,
}

const $closeButton: ViewStyle = {
  position: "absolute",
  right: 10,
  top: 10,
  padding: 4,
}
