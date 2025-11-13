import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * UI state model for managing global UI concerns like loading states,
 * errors, and modal visibility
 */
export const UiStoreModel = types
  .model("UiStore", {
    isLoading: types.optional(types.boolean, false),
    errorMessage: types.maybe(types.string),
    isModalOpen: types.optional(types.boolean, false),
    modalContent: types.maybe(types.string),
  })
  .views((self) => ({
    /**
     * Check if there's an active error
     */
    get hasError() {
      return !!self.errorMessage
    },
  }))
  .actions((self) => ({
    /**
     * Set loading state
     */
    setLoading(loading: boolean) {
      self.isLoading = loading
    },
    /**
     * Show an error message
     */
    showError(message: string) {
      self.errorMessage = message
    },
    /**
     * Clear error message
     */
    clearError() {
      self.errorMessage = undefined
    },
    /**
     * Open a modal with optional content
     */
    openModal(content?: string) {
      self.isModalOpen = true
      self.modalContent = content
    },
    /**
     * Close the modal
     */
    closeModal() {
      self.isModalOpen = false
      self.modalContent = undefined
    },
  }))

export interface IUiStore extends Instance<typeof UiStoreModel> {}
export interface IUiStoreSnapshotIn extends SnapshotIn<typeof UiStoreModel> {}
export interface IUiStoreSnapshotOut extends SnapshotOut<typeof UiStoreModel> {}
