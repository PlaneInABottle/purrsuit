import { useMemo } from "react"
import { TextStyle } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Home, Camera, MapPin, Settings } from "lucide-react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { CaptureScreen } from "@/screens/CaptureScreen"
import { HomeScreen } from "@/screens/HomeScreen"
import { MapScreen } from "@/screens/MapScreen"
import { ProfileScreen } from "@/screens/ProfileScreen"
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
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Capture"
        component={CaptureScreen}
        options={{
          tabBarLabel: "Capture",
          tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color }) => <MapPin size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontWeight: "500",
  marginBottom: 4,
}
