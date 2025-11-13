import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { UserStoreModel } from "./UserStore"
import { UiStoreModel } from "./UiStore"

/**
 * RootStore combines all stores and provides the environment for dependency injection
 */
export const RootStoreModel = types
  .model("RootStore", {
    userStore: types.optional(UserStoreModel, {}),
    uiStore: types.optional(UiStoreModel, {}),
  })
  .actions((self) => ({
    /**
     * Reset all stores to initial state
     */
    reset() {
      self.userStore.logout()
      self.uiStore.clearError()
      self.uiStore.closeModal()
      self.uiStore.setLoading(false)
    },
  }))

export interface IRootStore extends Instance<typeof RootStoreModel> {}
export interface IRootStoreSnapshotIn extends SnapshotIn<typeof RootStoreModel> {}
export interface IRootStoreSnapshotOut extends SnapshotOut<typeof RootStoreModel> {}
