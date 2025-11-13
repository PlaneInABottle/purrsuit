import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Photo references for an encounter
 */
const Photo = types.model("Photo", {
  original: types.string, // File path to original image
  thumbnail: types.string, // File path to thumbnail
})

/**
 * Location information for an encounter
 */
const Location = types.model("Location", {
  type: types.enumeration(["none", "manual", "gps"]),
  label: types.maybe(types.string), // "Coffee shop on 5th"
  coordinates: types.maybe(
    types.model({
      latitude: types.number,
      longitude: types.number,
    }),
  ),
})

/**
 * Sticker overlay on a photo
 */
const Sticker = types.model("Sticker", {
  id: types.string, // Sticker asset ID
  position: types.model({
    x: types.number, // X position (0-1 normalized)
    y: types.number, // Y position (0-1 normalized)
  }),
  scale: types.optional(types.number, 1), // Scale factor
  rotation: types.optional(types.number, 0), // Rotation in degrees
})

/**
 * A single pet encounter - the core data model of Purrsuit
 */
export const EncounterModel = types
  .model("Encounter", {
    id: types.identifier,
    timestamp: types.number,
    photos: Photo,

    // Pet Information
    petType: types.enumeration(["cat", "dog", "other", "unknown"]),
    mood: types.optional(types.array(types.string), []), // ["happy", "playful"]
    tags: types.optional(types.array(types.string), []), // ["fluffy", "orange"]

    // Location
    location: types.optional(Location, { type: "none" }),

    // Customization
    stickers: types.optional(types.array(Sticker), []),

    // Notes
    note: types.maybe(types.string),

    // Metadata
    weather: types.maybe(types.string),
    timeOfDay: types.enumeration(["morning", "afternoon", "evening", "night"]),

    // Future premium features
    aiTags: types.optional(types.array(types.string), []),
    relatedEncounterIds: types.optional(types.array(types.string), []),
    isShared: types.optional(types.boolean, false),
  })
  .views((self) => ({
    /**
     * Get formatted date string
     */
    get formattedDate() {
      return new Date(self.timestamp).toLocaleDateString()
    },
    /**
     * Get formatted time string
     */
    get formattedTime() {
      return new Date(self.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    },
    /**
     * Check if encounter has location data
     */
    get hasLocation() {
      return self.location.type !== "none"
    },
    /**
     * Get location display string
     */
    get locationDisplay() {
      if (self.location.type === "none") return "No location"
      if (self.location.type === "manual") return self.location.label || "Unknown location"
      if (self.location.type === "gps" && self.location.coordinates) {
        return `${self.location.coordinates.latitude.toFixed(4)}, ${self.location.coordinates.longitude.toFixed(4)}`
      }
      return "Unknown location"
    },
    /**
     * Check if encounter has stickers
     */
    get hasStickers() {
      return self.stickers.length > 0
    },
    /**
     * Check if encounter has notes
     */
    get hasNote() {
      return !!self.note && self.note.length > 0
    },
  }))
  .actions((self) => ({
    /**
     * Update pet type
     */
    setPetType(type: "cat" | "dog" | "other" | "unknown") {
      self.petType = type
    },
    /**
     * Add a mood tag
     */
    addMood(mood: string) {
      if (!self.mood.includes(mood)) {
        self.mood.push(mood)
      }
    },
    /**
     * Remove a mood tag
     */
    removeMood(mood: string) {
      const index = self.mood.indexOf(mood)
      if (index > -1) {
        self.mood.splice(index, 1)
      }
    },
    /**
     * Add a custom tag
     */
    addTag(tag: string) {
      if (!self.tags.includes(tag)) {
        self.tags.push(tag)
      }
    },
    /**
     * Remove a custom tag
     */
    removeTag(tag: string) {
      const index = self.tags.indexOf(tag)
      if (index > -1) {
        self.tags.splice(index, 1)
      }
    },
    /**
     * Set location with manual label
     */
    setManualLocation(label: string) {
      self.location = {
        type: "manual",
        label,
        coordinates: undefined,
      }
    },
    /**
     * Set location with GPS coordinates
     */
    setGPSLocation(latitude: number, longitude: number, label?: string) {
      self.location = {
        type: "gps",
        label,
        coordinates: { latitude, longitude },
      }
    },
    /**
     * Clear location data
     */
    clearLocation() {
      self.location = { type: "none", label: undefined, coordinates: undefined } as any
    },
    /**
     * Add a sticker to the photo
     */
    addSticker(stickerId: string, x: number, y: number, scale = 1, rotation = 0) {
      self.stickers.push({
        id: stickerId,
        position: { x, y },
        scale,
        rotation,
      })
    },
    /**
     * Remove a sticker
     */
    removeSticker(index: number) {
      if (index >= 0 && index < self.stickers.length) {
        self.stickers.splice(index, 1)
      }
    },
    /**
     * Update sticker position/properties
     */
    updateSticker(index: number, updates: Partial<SnapshotIn<typeof Sticker>>) {
      if (index >= 0 && index < self.stickers.length) {
        const sticker = self.stickers[index]
        if (updates.position) {
          sticker.position = updates.position as any
        }
        if (updates.scale !== undefined) sticker.scale = updates.scale
        if (updates.rotation !== undefined) sticker.rotation = updates.rotation
      }
    },
    /**
     * Set note
     */
    setNote(note: string) {
      self.note = note
    },
    /**
     * Set weather
     */
    setWeather(weather: string) {
      self.weather = weather
    },
  }))

export interface IEncounter extends Instance<typeof EncounterModel> {}
export interface IEncounterSnapshotIn extends SnapshotIn<typeof EncounterModel> {}
export interface IEncounterSnapshotOut extends SnapshotOut<typeof EncounterModel> {}
