import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * User preferences model
 */
const UserPreferences = types.model("UserPreferences", {
  notificationsEnabled: types.optional(types.boolean, true),
  theme: types.optional(types.enumeration(["light", "dark", "system"]), "system"),
  language: types.optional(types.string, "en"),
})

/**
 * User model representing the authenticated user
 */
export const UserStoreModel = types
  .model("UserStore", {
    id: types.maybe(types.string),
    email: types.maybe(types.string),
    name: types.maybe(types.string),
    avatar: types.maybe(types.string),
    preferences: types.optional(UserPreferences, {}),
  })
  .views((self) => ({
    /**
     * Check if user is authenticated
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
  }))
  .actions((self) => ({
    /**
     * Set the authenticated user
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
     * Clear user data (logout)
     */
    logout() {
      self.id = undefined
      self.email = undefined
      self.name = undefined
      self.avatar = undefined
      self.preferences = UserPreferences.create({})
    },
  }))

export interface IUserStore extends Instance<typeof UserStoreModel> {}
export interface IUserStoreSnapshotIn extends SnapshotIn<typeof UserStoreModel> {}
export interface IUserStoreSnapshotOut extends SnapshotOut<typeof UserStoreModel> {}
