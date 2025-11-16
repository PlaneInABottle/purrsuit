import React, { useEffect, useState, useRef } from "react"
import { View, ViewStyle, TouchableOpacity, Alert, StyleSheet, TextStyle } from "react-native"
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

export const MapScreen = ({
  navigation,
}: AppStackScreenProps<"Home">) => {
  const {
    theme: { colors },
  } = useAppTheme()
  const { encountersStore } = useStores()
  const mapRef = useRef<MapView>(null)
  const [selectedPetType, setSelectedPetType] = useState<PetType | "all">("all")
  const [initialRegionSet, setInitialRegionSet] = useState(false)

  // Get encounters with GPS coordinates
  const gpsEncounters = encountersStore.encountersArray
    .filter(
      (encounter) =>
        encounter.location.type === "gps" && encounter.location.coordinates,
    )
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

  const handleMarkerPress = (encounterId: string) => {
    navigation.navigate("EncounterDetail", { encounterId })
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={$screenContent}
    >
      {/* Header Section */}
      <View style={$headerSection}>
        <View style={$headerContent}>
          <Text preset="heading" text="🗺️ Encounter Map" />
          <View style={[$countBadge, { backgroundColor: colors.palette.primary100 }]}>
            <Text
              style={[$countBadgeText, { color: colors.palette.primary600 }]}
              text={gpsEncounters.length.toString()}
            />
          </View>
        </View>
        {gpsEncounters.length === 0 && (
          <Text
            style={[$headerSubtitle, { color: colors.textDim }]}
            text="No encounters yet"
          />
        )}
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
                title={`${getPetTypeEmoji(encounter.petType)} ${encounter.petType}`}
                description={new Date(encounter.timestamp).toLocaleDateString()}
                onPress={() => handleMarkerPress(encounter.id)}
              >
                {/* Custom small circular marker with pet type emoji */}
                <View
                  style={[
                    $petMarker,
                    {
                      backgroundColor: getPetTypeColor(encounter.petType),
                      borderColor: getPetTypeColor(encounter.petType),
                    },
                  ]}
                >
                  <Text style={$markerEmoji} text={getPetTypeEmoji(encounter.petType)} />
                </View>
              </Marker>
            )
          })}
        </MapView>

        {/* Fit All Button */}
        {gpsEncounters.length > 0 && (
          <TouchableOpacity
            onPress={fitAllMarkers}
            style={[
              $fitAllButton,
              { backgroundColor: colors.palette.primary500, shadowColor: colors.palette.primary500 },
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

const $headerSection: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
  flexShrink: 0,
}

const $headerContent: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
}

const $countBadge: ViewStyle = {
  minWidth: 40,
  height: 32,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
}

const $countBadgeText: TextStyle = {
  fontSize: 16,
  fontWeight: "700",
}

const $headerSubtitle: TextStyle = {
  fontSize: 13,
  marginTop: 4,
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
