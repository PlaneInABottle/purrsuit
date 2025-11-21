import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity } from "react-native"
import { ChevronRight, FileText, Shield } from "lucide-react-native"
import { observer } from "mobx-react-lite"

import { BackgroundDecorations } from "@/components/BackgroundDecorations"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useStores } from "@/models"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"

export const ProfileScreen = observer(function ProfileScreen(props: MainTabScreenProps<"Profile">) {
  const {
    theme: { colors, spacing },
  } = useAppTheme()
  const { statsStore } = useStores()
  const { navigation } = props

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$screenContent}
      safeAreaEdges={["top"]}
      backgroundColor="white"
    >
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
            <View
              style={[
                $circleContent,
                {
                  borderColor: colors.palette.primary500,
                  backgroundColor: colors.palette.primary100,
                },
              ]}
            >
              <Text
                preset="bold"
                text={String(statsStore.totalEncounters)}
                style={[$circleNumber, { color: colors.palette.primary500 }]}
              />
              <Text text="Encounters" style={[$circleLabel, { color: colors.textDim }]} />
            </View>
          </View>

          <View style={$miniStatsContainer}>
            <View style={[$miniStatCard, { backgroundColor: $streakCardColor }]}>
              <Text text="🔥" style={$emojiIcon} />
              <View>
                <Text
                  preset="bold"
                  text={String(statsStore.currentStreak)}
                  style={$miniStatValue}
                />
                <Text text="Day Streak" style={$miniStatLabel} />
              </View>
            </View>

            <View style={[$miniStatCard, { backgroundColor: $achievementCardColor }]}>
              <Text text="⭐" style={$emojiIcon} />
              <View>
                <Text
                  preset="bold"
                  text={`${statsStore.achievementCount}/8`}
                  style={$miniStatValue}
                />
                <Text text="Achievements" style={$miniStatLabel} />
              </View>
            </View>
          </View>
        </View>

        {/* Pet Types Distribution */}
        {statsStore.totalEncounters > 0 && (
          <View style={$section}>
            <Text
              preset="subheading"
              text="Collection Stats"
              style={{ marginBottom: spacing.sm }}
            />
            <View style={$statsGrid}>
              {statsStore.catCount > 0 && (
                <View style={[$statBox, { backgroundColor: colors.palette.primary100 }]}>
                  <Text text="🐱" style={$statBoxEmoji} />
                  <Text
                    preset="bold"
                    text={`${statsStore.catPercentage}%`}
                    style={{ color: colors.palette.primary600 }}
                  />
                  <Text text="Cats" style={[$statBoxLabel, { color: colors.textDim }]} />
                </View>
              )}
              {statsStore.dogCount > 0 && (
                <View style={[$statBox, { backgroundColor: colors.palette.secondary100 }]}>
                  <Text text="🐶" style={$statBoxEmoji} />
                  <Text
                    preset="bold"
                    text={`${statsStore.dogPercentage}%`}
                    style={{ color: colors.palette.secondary600 }}
                  />
                  <Text text="Dogs" style={[$statBoxLabel, { color: colors.textDim }]} />
                </View>
              )}
              {statsStore.otherCount > 0 && (
                <View style={[$statBox, { backgroundColor: colors.palette.accent100 }]}>
                  <Text text="🐾" style={$statBoxEmoji} />
                  <Text
                    preset="bold"
                    text={`${Math.round((statsStore.otherCount / statsStore.totalEncounters) * 100)}%`}
                    style={{ color: colors.palette.accent600 }}
                  />
                  <Text text="Other" style={[$statBoxLabel, { color: colors.textDim }]} />
                </View>
              )}
            </View>
          </View>
        )}

        {/* Achievements Preview */}
        <View style={$section}>
          <View style={$sectionHeaderRow}>
            <Text preset="subheading" text="Achievements" />
            <Text
              text={`${statsStore.achievementCount} Unlocked`}
              style={[$achievementCountText, { color: colors.textDim }]}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={$achievementsScrollContent}
          >
            {statsStore.achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  $achievementCard,
                  {
                    backgroundColor: achievement.isUnlocked
                      ? colors.palette.primary100
                      : colors.palette.neutral100,
                    opacity: achievement.isUnlocked ? $opacityUnlocked : $opacityLocked,
                  },
                ]}
              >
                <Text text={achievement.icon} style={$achievementIcon} />
                <Text
                  preset="bold"
                  text={achievement.name}
                  style={$achievementName}
                  numberOfLines={1}
                />
                {achievement.isUnlocked ? (
                  <Text
                    text="Unlocked!"
                    style={[$achievementUnlockedText, { color: colors.palette.primary600 }]}
                  />
                ) : (
                  <View
                    style={[$progressBarBackground, { backgroundColor: colors.palette.neutral300 }]}
                  >
                    <View
                      style={[
                        $progressBarFill,
                        {
                          width: `${achievement.progress || 0}%`,
                          backgroundColor: colors.palette.primary500,
                        },
                      ]}
                    />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Legal Section */}
        <View style={$section}>
          <Text preset="subheading" text="Legal" style={{ marginBottom: spacing.sm }} />
          <View style={$legalContainer}>
            <TouchableOpacity
              style={$legalRow}
              onPress={() => navigation.navigate("Legal", { type: "privacy" })}
            >
              <View style={$legalRowLeft}>
                <Shield size={20} color={colors.palette.primary500} />
                <Text text="Privacy Policy" style={$legalText} />
              </View>
              <ChevronRight size={20} color={colors.textDim} />
            </TouchableOpacity>

            <View style={$separator} />

            <TouchableOpacity
              style={$legalRow}
              onPress={() => navigation.navigate("Legal", { type: "terms" })}
            >
              <View style={$legalRowLeft}>
                <FileText size={20} color={colors.palette.secondary500} />
                <Text text="Terms of Service" style={$legalText} />
              </View>
              <ChevronRight size={20} color={colors.textDim} />
            </TouchableOpacity>
          </View>
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

const $legalContainer: ViewStyle = {
  backgroundColor: "#F8F9FA",
  borderRadius: 12,
  overflow: "hidden",
}

const $legalRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 16,
}

