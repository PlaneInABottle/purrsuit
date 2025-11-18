import React, { useEffect, useState, useRef } from "react"
import { View, ViewStyle, TouchableOpacity, Alert, StyleSheet, TextStyle, Platform, ScrollView } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { useStores } from "@/models"
import { useAppTheme } from "@/theme/context"
import { Text } from "@/components/Text"
import { Screen } from "@/components/Screen"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { LocateFixed, Map as MapIcon, Filter } from "lucide-react-native"

type PetType = "cat" | "dog" | "other"

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

  // Custom Map Style for Light Theme
  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#e5e5e5" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#dadada" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [{ "color": "#e5e5e5" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9c9c9" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    }
  ]

  // Calculate initial region based on first encounter
  const initialRegion = gpsEncounters.length > 0 && gpsEncounters[0].location.coordinates ? {
    latitude: gpsEncounters[0].location.coordinates.latitude,
    longitude: gpsEncounters[0].location.coordinates.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  return (
    <Screen preset="fixed" safeAreaEdges={[]} contentContainerStyle={$screenContent} style={{ backgroundColor: "white" }} backgroundColor="white">
      {/* Map View */}
      <View style={$mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false} // We'll use our own button
          onMapReady={() => console.log("✅ MapView is READY")}
          onError={(e) => console.error("❌ MapView ERROR:", e)}
          onLayout={(e) => console.log("📏 MapView layout:", e.nativeEvent.layout)}
          onPress={handleMapPress}
        >
          {gpsEncounters.map((encounter) => {
            const coords = encounter.location.coordinates
            if (!coords) return null

            const isSelected = selectedEncounterId === encounter.id
            const size = isSelected ? 50 : 40
            const borderRadius = size / 2

            return (
              <Marker
                key={encounter.id}
                coordinate={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                zIndex={isSelected ? 999 : 1}
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
                      width: size,
                      height: size,
                      borderRadius: borderRadius,
                      backgroundColor: getPetTypeColor(encounter.petType),
                      borderColor: "white",
                      borderWidth: isSelected ? 3 : 2,
                    },
                  ]}
                >
                  <Text 
                    style={[$markerEmoji, { fontSize: isSelected ? 24 : 20 }]} 
                    text={getPetTypeEmoji(encounter.petType)} 
                  />
                </View>
              </Marker>
            )
          })}
        </MapView>

        {/* Floating Header & Filters */}
        <View style={$floatingHeaderContainer}>
          <View style={$headerTextContainer}>
            <Text preset="heading" text="Encounter Map" style={$headerTitle} />
            <Text text={`${gpsEncounters.length} locations found`} style={$headerSubtitle} />
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={$filterScrollContent}
            style={$filterScrollView}
          >
            {(["all", "cat", "dog", "other"] as const).map((type) => {
              const isSelected = selectedPetType === type
              const bgColor = isSelected
                ? type === "all"
                  ? colors.palette.primary500
                  : getPetTypeColor(type as PetType)
                : "white"
              const textColor = isSelected ? "#FFF" : colors.text
              const borderColor = isSelected ? "transparent" : colors.palette.neutral200

              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedPetType(type)}
                  style={[
                    $filterButton,
                    {
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                    },
                  ]}
                >
                  <Text
                    text={type === "all" ? "All" : getPetTypeEmoji(type as PetType)}
                    style={{ 
                      color: textColor, 
                      fontWeight: isSelected ? "700" : "500",
                      fontSize: 14,
                      marginRight: type === "all" ? 0 : 4
                    }}
                  />
                  {type !== "all" && (
                    <Text 
                      text={type.charAt(0).toUpperCase() + type.slice(1)} 
                      style={{ color: textColor, fontWeight: isSelected ? "700" : "500", fontSize: 13 }} 
                    />
                  )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Map Controls (Right Side) */}
        <View style={$mapControls}>
          {gpsEncounters.length > 0 && !selectedEncounterId && (
            <TouchableOpacity
              onPress={fitAllMarkers}
              style={[$fitAllButton, { backgroundColor: colors.palette.primary500 }]}
            >
              <Text text="📍 Fit All" style={{ color: "#FFF", fontWeight: "600", fontSize: 12 }} />
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Card for Selected Encounter */}
        {selectedEncounter && (
          <View style={$bottomCardContainer}>
            <View style={[$calloutContainer, { width: "100%", backgroundColor: "white" }]}>
              {/* Header with pet type emoji and color */}
              <View
                style={[
                  $calloutHeader,
                  { backgroundColor: getPetTypeColor(selectedEncounter.petType) },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={$calloutHeaderEmoji} text={getPetTypeEmoji(selectedEncounter.petType)} />
                  <Text
                    style={$calloutHeaderText}
                    text={
                      selectedEncounter.petType.charAt(0).toUpperCase() + selectedEncounter.petType.slice(1)
                    }
                  />
                </View>
                <TouchableOpacity 
                  style={$closeButton} 
                  onPress={() => setSelectedEncounterId(null)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text text="✕" style={{ color: "white", fontWeight: "bold", fontSize: 14, includeFontPadding: false }} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={$calloutContent}>
                <View style={$calloutRow}>
                  <Text style={[$calloutLabel, { color: colors.textDim }]} text="📅 Date" />
                  <Text
                    style={[$calloutValue, { color: colors.text }]}
                    text={new Date(selectedEncounter.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  />
                </View>

                <View style={$calloutRow}>
                  <Text style={[$calloutLabel, { color: colors.textDim }]} text="⏰ Time" />
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
                    <Text style={[$calloutLabel, { color: colors.textDim }]} text="📝 Note" />
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
                  { backgroundColor: getPetTypeColor(selectedEncounter.petType) + "15" }, // 10% opacity
                ]}
              >
                <Text 
                  style={[$calloutButtonText, { color: getPetTypeColor(selectedEncounter.petType) }]} 
                  text="View Full Details" 
                />
                <Text 
                  style={[$calloutButtonArrow, { color: getPetTypeColor(selectedEncounter.petType) }]} 
                  text="→" 
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Screen>
  )
}

const $screenContent: ViewStyle = {
  flex: 1,
  flexDirection: "column",
}

const $floatingHeaderContainer: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  paddingTop: Platform.OS === "ios" ? 20 : 40,
  paddingBottom: 20,
  backgroundColor: "white",
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 8,
  zIndex: 10,
}

const $headerTextContainer: ViewStyle = {
  paddingHorizontal: 20,
  marginBottom: 16,
}

const $headerTitle: TextStyle = {
  fontSize: 24,
  marginBottom: 2,
}

const $headerSubtitle: TextStyle = {
  fontSize: 14,
  opacity: 0.6,
}

const $filterScrollView: ViewStyle = {
  maxHeight: 50,
}

const $filterScrollContent: ViewStyle = {
  paddingHorizontal: 20,
  gap: 10,
}

const $filterButton: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1,
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
}

const $mapContainer: ViewStyle = {
  flex: 1,
  position: "relative",
}

const $mapControls: ViewStyle = {
  position: "absolute",
  right: 16,
  bottom: 30, // Moved to bottom
  gap: 12,
}

const $fitAllButton: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
}

const $petMarker: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  borderWidth: 2,
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
  fontSize: 20,
}

const $calloutContainer: ViewStyle = {
  borderRadius: 20,
  overflow: "hidden",
  // iOS shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
  // Android elevation
  elevation: 10,
}

const $calloutHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 12,
  paddingHorizontal: 16,
}

const $calloutHeaderEmoji: TextStyle = {
  fontSize: 24,
}

const $calloutHeaderText: TextStyle = {
  fontSize: 16,
  fontWeight: "700",
  color: "#FFF",
}

const $calloutContent: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
  gap: 10,
}

const $calloutRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
}

const $calloutLabel: TextStyle = {
  fontSize: 12,
  fontWeight: "600",
  width: 60,
}

const $calloutValue: TextStyle = {
  fontSize: 14,
  fontWeight: "500",
  flex: 1,
}

const $calloutButton: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginHorizontal: 16,
  marginBottom: 16,
  borderRadius: 12,
  gap: 8,
}

const $calloutButtonText: TextStyle = {
  fontSize: 14,
  fontWeight: "700",
}

const $calloutButtonArrow: TextStyle = {
  fontSize: 16,
  fontWeight: "700",
}

const $bottomCardContainer: ViewStyle = {
  position: "absolute",
  bottom: 30,
  left: 16,
  right: 16,
}

const $closeButton: ViewStyle = {
  backgroundColor: "rgba(0,0,0,0.1)",
  borderRadius: 14,
  width: 28,
  height: 28,
  alignItems: "center",
  justifyContent: "center",
}
