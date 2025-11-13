import React from "react"
import { View, ViewStyle, Image, ImageStyle, FlatList, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { useStores } from "@/models"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"

export const HomeScreen = observer(function HomeScreen(_props: MainTabScreenProps<"Home">) {
  const {
    theme: { colors },
  } = useAppTheme()
  const { encountersStore } = useStores()

  const encounters = encountersStore.encountersArray

  // Empty state
  if (encounters.length === 0) {
    return (
      <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <View style={$header}>
          <Text preset="heading" text="My Collection" />
        </View>
        <View style={[$content, { backgroundColor: colors.background }]}>
          <Text
            style={{ color: colors.textDim }}
            text="No encounters yet. Tap the camera to start!"
          />
        </View>
      </Screen>
    )
  }

  // Grid view with encounters
  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <View style={$header}>
        <Text preset="heading" text="My Collection" />
        <Text style={{ color: colors.textDim }} text={`${encounters.length} encounters`} />
      </View>

      <FlatList
        data={encounters}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={$gridContent}
        renderItem={({ item }) => (
          <View style={[$gridItem, { backgroundColor: colors.palette.neutral100 }]}>
            <Image source={{ uri: item.photos.thumbnail }} style={$thumbnail} resizeMode="cover" />
            <View style={$encounterInfo}>
              <Text style={$encounterType} text={item.petType} />
              <Text style={[$encounterDate, { color: colors.textDim }]} text={item.formattedDate} />
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

const $header: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
}

const $content: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 16,
}

const $gridContent: ViewStyle = {
  paddingHorizontal: 8,
  paddingBottom: 100, // Space for tab bar
}

const $gridItem: ViewStyle = {
  flex: 1,
  margin: 8,
  borderRadius: 12,
  overflow: "hidden",
  maxWidth: "45%",
  // Shadow for iOS
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  // Elevation for Android
  elevation: 3,
}

const $thumbnail: ImageStyle = {
  width: "100%",
  aspectRatio: 1,
}

const $encounterInfo: ViewStyle = {
  padding: 8,
}

const $encounterType: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  textTransform: "capitalize",
}

const $encounterDate: TextStyle = {
  fontSize: 12,
  marginTop: 2,
}
