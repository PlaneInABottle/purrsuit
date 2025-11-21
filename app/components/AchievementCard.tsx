import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"

import { useAppTheme } from "@/theme/context"

import { Card } from "./Card"
import { Text } from "./Text"

export interface AchievementCardProps {
  /**
   * Achievement icon (emoji)
   */
  icon: string
  /**
   * Achievement name
   */
  name: string
  /**
   * Achievement description
   */
  description: string
  /**
   * Whether the achievement is unlocked
   */
  isUnlocked: boolean
  /**
   * Progress percentage (0-100)
   */
  progress: number
  /**
   * Optional press handler
   */
  onPress?: () => void
  /**
   * Optional style override
   */
  style?: ViewStyle
}

/**
 * AchievementCard component displays an achievement badge with progress
 */
export function AchievementCard({
  icon,
  name,
  description,
  isUnlocked,
  progress,
  onPress,
  style,
}: AchievementCardProps) {
  const {
    theme: { colors, spacing },
  } = useAppTheme()

  const cardContent = (
    <View style={$content}>
      {/* Badge Icon */}
      <View
        style={[
          $iconContainer,
          {
            backgroundColor: isUnlocked ? colors.palette.primary100 : colors.palette.neutral200,
          },
        ]}
      >
        <Text style={[$icon, { opacity: isUnlocked ? 1 : 0.6 }]} text={icon} />
      </View>

      {/* Badge Info */}
      <View style={$info}>
        <Text
          preset="bold"
          text={name}
          style={[
            $name,
            {
              color: isUnlocked ? colors.text : colors.textDim,
            },
          ]}
        />
        <Text
          text={description}
          style={[$description, { color: colors.textDim }]}
          numberOfLines={2}
        />

        {/* Progress Bar for Locked Badges */}
        {!isUnlocked && (
          <View style={{ marginTop: spacing.xs }}>
            <View style={[$progressBar, { backgroundColor: colors.palette.neutral200 }]}>
              <View
                style={[
                  $progressFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: colors.palette.primary400,
                  },
                ]}
              />
            </View>
            <Text style={[$progressText, { color: colors.textDim }]} text={`${progress}%`} />
          </View>
        )}

        {/* Unlocked Badge */}
        {isUnlocked && (
          <View style={$unlockedBadge}>
            <Text style={$unlockedText} text="✓ UNLOCKED" />
          </View>
        )}
      </View>
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[$card, style]}>
        <Card ContentComponent={cardContent} />
      </TouchableOpacity>
    )
  }

  return <Card style={[$card, style]} ContentComponent={cardContent} />
}

const $card: ViewStyle = {
  flex: 1,
  minWidth: "45%",
  marginBottom: 12,
}

const $content: ViewStyle = {
  flexDirection: "row",
  padding: 12,
  gap: 12,
  alignItems: "flex-start",
}

const $iconContainer: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  alignItems: "center",
  justifyContent: "center",
}

const $icon: TextStyle = {
  fontSize: 24,
}

const $info: ViewStyle = {
  flex: 1,
}

const $name: TextStyle = {
  fontSize: 14,
  marginBottom: 2,
}

const $description: TextStyle = {
  fontSize: 12,
  lineHeight: 16,
}

const $progressBar: ViewStyle = {
  height: 4,
  borderRadius: 2,
  overflow: "hidden",
}

const $progressFill: ViewStyle = {
  height: "100%",
  borderRadius: 2,
}

const $progressText: TextStyle = {
  fontSize: 10,
  marginTop: 4,
  textAlign: "right",
}

const $unlockedBadge: ViewStyle = {
  marginTop: 4,
}

const $unlockedText: TextStyle = {
  color: "#6B4226",
  fontSize: 10,
}
