import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { PieChart } from "react-native-gifted-charts"
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

  // Prepare pie chart data with cohesive pastel colors
  const getPieChartData = () => {
    const data = []

    if (statsStore.catCount > 0) {
      data.push({
        value: statsStore.catCount,
        color: colors.palette.primary500, // Coral #FF8A80
        text: `${statsStore.catPercentage}%`,
        label: "🐱 Cats",
        textColor: "#FFFFFF",
        textSize: 13,
        fontWeight: "600",
      })
    }

    if (statsStore.dogCount > 0) {
      data.push({
        value: statsStore.dogCount,
        color: colors.palette.secondary500, // Lavender #9575CD
        text: `${statsStore.dogPercentage}%`,
        label: "🐶 Dogs",
        textColor: "#FFFFFF",
        textSize: 13,
        fontWeight: "600",
      })
    }

    if (statsStore.otherCount > 0) {
      const otherPercentage = Math.round((statsStore.otherCount / statsStore.totalEncounters) * 100)
      data.push({
        value: statsStore.otherCount,
        color: colors.palette.accent500, // Sunny yellow #FFD54F
        text: `${otherPercentage}%`,
        label: "🐾 Other",
        textColor: "#5A4A00", // Dark gold for contrast
        textSize: 13,
        fontWeight: "600",
      })
    }

    const unknownCount =
      statsStore.totalEncounters - statsStore.catCount - statsStore.dogCount - statsStore.otherCount
    if (unknownCount > 0) {
      const unknownPercentage = Math.round((unknownCount / statsStore.totalEncounters) * 100)
      data.push({
        value: unknownCount,
        color: colors.palette.neutral500, // Medium gray #9B9497
        text: `${unknownPercentage}%`,
        label: "❓ Unknown",
        textColor: "#FFFFFF",
        textSize: 13,
        fontWeight: "600",
      })
    }

    return data
  }

  const pieData = getPieChartData()
  const topLocations = statsStore.topLocations.slice(0, 5) // Top 5 locations

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      {/* Background Decorations */}
      <BackgroundDecorations />

      {/* Header */}
      <View style={$header}>
        <Text preset="heading" text="Your Progress" />
      </View>

      {/* Top Stats Cards */}
      <View style={$statsGrid}>
        <StatCard
          value={statsStore.totalEncounters}
          label="Encounters"
          color={colors.palette.primary500}
          icon="📸"
        />
        <StatCard
          value={
            statsStore.hasActiveStreak ? `${statsStore.currentStreak}🔥` : statsStore.currentStreak
          }
          label="Day Streak"
          color={colors.palette.secondary500}
          icon="🎯"
        />
        <StatCard
          value={`${statsStore.achievementCount}/8`}
          label="Badges"
          color={colors.palette.accent500}
          icon="⭐"
        />
      </View>

      {/* Pet Type Distribution - Only show if there are encounters */}
      {statsStore.totalEncounters > 0 && pieData.length > 0 && (
        <View style={$section}>
          <Text preset="subheading" text="Pet Types" style={{ marginBottom: spacing.md }} />
          <View style={$chartContainer}>
            <PieChart
              data={pieData}
              donut
              innerRadius={60}
              radius={90}
              centerLabelComponent={() => (
                <View style={$centerLabel}>
                  <Text
                    preset="bold"
                    style={[$centerValue, { color: colors.palette.neutral700 }]}
                    text={String(statsStore.totalEncounters)}
                  />
                  <Text style={[$centerText, { color: colors.textDim }]} text="total" />
                </View>
              )}
              showText
              focusOnPress
              innerCircleColor={colors.background}
              innerCircleBorderWidth={2}
              innerCircleBorderColor={colors.palette.neutral300}
            />
          </View>

          {/* Legend */}
          <View style={$legend}>
            {pieData.map((item, index) => (
              <View key={index} style={$legendItem}>
                <View style={[$legendDot, { backgroundColor: item.color }]} />
                <Text style={[$legendText, { color: colors.text }]} text={item.label} />
              </View>
            ))}
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

const $chartContainer: ViewStyle = {
  alignItems: "center",
  paddingVertical: 20,
}

const $centerLabel: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $centerValue: TextStyle = {
  fontSize: 32,
  fontWeight: "700",
}

const $centerText: TextStyle = {
  fontSize: 12,
  marginTop: 2,
}

const $legend: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 16,
  marginTop: 16,
}

const $legendItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
}

const $legendDot: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 6,
}

const $legendText: TextStyle = {
  fontSize: 14,
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
