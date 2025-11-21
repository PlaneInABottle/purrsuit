import { Instance, SnapshotIn, SnapshotOut, types, getRoot } from "mobx-state-tree"

import { EncounterModel } from "./EncounterStore"
import { StatsStoreModel } from "./StatsStore"
import { StickerStoreModel } from "./StickerStore"
import { UiStoreModel } from "./UiStore"
import { UserStoreModel } from "./UserStore"

/**
 * Encounters collection store
 * Manages the collection of all pet encounters
 */
const EncountersStoreModel = types
  .model("EncountersStore", {
    encounters: types.optional(types.map(EncounterModel), {}),
    recentLocationTags: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    /**
     * Get all encounters as array, sorted by timestamp (newest first)
     */
    get encountersArray() {
      return Array.from(self.encounters.values()).sort((a, b) => b.timestamp - a.timestamp)
    },
    /**
     * Get encounter by ID
     */
    getById(id: string) {
      return self.encounters.get(id)
    },
    /**
     * Get total encounter count
     */
    get count() {
      return self.encounters.size
    },
    /**
     * Get encounters by pet type
     */
    getByPetType(petType: "cat" | "dog" | "other") {
      return this.encountersArray.filter((e) => e.petType === petType)
    },
    /**
     * Get encounters with location
     */
    get encountersWithLocation() {
      return this.encountersArray.filter((e) => e.hasLocation)
    },
    /**
     * Get encounters filtered by time range
     * @param hours Number of hours to look back, or 'all' for all time
     */
    getEncountersByTimeRange(hours: number | "all") {
      if (hours === "all") return this.encountersArray

      const cutoffTime = Date.now() - hours * 60 * 60 * 1000
      return this.encountersArray.filter((encounter) => encounter.timestamp >= cutoffTime)
    },
  }))
  .actions((self) => ({
    /**
     * Add new encounter
     */
    addEncounter(encounter: SnapshotIn<typeof EncounterModel>) {
      self.encounters.put(encounter)

      // Record in stats store
      const rootStore = getRoot<IRootStore>(self)
      const location = encounter.location?.type === "manual" ? encounter.location.label : undefined
      rootStore.statsStore.recordEncounter(encounter.petType as "cat" | "dog" | "other", location)

      // Update recent location tags
      if (encounter.location?.label && encounter.location.type === "manual") {
        const label = encounter.location.label
        if (!self.recentLocationTags.includes(label)) {
          self.recentLocationTags.unshift(label)
          // Keep only 10 most recent
          if (self.recentLocationTags.length > 10) {
            self.recentLocationTags.splice(10)
          }
        }
      }
    },
    /**
     * Remove encounter
     */
    removeEncounter(id: string) {
      self.encounters.delete(id)
    },
    /**
     * Clear all encounters
     */
    clearAll() {
      self.encounters.clear()
      self.recentLocationTags.clear()
    },
  }))

/**
 * RootStore combines all stores and provides the environment for dependency injection
 */
export const RootStoreModel = types
  .model("RootStore", {
    userStore: types.optional(UserStoreModel, {}),
    uiStore: types.optional(UiStoreModel, {}),
    encountersStore: types.optional(EncountersStoreModel, {}),
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
