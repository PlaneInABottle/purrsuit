/**
 * Example Usage of MobX State Tree in Components
 *
 * This file demonstrates how to use the MST stores in your React components.
 * You can delete this file once you're familiar with the patterns.
 */

import { observer } from "mobx-react-lite"
import { View, Text, Button } from "react-native"
import { useStores } from "@/models"

/**
 * Example 1: Basic usage with observer
 * The observer HOC makes the component reactive to store changes
 */
export const UserProfileScreen = observer(() => {
  const { userStore } = useStores()

  return (
    <View>
      <Text>Welcome, {userStore.displayName}!</Text>
      <Text>Email: {userStore.email}</Text>
      <Text>Status: {userStore.isAuthenticated ? "Logged in" : "Guest"}</Text>

      <Button title="Logout" onPress={() => userStore.logout()} />
    </View>
  )
})

/**
 * Example 2: Using UI store for loading states
 */
export const LoadingExample = observer(() => {
  const { uiStore } = useStores()

  return (
    <View>
      {uiStore.isLoading && <Text>Loading...</Text>}
      {uiStore.hasError && <Text>Error: {uiStore.errorMessage}</Text>}

      <Button
        title="Simulate Loading"
        onPress={() => {
          uiStore.setLoading(true)
          setTimeout(() => uiStore.setLoading(false), 2000)
        }}
      />
    </View>
  )
})

/**
 * Example 3: Async actions with flow (to be added to your stores)
 *
 * In your store, define async actions like this:
 *
 * ```typescript
 * import { flow } from "mobx-state-tree"
 *
 * .actions((self) => ({
 *   fetchUser: flow(function* (userId: string) {
 *     self.isLoading = true
 *     try {
 *       const response = yield getEnv(self).api.getUser(userId)
 *       if (response.ok) {
 *         self.setUser(response.data)
 *       }
 *     } catch (error) {
 *       self.errorMessage = error.message
 *     } finally {
 *       self.isLoading = false
 *     }
 *   })
 * }))
 * ```
 */

/**
 * Example 4: Accessing multiple stores
 */
export const DashboardScreen = observer(() => {
  const { userStore, uiStore } = useStores()

  return (
    <View>
      <Text>User: {userStore.displayName}</Text>
      {uiStore.isLoading && <Text>Loading...</Text>}
    </View>
  )
})

/**
 * Example 5: Using store preferences
 */
export const SettingsScreen = observer(() => {
  const { userStore } = useStores()

  return (
    <View>
      <Text>Theme: {userStore.preferences.theme}</Text>
      <Text>Notifications: {userStore.preferences.notificationsEnabled ? "On" : "Off"}</Text>

      <Button
        title="Toggle Notifications"
        onPress={() => {
          userStore.updatePreferences({
            notificationsEnabled: !userStore.preferences.notificationsEnabled,
          })
        }}
      />
    </View>
  )
})

/**
 * Tips:
 *
 * 1. Always wrap components that read from stores with observer()
 * 2. Only components that read from stores need to be observers
 * 3. You can use observer on the entire screen or just small sub-components
 * 4. For better performance, wrap smaller components instead of entire screens
 * 5. Use computed values (views) for derived data instead of calculating in render
 * 6. Actions should be the only way to modify store state
 * 7. Use flow() for async actions that need to be tracked
 */
