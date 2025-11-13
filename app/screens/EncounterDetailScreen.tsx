import React from "react"
import { View, ViewStyle } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"

export const EncounterDetailScreen = (props: AppStackScreenProps<"EncounterDetail">) => {
  const {
    theme: { colors },
  } = useAppTheme()
  const { navigation } = props

  return (
    <Screen preset="scroll" contentContainerStyle={$container}>
      <View style={$header}>
        <Button text="← Back" onPress={() => navigation.goBack()} preset="default" />
      </View>

      <View style={[$photoPlaceholder, { backgroundColor: colors.palette.neutral200 }]}>
        <Text text="Encounter Photo" style={{ color: colors.textDim }} />
      </View>

      <View style={$details}>
        <Text preset="heading" text="Encounter Details" />
        <Text
          text="Full encounter view with photo, stickers, notes, and location"
          style={{ color: colors.textDim, marginTop: 8 }}
        />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingBottom: 24,
}

const $header: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 12,
}

const $photoPlaceholder: ViewStyle = {
  height: 400,
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: 16,
  borderRadius: 12,
}

const $details: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 24,
}
