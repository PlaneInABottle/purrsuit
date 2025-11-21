import { View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"

import { Card } from "./Card"
import { Text } from "./Text"

export interface StatCardProps {
  /**
   * The main value to display
   */
  value: string | number
  /**
   * Label text below the value
   */
  label: string
  /**
   * Optional color for the value text
   */
  color?: string
  /**
   * Optional emoji icon to display
   */
  icon?: string
  /**
   * Optional style override
   */
  style?: ViewStyle
}

/**
 * StatCard component displays a single statistic with a value and label
 */
export function StatCard({ value, label, color, icon, style }: StatCardProps) {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Card
      style={[$card, style]}
      ContentComponent={
        <View style={$content}>
          {icon && <Text style={$icon} text={icon} />}
          <Text preset="subheading" text={String(value)} style={{ color: color || colors.text }} />
          <Text text={label} style={[$label, { color: colors.textDim }]} />
        </View>
      }
    />
  )
}

const $card: ViewStyle = {
  flex: 1,
  minWidth: "30%",
}

const $content: ViewStyle = {
  alignItems: "center",
  padding: 16,
  gap: 4,
}

const $icon: TextStyle = {
  fontSize: 24,
  marginBottom: 4,
}

const $label: TextStyle = {
  fontSize: 12,
  marginTop: 2,
}
