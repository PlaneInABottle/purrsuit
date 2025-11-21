/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"

import Config from "@/config"
import { useStores } from "@/models"
import { EncounterDetailScreen } from "@/screens/EncounterDetailScreen"
import { EncounterEditScreen } from "@/screens/EncounterEditScreen"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { LegalScreen } from "@/screens/LegalScreen"
import { PhotoEditScreen } from "@/screens/PhotoEditScreen"
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { useAppTheme } from "@/theme/context"
import { routingInstrumentation } from "@/utils/crashReporting"

import { MainTabNavigator } from "./MainTabNavigator"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(() => {
  const {
    theme: { colors },
  } = useAppTheme()
  const { userStore } = useStores()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      {/* Welcome/Onboarding */}
      {!userStore.hasCompletedOnboarding && (
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      )}

      {/* Main App Flow - Bottom Tabs */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      {/* Modal Screens */}
      <Stack.Screen
        name="EncounterEdit"
        component={EncounterEditScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="EncounterDetail"
        component={EncounterDetailScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="PhotoEdit"
        component={PhotoEditScreen}
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="Legal" component={LegalScreen} />

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      onReady={() => {
        if (routingInstrumentation) {
          routingInstrumentation.registerNavigationContainer(navigationRef)
        }
      }}
      {...props}
    >
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
