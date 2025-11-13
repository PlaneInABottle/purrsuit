import React from "react"
import { Text, TextStyle } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { HomeScreen } from "@/screens/HomeScreen"
import { CaptureScreen } from "@/screens/CaptureScreen"
import { StatsScreen } from "@/screens/StatsScreen"
import { useAppTheme } from "@/theme/context"
import type { MainTabParamList } from "./navigationTypes"

const Tab = createBottomTabNavigator<MainTabParamList>()

export const MainTabNavigator = () => {
  const {
    theme: { colors },
  } = useAppTheme()
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.palette.neutral100,
          borderTopColor: colors.separator,
          borderTopWidth: 1,
          paddingTop: 8,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          // Subtle shadow for depth
          shadowColor: colors.palette.neutral800,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: $tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Capture"
        component={CaptureScreen}
        options={{
          tabBarLabel: "Capture",
          tabBarIcon: ({ color }) => <TabIcon icon="📸" color={color} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: "Stats",
          tabBarIcon: ({ color }) => <TabIcon icon="📊" color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

// Simple emoji icon component
const TabIcon = ({ icon, color }: { icon: string; color: string }) => (
  <Text style={{ fontSize: 24, color }}>{icon}</Text>
)

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontWeight: "500",
  marginBottom: 4,
}
