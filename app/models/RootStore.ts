import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

import { EncounterStoreModel } from "./EncounterStore"
import { StatsStoreModel } from "./StatsStore"
import { StickerStoreModel } from "./StickerStore"
import { UiStoreModel } from "./UiStore"
import { UserStoreModel } from "./UserStore"

/**
 * RootStore combines all stores and provides the environment for dependency injection
 */
export const RootStoreModel = types
  .model("RootStore", {
    userStore: types.optional(UserStoreModel, {}),
    uiStore: types.optional(UiStoreModel, {}),
    encountersStore: types.optional(EncounterStoreModel, {}),
    statsStore: types.optional(StatsStoreModel, {}),
    stickerStore: types.optional(StickerStoreModel, {}),
  })
  .actions((self) => ({
    /**
     * Initialize stores with default data
     */
    afterCreate() {
      // Initialize stickers and achievements if empty
      if (self.stickerStore.stickers.length === 0) {
        self.stickerStore.initializeStickers()
      }
      if (self.statsStore.achievements.length === 0) {
        self.statsStore.initializeAchievements()
      }
    },
    /**
     * Reset all stores to initial state
     */
    reset() {
      self.userStore.logout()
      self.uiStore.clearError()
      self.uiStore.closeModal()
      self.uiStore.setLoading(false)
      self.encountersStore.clearAll()
      self.statsStore.reset()
    },
  }))

export interface IRootStore extends Instance<typeof RootStoreModel> {}
export interface IRootStoreSnapshotIn extends SnapshotIn<typeof RootStoreModel> {}
export interface IRootStoreSnapshotOut extends SnapshotOut<typeof RootStoreModel> {}
