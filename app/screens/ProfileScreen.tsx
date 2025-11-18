import React from "react"
import { View, ViewStyle, TextStyle, ScrollView } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { BackgroundDecorations } from "@/components/BackgroundDecorations"
import { useAppTheme } from "@/theme/context"
import { useStores } from "@/models"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"

export const ProfileScreen = observer(function ProfileScreen(
  _props: MainTabScreenProps<"Profile">,
) {
  const {
    theme: { colors, spacing },
  } = useAppTheme()
  const { statsStore } = useStores()

  const topLocations = statsStore.topLocations.slice(0, 5)

  return (
    <Screen preset="fixed" contentContainerStyle={$screenContent} safeAreaEdges={["top"]} backgroundColor="white">
      {/* Background Decorations */}
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={$container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={$headerContainer}>
          <Text preset="heading" text="Profile" style={$headerTitle} />
          <Text text="Your journey & settings" style={$headerSubtitle} />
        </View>

        {/* Hero Stats Section */}
        <View style={$heroSection}>
          <View style={$mainStatCircle}>
            <View style={[$circleContent, { borderColor: colors.palette.primary500, backgroundColor: colors.palette.primary100 }]}>
              <Text preset="bold" text={String(statsStore.totalEncounters)} style={[$circleNumber, { color: colors.palette.primary500 }]} />
              <Text text="Encounters" style={[$circleLabel, { color: colors.textDim }]} />
            </View>
          </View>

          <View style={$miniStatsContainer}>
            <View style={[$miniStatCard, { backgroundColor: "#7DB3E8" }]}>
              <Text text="🔥" style={{ fontSize: 20 }} />
              <View>
                <Text preset="bold" text={String(statsStore.currentStreak)} style={{ color: "white", fontSize: 16 }} />
                <Text text="Day Streak" style={{ color: "rgba(255,255,255,0.9)", fontSize: 10 }} />
              </View>
            </View>

            <View style={[$miniStatCard, { backgroundColor: "#E88888" }]}>
              <Text text="⭐" style={{ fontSize: 20 }} />
              <View>
                <Text preset="bold" text={`${statsStore.achievementCount}/8`} style={{ color: "white", fontSize: 16 }} />
                <Text text="Achievements" style={{ color: "rgba(255,255,255,0.9)", fontSize: 10 }} />
              </View>
            </View>
          </View>
        </View>

        {/* Pet Types Distribution */}
        {statsStore.totalEncounters > 0 && (
          <View style={$section}>
            <Text preset="subheading" text="Collection Stats" style={{ marginBottom: spacing.sm }} />
            <View style={$statsGrid}>
              {statsStore.catCount > 0 && (
                <View style={[$statBox, { backgroundColor: colors.palette.primary100 }]}>
                  <Text text="🐱" style={{ fontSize: 24 }} />
                  <Text preset="bold" text={`${statsStore.catPercentage}%`} style={{ color: colors.palette.primary600 }} />
                  <Text text="Cats" style={{ fontSize: 10, color: colors.textDim }} />
                </View>
              )}
              {statsStore.dogCount > 0 && (
                <View style={[$statBox, { backgroundColor: colors.palette.secondary100 }]}>
                  <Text text="🐶" style={{ fontSize: 24 }} />
                  <Text preset="bold" text={`${statsStore.dogPercentage}%`} style={{ color: colors.palette.secondary600 }} />
                  <Text text="Dogs" style={{ fontSize: 10, color: colors.textDim }} />
                </View>
              )}
              {statsStore.otherCount > 0 && (
                <View style={[$statBox, { backgroundColor: colors.palette.accent100 }]}>
                  <Text text="🐾" style={{ fontSize: 24 }} />
                  <Text preset="bold" text={`${Math.round((statsStore.otherCount / statsStore.totalEncounters) * 100)}%`} style={{ color: colors.palette.accent600 }} />
                  <Text text="Other" style={{ fontSize: 10, color: colors.textDim }} />
                </View>
              )}
            </View>
          </View>
        )}

        {/* Achievements Preview */}
        <View style={$section}>
          <View style={$sectionHeaderRow}>
            <Text preset="subheading" text="Achievements" />
            <Text text={`${statsStore.achievementCount} Unlocked`} style={{ color: colors.textDim, fontSize: 12 }} />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 20 }}>
            {statsStore.achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  $achievementCard, 
                  { 
                    backgroundColor: achievement.isUnlocked ? colors.palette.primary100 : colors.palette.neutral100,
                    opacity: achievement.isUnlocked ? 1 : 0.7
                  }
                ]}
              >
                <Text text={achievement.icon} style={{ fontSize: 24, marginBottom: 4 }} />
                <Text preset="bold" text={achievement.name} style={{ fontSize: 12 }} numberOfLines={1} />
                {achievement.isUnlocked ? (
                  <Text text="Unlocked!" style={{ fontSize: 10, color: colors.palette.primary600, fontWeight: "600" }} />
                ) : (
                  <View style={{ width: "100%", height: 4, backgroundColor: colors.palette.neutral300, borderRadius: 2, marginTop: 4 }}>
                    <View style={{ width: `${achievement.progress || 0}%`, height: "100%", backgroundColor: colors.palette.primary500, borderRadius: 2 }} />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  )
})

const $screenContent: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  paddingBottom: 100,
}

const $headerContainer: ViewStyle = {
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 10,
}

const $headerTitle: TextStyle = {
  fontSize: 28,
  marginBottom: 4,
}

const $headerSubtitle: TextStyle = {
  fontSize: 14,
  opacity: 0.6,
}

const $heroSection: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: 20,
  paddingVertical: 10,
  alignItems: "center",
  gap: 20,
}

const $mainStatCircle: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $circleContent: ViewStyle = {
  width: 120,
  height: 120,
  borderRadius: 60,
  borderWidth: 3,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
}

const $circleNumber: TextStyle = {
  fontSize: 36,
  fontWeight: "700",
}

const $circleLabel: TextStyle = {
  fontSize: 12,
  fontWeight: "600",
  textTransform: "uppercase",
}

const $miniStatsContainer: ViewStyle = {
  flex: 1,
  gap: 12,
}

const $miniStatCard: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: 12,
  borderRadius: 12,
  gap: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}

const $section: ViewStyle = {
  marginTop: 24,
  paddingHorizontal: 20,
}

const $sectionHeaderRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
}

const $statsGrid: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}

const $statBox: ViewStyle = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  gap: 4,
}

const $achievementCard: ViewStyle = {
  width: 100,
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
}
