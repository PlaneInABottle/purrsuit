import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * User preferences model for Purrsuit
 */
const UserPreferences = types.model("UserPreferences", {
  // Privacy
  locationPermission: types.optional(types.enumeration(["none", "manual", "gps"]), "manual"),
  askForLocationEachTime: types.optional(types.boolean, false),

  // Display
  theme: types.optional(types.enumeration(["light", "dark", "system"]), "system"),
  gridColumns: types.optional(types.union(types.literal(2), types.literal(3), types.literal(4)), 3),
  defaultView: types.optional(types.enumeration(["grid", "list", "timeline"]), "grid"),

  // Capture
  autoSavePhotos: types.optional(types.boolean, false),
  photoQuality: types.optional(types.enumeration(["high", "medium", "low"]), "high"),
  alwaysShowStickers: types.optional(types.boolean, true),

  // Premium (Phase 2)
  subscriptionStatus: types.optional(types.enumeration(["free", "premium"]), "free"),
  cloudBackupEnabled: types.optional(types.boolean, false),
  aiRecognitionEnabled: types.optional(types.boolean, false),
})

/**
 * User model representing the authenticated user and app preferences
 */
export const UserStoreModel = types
  .model("UserStore", {
    // User profile (for Phase 2 - optional cloud features)
    id: types.maybe(types.string),
    email: types.maybe(types.string),
    name: types.maybe(types.string),
    avatar: types.maybe(types.string),

    // App preferences (local, always available)
    preferences: types.optional(UserPreferences, {}),

    // Onboarding
    hasCompletedOnboarding: types.optional(types.boolean, false),
  })
  .views((self) => ({
    /**
     * Check if user is authenticated (Phase 2 feature)
     */
    get isAuthenticated() {
      return !!self.id
    },
    /**
     * Get display name with fallback
     */
    get displayName() {
      return self.name || self.email?.split("@")[0] || "Guest"
    },
    /**
     * Check if location features are enabled
     */
    get isLocationEnabled() {
      return self.preferences.locationPermission !== "none"
    },
    /**
     * Check if GPS is enabled
     */
    get isGPSEnabled() {
      return self.preferences.locationPermission === "gps"
    },
    /**
     * Check if premium features are available
     */
    get isPremium() {
      return self.preferences.subscriptionStatus === "premium"
    },
  }))
  .actions((self) => ({
    /**
     * Set the authenticated user (Phase 2)
     */
    setUser(user: { id: string; email: string; name?: string; avatar?: string }) {
      self.id = user.id
      self.email = user.email
      self.name = user.name
      self.avatar = user.avatar
    },
    /**
     * Update user preferences
     */
    updatePreferences(preferences: Partial<SnapshotIn<typeof UserPreferences>>) {
      self.preferences = { ...self.preferences, ...preferences } as any
    },
    /**
     * Set location permission
     */
    setLocationPermission(permission: "none" | "manual" | "gps") {
      self.preferences.locationPermission = permission
    },
    /**
     * Complete onboarding
     */
    completeOnboarding() {
      self.hasCompletedOnboarding = true
    },
    /**
     * Clear user data (logout)
     */
    logout() {
      self.id = undefined
      self.email = undefined
      self.name = undefined
      self.avatar = undefined
    },
  }))

export interface IUserStore extends Instance<typeof UserStoreModel> {}
export interface IUserStoreSnapshotIn extends SnapshotIn<typeof UserStoreModel> {}
export interface IUserStoreSnapshotOut extends SnapshotOut<typeof UserStoreModel> {}