const $legalRowLeft: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
}

const $legalText: TextStyle = {
  fontSize: 16,
  fontWeight: "500",
}

const $separator: ViewStyle = {
  height: 1,
  backgroundColor: "rgba(0,0,0,0.05)",
  marginLeft: 48,
}

const $emojiIcon: TextStyle = {
  fontSize: 20,
}

const $miniStatValue: TextStyle = {
  color: "white",
  fontSize: 16,
}

const $miniStatLabel: TextStyle = {
  color: "rgba(255,255,255,0.9)",
  fontSize: 10,
}

const $statBoxEmoji: TextStyle = {
  fontSize: 24,
}

const $statBoxLabel: TextStyle = {
  fontSize: 10,
}

const $achievementCountText: TextStyle = {
  fontSize: 12,
}

const $achievementsScrollContent: ViewStyle = {
  gap: 12,
  paddingRight: 20,
}

const $achievementIcon: TextStyle = {
  fontSize: 24,
  marginBottom: 4,
}

const $achievementName: TextStyle = {
  fontSize: 12,
}

const $achievementUnlockedText: TextStyle = {
  fontSize: 10,
  fontWeight: "600",
}

const $progressBarBackground: ViewStyle = {
  width: "100%",
  height: 4,
  borderRadius: 2,
  marginTop: 4,
}

const $progressBarFill: ViewStyle = {
  height: "100%",
  borderRadius: 2,
}

const $streakCardColor = "#7DB3E8"
const $achievementCardColor = "#E88888"
const $opacityUnlocked = 1
const $opacityLocked = 0.7
