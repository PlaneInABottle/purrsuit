import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { StatCard } from "@/components/StatCard"
import { AchievementCard } from "@/components/AchievementCard"
import { BackgroundDecorations } from "@/components/BackgroundDecorations"
import { useAppTheme } from "@/theme/context"
import { useStores } from "@/models"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"

export const StatsScreen = observer(function StatsScreen(_props: MainTabScreenProps<"Stats">) {
  const {
    theme: { colors, spacing },
  } = useAppTheme()
  const { statsStore } = useStores()

  const topLocations = statsStore.topLocations.slice(0, 5) // Top 5 locations

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      {/* Background Decorations */}
      <BackgroundDecorations />

      {/* Header */}
      <View style={$header}>
        <Text preset="heading" text="Your Progress" />
      </View>

      {/* Hero Section - Top Stats Layout */}
      <View style={$heroSection}>
        {/* Left: Profile Circle with Encounters Inside */}
        <View style={$profileCircle}>
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
            <Text text="🐾" style={{ fontSize: 20, marginTop: 2, marginBottom: 2 }} />
            <Text text="encounters" style={[$circleLabel, { color: colors.textDim }]} />
          </View>
        </View>

        {/* Right: Streak and Achievements Cards */}
        <View style={$rightSection}>
          {/* Streak Card - Blue */}
          <View
            style={[
              $statCard,
              {
                backgroundColor: "#7DB3E8",
                marginBottom: spacing.sm,
              },
            ]}
          >
            <View style={$cardRow}>
              <Text text="🔥" style={{ fontSize: 24, marginRight: 10 }} />
              <Text
                preset="bold"
                text={`${statsStore.currentStreak} Day Streak`}
                style={[$cardValueInline, { color: "#FFFFFF" }]}
              />
            </View>
          </View>

          {/* Achievements Card - Red */}
          <View
            style={[
              $statCard,
              {
                backgroundColor: "#E88888",
              },
            ]}
          >
            <View style={$cardRow}>
              <Text text="⭐" style={{ fontSize: 24, marginRight: 10 }} />
              <Text
                preset="bold"
                text={`${statsStore.achievementCount}/8 Achievements`}
                style={[$cardValueInline, { color: "#FFFFFF" }]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Pet Types Distribution - Only show if there are encounters */}
      {statsStore.totalEncounters > 0 && (
        <View style={$section}>
          <Text preset="subheading" text="Pet Types" style={{ marginBottom: spacing.md }} />

          {/* Pet Type Cards with Progress Bars */}
          <View style={$petTypeCardsContainer}>
            {/* Cats Card */}
            {statsStore.catCount > 0 && (
              <View style={$petTypeCard}>
                <View style={$petTypeHeader}>
                  <Text style={$petTypeEmoji}>🐱</Text>
                  <View style={$petTypeInfo}>
                    <Text preset="bold" text="Cats" style={$petTypeLabel} />
                    <Text text={`${statsStore.catPercentage}%`} style={$petTypePercentage} />
                  </View>
                  <Text style={$petTypeCount}>{statsStore.catCount}</Text>
                </View>
                <View
                  style={[
                    $progressBarContainer,
                    { backgroundColor: colors.palette.primary100 },
                  ]}
                >
                  <View
                    style={[
                      $progressBar,
                      {
                        width: `${statsStore.catPercentage}%`,
                        backgroundColor: colors.palette.primary500,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Dogs Card */}
            {statsStore.dogCount > 0 && (
              <View style={$petTypeCard}>
                <View style={$petTypeHeader}>
                  <Text style={$petTypeEmoji}>🐶</Text>
                  <View style={$petTypeInfo}>
                    <Text preset="bold" text="Dogs" style={$petTypeLabel} />
                    <Text text={`${statsStore.dogPercentage}%`} style={$petTypePercentage} />
                  </View>
                  <Text style={$petTypeCount}>{statsStore.dogCount}</Text>
                </View>
                <View
                  style={[
                    $progressBarContainer,
                    { backgroundColor: colors.palette.secondary100 },
                  ]}
                >
                  <View
                    style={[
                      $progressBar,
                      {
                        width: `${statsStore.dogPercentage}%`,
                        backgroundColor: colors.palette.secondary500,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Other Pets Card */}
            {statsStore.otherCount > 0 && (
              <View style={$petTypeCard}>
                <View style={$petTypeHeader}>
                  <Text style={$petTypeEmoji}>🐾</Text>
                  <View style={$petTypeInfo}>
                    <Text preset="bold" text="Other" style={$petTypeLabel} />
                    <Text text={`${Math.round((statsStore.otherCount / statsStore.totalEncounters) * 100)}%`} style={$petTypePercentage} />
                  </View>
                  <Text style={$petTypeCount}>{statsStore.otherCount}</Text>
                </View>
                <View
                  style={[
                    $progressBarContainer,
                    { backgroundColor: colors.palette.accent100 },
                  ]}
                >
                  <View
                    style={[
                      $progressBar,
                      {
                        width: `${Math.round((statsStore.otherCount / statsStore.totalEncounters) * 100)}%`,
                        backgroundColor: colors.palette.accent500,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Unknown Card */}
            {statsStore.totalEncounters - statsStore.catCount - statsStore.dogCount - statsStore.otherCount > 0 && (
              <View style={$petTypeCard}>
                <View style={$petTypeHeader}>
                  <Text style={$petTypeEmoji}>❓</Text>
                  <View style={$petTypeInfo}>
                    <Text preset="bold" text="Unknown" style={$petTypeLabel} />
                    <Text text={`${Math.round(((statsStore.totalEncounters - statsStore.catCount - statsStore.dogCount - statsStore.otherCount) / statsStore.totalEncounters) * 100)}%`} style={$petTypePercentage} />
                  </View>
                  <Text style={$petTypeCount}>{statsStore.totalEncounters - statsStore.catCount - statsStore.dogCount - statsStore.otherCount}</Text>
                </View>
                <View
                  style={[
                    $progressBarContainer,
                    { backgroundColor: colors.palette.neutral300 },
                  ]}
                >
                  <View
                    style={[
                      $progressBar,
                      {
                        width: `${Math.round(((statsStore.totalEncounters - statsStore.catCount - statsStore.dogCount - statsStore.otherCount) / statsStore.totalEncounters) * 100)}%`,
                        backgroundColor: colors.palette.neutral500,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Insights Cards */}
          <View style={$insightsContainer}>
            {/* Favorite Pet Insight */}
            <View style={[$insightCard, { backgroundColor: colors.palette.primary100 }]}>
              <Text style={$insightEmoji}>💡</Text>
              <View style={$insightText}>
                <Text preset="bold" text="Your favorite" style={$insightLabel} />
                <Text
                  text={`${statsStore.catCount > statsStore.dogCount ? statsStore.catCount > statsStore.otherCount ? "Cats" : "Other" : statsStore.dogCount > statsStore.otherCount ? "Dogs" : "Other"} (${Math.max(statsStore.catCount, statsStore.dogCount, statsStore.otherCount)} logged)`}
                  style={$insightValue}
                />
              </View>
            </View>

            {/* Top Location Insight */}
            {statsStore.topLocations.length > 0 && (
              <View style={[$insightCard, { backgroundColor: colors.palette.secondary100 }]}>
                <Text style={$insightEmoji}>📍</Text>
                <View style={$insightText}>
                  <Text preset="bold" text="Most visited" style={$insightLabel} />
                  <Text
                    text={`${statsStore.topLocations[0].location} (${statsStore.topLocations[0].count})`}
                    style={$insightValue}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Empty State for No Encounters */}
      {statsStore.totalEncounters === 0 && (
        <View style={[$emptyState, { backgroundColor: colors.palette.neutral100 }]}>
          <Text style={$emptyIcon} text="📊" />
          <Text preset="subheading" text="No Stats Yet" style={{ marginBottom: spacing.xs }} />
          <Text
            style={[$emptyText, { color: colors.textDim }]}
            text="Start capturing encounters to see your progress!"
          />
        </View>
      )}

      {/* Achievements Section */}
      <View style={$section}>
        <Text preset="subheading" text="Achievements" style={{ marginBottom: spacing.md }} />
        <View style={$achievementsGrid}>
          {statsStore.achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              icon={achievement.icon}
              name={achievement.name}
              description={achievement.description}
              isUnlocked={achievement.isUnlocked}
              progress={achievement.progress}
            />
          ))}
        </View>
      </View>

      {/* Top Locations - Only show if there are locations */}
      {topLocations.length > 0 && (
        <View style={$section}>
          <Text preset="subheading" text="Top Locations" style={{ marginBottom: spacing.md }} />
          {topLocations.map((item, index) => (
            <View
              key={item.location}
              style={[
                $locationRow,
                {
                  backgroundColor: colors.palette.neutral100,
                  borderBottomColor: colors.separator,
                  borderBottomWidth: index < topLocations.length - 1 ? 1 : 0,
                },
              ]}
            >
              <View style={$locationInfo}>
                <Text text="📍" style={{ marginRight: spacing.xs }} />
                <Text text={item.location} style={{ flex: 1, color: colors.text }} />
              </View>
              <View style={[$locationBadge, { backgroundColor: colors.palette.primary100 }]}>
                <Text
                  style={{ color: colors.palette.primary600, fontSize: 12, fontWeight: "600" }}
                  text={String(item.count)}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  )
})

const $container: ViewStyle = {
  paddingBottom: 100, // Extra space for tab bar
}

const $header: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
}

const $heroSection: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 24,
  gap: 12,
}

const $profileCircle: ViewStyle = {
  flex: 0,
  width: "32%",
  alignItems: "center",
  justifyContent: "center",
}

const $circleContent: ViewStyle = {
  width: 140,
  height: 140,
  borderRadius: 70,
  borderWidth: 2,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 10,
  paddingVertical: 8,
}

const $circleNumber: TextStyle = {
  fontSize: 44,
  fontWeight: "700",
  lineHeight: 48,
}

const $circleLabel: TextStyle = {
  fontSize: 11,
  marginTop: 0,
  lineHeight: 14,
  fontWeight: "500",
}

const $rightSection: ViewStyle = {
  flex: 1.2,
  justifyContent: "center",
  gap: 8,
}

const $statCard: ViewStyle = {
  borderRadius: 12,
  padding: 16,
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}

const $cardRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
}

const $cardValueInline: TextStyle = {
  fontSize: 16,
  fontWeight: "700",
}

const $statsGrid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  paddingHorizontal: 8,
  gap: 8,
  marginBottom: 16,
}

const $section: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 24,
}

const $petTypeCardsContainer: ViewStyle = {
  gap: 12,
  marginBottom: 20,
}

const $petTypeCard: ViewStyle = {
  gap: 10,
}

const $petTypeHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
}

const $petTypeEmoji: TextStyle = {
  fontSize: 24,
}

const $petTypeInfo: ViewStyle = {
  flex: 1,
  gap: 2,
}

const $petTypeLabel: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
}

const $petTypePercentage: TextStyle = {
  fontSize: 12,
}

const $petTypeCount: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  minWidth: 30,
}

const $progressBarContainer: ViewStyle = {
  height: 8,
  borderRadius: 4,
  overflow: "hidden",
}

const $progressBar: ViewStyle = {
  height: "100%",
  borderRadius: 4,
}

const $insightsContainer: ViewStyle = {
  gap: 10,
  marginTop: 12,
}

const $insightCard: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  padding: 12,
  borderRadius: 10,
}

const $insightEmoji: TextStyle = {
  fontSize: 20,
}

const $insightText: ViewStyle = {
  flex: 1,
  gap: 2,
}

const $insightLabel: TextStyle = {
  fontSize: 12,
  fontWeight: "600",
}

const $insightValue: TextStyle = {
  fontSize: 13,
  fontWeight: "500",
}

const $emptyState: ViewStyle = {
  marginHorizontal: 16,
  marginTop: 24,
  padding: 32,
  borderRadius: 12,
  alignItems: "center",
}

const $emptyIcon: TextStyle = {
  fontSize: 48,
  marginBottom: 16,
}

const $emptyText: TextStyle = {
  textAlign: "center",
  fontSize: 14,
}

const $achievementsGrid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
}

const $locationRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 12,
  borderRadius: 8,
  marginBottom: 8,
}

const $locationInfo: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
}

const $locationBadge: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
  minWidth: 32,
  alignItems: "center",
}
