import { useEffect, useState, useRef, useCallback } from "react"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextStyle,
  Platform,
  ScrollView,
  Modal,
  Pressable,
} from "react-native"
import {
  MapView,
  Camera,
  PointAnnotation,
  type CameraRef,
  type MapViewRef,
} from "@maplibre/maplibre-react-native"
import { Clock, Layers, X, Check, Maximize } from "lucide-react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useStores } from "@/models"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { MAP_STYLES, type MapStyleKey, toMapLibreCoords } from "@/services/offlineMapManager"
import { useAppTheme } from "@/theme/context"

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

export const MapScreen = ({ navigation }: MainTabScreenProps<"Map">) => {
  const {
    theme: { colors },
  } = useAppTheme()
  const { encountersStore } = useStores()
  const insets = useSafeAreaInsets()
  const mapRef = useRef<MapViewRef>(null)
  const cameraRef = useRef<CameraRef>(null)
  const [selectedPetType, setSelectedPetType] = useState<PetType | "all">("all")
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "all">("all")
  const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(null)
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("liberty")
  const [showStyleSheet, setShowStyleSheet] = useState(false)

  // Get ALL GPS encounters (unfiltered) for initial camera position
  const allGpsEncounters = encountersStore.encountersArray.filter(
    (e) => e.location.type === "gps" && e.location.coordinates,
  )

  // Filter encounters based on selection (for display)
  const timeFilteredEncounters = encountersStore.getEncountersByTimeRange(
    timeFilter === "24h" ? 24 : timeFilter === "7d" ? 24 * 7 : "all",
  )

  const filteredEncounters = timeFilteredEncounters.filter((e) => {
    if (!e.hasLocation) return false
    if (selectedPetType === "all") return true
    return e.petType === selectedPetType
  })

  // Get filtered encounters with GPS coordinates (for markers)
  const gpsEncounters = filteredEncounters.filter(
    (e) => e.location.type === "gps" && e.location.coordinates,
  )

  // Debug logging
  useEffect(() => {
    console.log("🗺️ MapScreen Debug:")
    console.log("  Total encounters:", encountersStore.encountersArray.length)
    console.log("  GPS encounters:", gpsEncounters.length)
  }, [gpsEncounters.length, encountersStore.encountersArray.length])

  // Calculate initial center coordinate based on ALL encounters (not filtered)
  // This prevents camera jumping when filters change
  const initialCenter =
    allGpsEncounters.length > 0 && allGpsEncounters[0].location.coordinates
      ? {
          longitude: allGpsEncounters[0].location.coordinates.longitude,
          latitude: allGpsEncounters[0].location.coordinates.latitude,
        }
      : { longitude: -122.4324, latitude: 37.78825 } // Default: San Francisco

  const fitAllMarkers = useCallback(() => {
    if (gpsEncounters.length === 0) {
      Alert.alert("No GPS Locations", "No encounters with GPS location data yet.")
      return
    }

    // Calculate bounds from all coordinates
    const coordinates = gpsEncounters
      .map((encounter) => encounter.location.coordinates!)
      .map((coords) => toMapLibreCoords(coords))

    if (coordinates.length === 1) {
      // Single marker - just center on it
      cameraRef.current?.easeTo({
        center: { longitude: coordinates[0][0], latitude: coordinates[0][1] },
        zoom: 14,
        duration: 1000,
      })
      return
    }

    // Calculate bounding box
    const lngs = coordinates.map((c) => c[0])
    const lats = coordinates.map((c) => c[1])
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)

    // Add padding
    const lngPadding = (maxLng - minLng) * 0.2 || 0.01
    const latPadding = (maxLat - minLat) * 0.2 || 0.01

    // fitBounds takes [west, south, east, north]
    const bounds: [number, number, number, number] = [
      minLng - lngPadding, // west
      minLat - latPadding, // south
      maxLng + lngPadding, // east
      maxLat + latPadding, // north
    ]

    cameraRef.current?.fitBounds(bounds, {
      padding: { top: 100, right: 50, bottom: 200, left: 50 },
      duration: 1000,
    })
  }, [gpsEncounters])

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
    ? gpsEncounters.find((e) => e.id === selectedEncounterId)
    : null

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={[]}
      contentContainerStyle={$screenContent}
      style={$screenStyle}
      backgroundColor="white"
    >
      {/* Map View */}
      <View style={$mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          mapStyle={MAP_STYLES[mapStyle].url}
          onPress={handleMapPress}
        >
          <Camera
            ref={cameraRef}
            longitude={initialCenter.longitude}
            latitude={initialCenter.latitude}
            zoom={12}
          />

          {gpsEncounters.map((encounter) => {
            const coords = encounter.location.coordinates
            if (!coords) return null

            const isSelected = selectedEncounterId === encounter.id
            const size = isSelected ? 50 : 40
            const borderRadius = size / 2
            const coordinate = toMapLibreCoords(coords)

            return (
              <PointAnnotation
                key={`${encounter.id}-${isSelected ? "selected" : "normal"}-${mapStyle}`}
                id={`${encounter.id}-${mapStyle}`}
                coordinate={coordinate}
                anchor={{ x: 0.5, y: 0.5 }}
                onSelected={() => handleMarkerPress(encounter.id)}
              >
                <View
                  style={[
                    $petMarker,
                    {
                      width: size,
                      height: size,
                      borderRadius: borderRadius,
                      backgroundColor: getPetTypeColor(encounter.petType as PetType),
                      borderColor: $markerBorderColor,
                      borderWidth: isSelected
                        ? $markerBorderWidthSelected
                        : $markerBorderWidthDefault,
                    },
                  ]}
                >
                  <Text
                    style={[
                      $markerEmoji,
                      {
                        fontSize: isSelected ? $markerEmojiSizeSelected : $markerEmojiSizeDefault,
                      },
                    ]}
                    text={getPetTypeEmoji(encounter.petType as PetType)}
                  />
                </View>
              </PointAnnotation>
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
                    style={[
                      $filterButtonText,
                      {
                        color: textColor,
                        fontWeight: isSelected ? $fontWeightSelected : $fontWeightDefault,
                        marginRight: type === "all" ? $marginRightNone : $marginRightDefault,
                      },
                    ]}
                  />
                  {type !== "all" && (
                    <Text
                      text={type.charAt(0).toUpperCase() + type.slice(1)}
                      style={[
                        $filterButtonLabel,
                        {
                          color: textColor,
                          fontWeight: isSelected ? $fontWeightSelected : $fontWeightDefault,
                        },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          {/* Time Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={$filterScrollContent}
            style={[$filterScrollView, $timeFilterScrollView]}
          >
            {(["all", "24h", "7d"] as const).map((filter) => {
              const isSelected = timeFilter === filter
              const bgColor = isSelected ? colors.palette.secondary500 : "white"
              const textColor = isSelected ? "#FFF" : colors.text
              const borderColor = isSelected ? "transparent" : colors.palette.neutral200

              let label = "All Time"
              if (filter === "24h") label = "Last 24h"
              if (filter === "7d") label = "Last 7 Days"

              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setTimeFilter(filter)}
                  style={[
                    $filterButton,
                    {
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                    },
                  ]}
                >
                  <Clock size={14} color={textColor} style={$clockIconStyle} />
                  <Text
                    text={label}
                    style={[
                      $filterButtonLabel,
                      {
                        color: textColor,
                        fontWeight: isSelected ? $fontWeightSelected : $fontWeightDefault,
                      },
                    ]}
                  />
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Map Controls (Right Side) */}
        <View style={$mapControls}>
          {/* Layers Button - Opens Style Sheet */}
          <TouchableOpacity
            onPress={() => setShowStyleSheet(true)}
            style={[$layersButton, { backgroundColor: colors.background }]}
          >
            <Layers size={20} color={colors.text} />
          </TouchableOpacity>

          {gpsEncounters.length > 0 && !selectedEncounterId && (
            <TouchableOpacity
              onPress={fitAllMarkers}
              style={[$fitAllButton, { backgroundColor: colors.palette.primary500 }]}
            >
              <Maximize size={18} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Map Style Bottom Sheet */}
        <Modal
          visible={showStyleSheet}
          transparent
          animationType="slide"
          onRequestClose={() => setShowStyleSheet(false)}
        >
          <Pressable style={$sheetOverlay} onPress={() => setShowStyleSheet(false)}>
            <Pressable
              style={[$sheetContent, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View style={$sheetHeader}>
                <Text preset="subheading" text="Map Style" />
                <TouchableOpacity
                  onPress={() => setShowStyleSheet(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Style Grid */}
              <View style={$styleGrid}>
                {(Object.keys(MAP_STYLES) as MapStyleKey[]).map((styleKey) => {
                  const isActive = mapStyle === styleKey
                  const style = MAP_STYLES[styleKey]
                  return (
                    <TouchableOpacity
                      key={styleKey}
                      onPress={() => {
                        setMapStyle(styleKey)
                        setShowStyleSheet(false)
                      }}
                      style={[
                        $styleGridItem,
                        {
                          borderColor: isActive
                            ? colors.palette.primary500
                            : colors.palette.neutral300,
                          backgroundColor: isActive
                            ? colors.palette.primary100
                            : colors.palette.neutral100,
                        },
                      ]}
                    >
                      <View style={$styleGridItemContent}>
                        <Text
                          text={style.name}
                          style={[
                            $styleGridItemName,
                            { color: isActive ? colors.palette.primary600 : colors.text },
                          ]}
                        />
                        <Text
                          text={style.description}
                          style={[$styleGridItemDesc, { color: colors.textDim }]}
                        />
                      </View>
                      {isActive && (
                        <View
                          style={[
                            $styleGridItemCheck,
                            { backgroundColor: colors.palette.primary500 },
                          ]}
                        >
                          <Check size={14} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Bottom Card for Selected Encounter */}
        {selectedEncounter && (
          <View style={$bottomCardContainer}>
            <View style={[$calloutContainer, $calloutContainerStyle]}>
              {/* Header with pet type emoji and color */}
              <View
                style={[
                  $calloutHeader,
                  { backgroundColor: getPetTypeColor(selectedEncounter.petType as PetType) },
                ]}
              >
                <View style={$calloutHeaderContent}>
                  <Text
                    style={$calloutHeaderEmoji}
                    text={getPetTypeEmoji(selectedEncounter.petType as PetType)}
                  />
                  <Text
                    style={$calloutHeaderText}
                    text={
                      selectedEncounter.petType.charAt(0).toUpperCase() +
                      selectedEncounter.petType.slice(1)
                    }
                  />
                </View>
                <TouchableOpacity
                  style={$closeButton}
                  onPress={() => setSelectedEncounterId(null)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text text="✕" style={$closeButtonText} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={$calloutContent}>
                <View style={$calloutRow}>
                  <Text style={[$calloutLabel, { color: colors.textDim }]} text="📅 Date" />
                  <Text
                    style={[$calloutValue, { color: colors.text }]}
                    text={new Date(selectedEncounter.timestamp).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
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
                  { backgroundColor: getPetTypeColor(selectedEncounter.petType as PetType) + "15" }, // 10% opacity
                ]}
              >
                <Text
                  style={[
                    $calloutButtonText,
                    { color: getPetTypeColor(selectedEncounter.petType as PetType) },
                  ]}
                  text="View Full Details"
                />
                <Text
                  style={[
                    $calloutButtonArrow,
                    { color: getPetTypeColor(selectedEncounter.petType as PetType) },
                  ]}
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

const $screenStyle: ViewStyle = {
  backgroundColor: "white",
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

const $filterButtonText: TextStyle = {
  fontSize: 14,
}

const $filterButtonLabel: TextStyle = {
  fontSize: 13,
}

const $mapContainer: ViewStyle = {
  flex: 1,
  position: "relative",
}

const $mapControls: ViewStyle = {
  position: "absolute",
  right: 16,
  bottom: 30,
  gap: 12,
  alignItems: "flex-end",
}

const $layersButton: ViewStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
}

const $sheetOverlay: ViewStyle = {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
}

const $sheetContent: ViewStyle = {
  backgroundColor: "white",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingTop: 20,
  paddingHorizontal: 20,
}

const $sheetHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
}

const $styleGrid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
}

const $styleGridItem: ViewStyle = {
  width: "47%",
  padding: 16,
  borderRadius: 16,
  borderWidth: 2,
  position: "relative",
}

const $styleGridItemContent: ViewStyle = {
  gap: 4,
}

const $styleGridItemName: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
}

const $styleGridItemDesc: TextStyle = {
  fontSize: 12,
}

const $styleGridItemCheck: ViewStyle = {
  position: "absolute",
  top: 12,
  right: 12,
  width: 24,
  height: 24,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
}

const $fitAllButton: ViewStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
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
  textAlign: "center",
  textAlignVertical: "center",
  includeFontPadding: false,
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

const $calloutContainerStyle: ViewStyle = {
  width: "100%",
  backgroundColor: "white",
}

const $calloutHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 12,
  paddingHorizontal: 16,
}

const $calloutHeaderContent: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
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

const $closeButtonText: TextStyle = {
  color: "white",
  fontWeight: "bold",
  fontSize: 14,
  includeFontPadding: false,
}

const $closeButton: ViewStyle = {
  backgroundColor: "rgba(0,0,0,0.1)",
  borderRadius: 14,
  width: 28,
  height: 28,
  alignItems: "center",
  justifyContent: "center",
}

const $markerBorderColor = "white"
const $markerBorderWidthSelected = 3
const $markerBorderWidthDefault = 2
const $markerEmojiSizeSelected = 24
const $markerEmojiSizeDefault = 20
const $fontWeightSelected = "700"
const $fontWeightDefault = "500"
const $timeFilterScrollView: ViewStyle = {
  marginTop: 10,
}
const $clockIconStyle = { marginRight: 6 }
const $marginRightNone = 0
const $marginRightDefault = 4
