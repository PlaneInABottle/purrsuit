import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * A sticker definition
 */
const StickerDefinition = types.model("StickerDefinition", {
  id: types.identifier,
  name: types.string,
  category: types.string, // "status", "mood", "seasonal", etc.
  emoji: types.string, // For now, use emojis as stickers
  isPremium: types.optional(types.boolean, false),
  isUnlocked: types.optional(types.boolean, true), // Free stickers unlocked by default
  unlockCondition: types.maybe(types.string), // Achievement ID required to unlock
})

/**
 * Sticker category for organization
 */
const StickerCategory = types.model("StickerCategory", {
  id: types.string,
  name: types.string,
  description: types.string,
  icon: types.string,
})

/**
 * Sticker store manages available stickers, categories, and unlock status
 */
export const StickerStoreModel = types
  .model("StickerStore", {
    stickers: types.optional(types.array(StickerDefinition), []),
    categories: types.optional(types.array(StickerCategory), []),
    recentlyUsed: types.optional(types.array(types.string), []), // Sticker IDs
  })
  .views((self) => ({
    /**
     * Get all unlocked stickers
     */
    get unlockedStickers() {
      return self.stickers.filter((s) => s.isUnlocked)
    },
    /**
     * Get unlocked stickers by category
     */
    getStickersByCategory(categoryId: string) {
      return self.stickers.filter((s) => s.category === categoryId && s.isUnlocked)
    },
    /**
     * Get sticker by ID
     */
    getStickerById(id: string) {
      return self.stickers.find((s) => s.id === id)
    },
    /**
     * Get recently used stickers (up to 10)
     */
    get recentStickers() {
      return self.recentlyUsed
        .slice(0, 10)
        .map((id) => self.stickers.find((s) => s.id === id))
        .filter(Boolean)
    },
    /**
     * Get count of unlocked stickers
     */
    get unlockedCount() {
      return self.stickers.filter((s) => s.isUnlocked).length
    },
    /**
     * Get total sticker count
     */
    get totalCount() {
      return self.stickers.length
    },
  }))
  .actions((self) => ({
    /**
     * Record sticker usage (for recents tracking)
     */
    useSticker(stickerId: string) {
      // Remove if already in recents
      const index = self.recentlyUsed.indexOf(stickerId)
      if (index > -1) {
        self.recentlyUsed.splice(index, 1)
      }
      // Add to front
      self.recentlyUsed.unshift(stickerId)
      // Keep only 10 most recent
      if (self.recentlyUsed.length > 10) {
        self.recentlyUsed.splice(10)
      }
    },
    /**
     * Unlock a sticker (for achievement-based unlocks)
     */
    unlockSticker(stickerId: string) {
      const sticker = self.stickers.find((s) => s.id === stickerId)
      if (sticker && !sticker.isUnlocked) {
        sticker.isUnlocked = true
      }
    },
    /**
     * Initialize default stickers
     */
    initializeStickers() {
      const defaultCategories = [
        {
          id: "status",
          name: "Pet Status",
          description: "What kind of pet is this?",
          icon: "🏷️",
        },
        {
          id: "mood",
          name: "Mood",
          description: "How is the pet feeling?",
          icon: "😊",
        },
        {
          id: "activity",
          name: "Activity",
          description: "What is the pet doing?",
          icon: "⚡",
        },
        {
          id: "special",
          name: "Special",
          description: "Something unique about this encounter",
          icon: "✨",
        },
      ]

      const defaultStickers = [
        // Status stickers
        { id: "friendly-local", name: "Friendly Local", category: "status", emoji: "🏡" },
        { id: "street-boss", name: "Street Boss", category: "status", emoji: "👑" },
        { id: "shy-bean", name: "Shy Bean", category: "status", emoji: "🫣" },
        { id: "food-hunter", name: "Food Hunter", category: "status", emoji: "🍖" },
        { id: "just-met", name: "Just Met", category: "status", emoji: "👋" },
        { id: "old-friend", name: "Old Friend", category: "status", emoji: "🤝" },

        // Mood stickers
        { id: "happy", name: "Happy", category: "mood", emoji: "😊" },
        { id: "sleepy", name: "Sleepy", category: "mood", emoji: "😴" },
        { id: "playful", name: "Playful", category: "mood", emoji: "🎾" },
        { id: "grumpy", name: "Grumpy", category: "mood", emoji: "😾" },
        { id: "curious", name: "Curious", category: "mood", emoji: "🤔" },
        { id: "loving", name: "Loving", category: "mood", emoji: "😍" },
        { id: "judging", name: "Judging You", category: "mood", emoji: "🤨" },

        // Activity stickers
        { id: "nap-master", name: "Nap Master", category: "activity", emoji: "💤" },
        { id: "zoomies", name: "Zoomies Mode", category: "activity", emoji: "⚡" },
        { id: "hunting", name: "Hunting", category: "activity", emoji: "🎯" },
        { id: "grooming", name: "Grooming", category: "activity", emoji: "🧼" },
        { id: "sunbathing", name: "Sunbathing", category: "activity", emoji: "☀️" },

        // Special stickers
        { id: "majestic", name: "Majestic Pose", category: "special", emoji: "✨" },
        { id: "chaos", name: "Pure Chaos", category: "special", emoji: "🌪️" },
        { id: "blep", name: "Blep Mode", category: "special", emoji: "👅" },
        { id: "floof", name: "Maximum Floof", category: "special", emoji: "☁️" },
        { id: "void", name: "Void Cat", category: "special", emoji: "🌑" },
        { id: "chonk", name: "Absolute Unit", category: "special", emoji: "🎯" },
        { id: "smol", name: "Smol Bean", category: "special", emoji: "🥺" },
        { id: "derp", name: "Derp Face", category: "special", emoji: "🤪" },
        { id: "loaf", name: "Loafing", category: "special", emoji: "🍞" },
        { id: "satellite-ears", name: "Satellite Ears", category: "special", emoji: "📡" },
        { id: "heart-eyes", name: "Heart Eyes", category: "special", emoji: "😻" },
        { id: "good-boy", name: "Good Boy", category: "special", emoji: "🌟" },
      ]

      self.categories.replace(defaultCategories.map((c) => StickerCategory.create(c)))
      self.stickers.replace(
        defaultStickers.map((s) =>
          StickerDefinition.create({
            ...s,
            isUnlocked: true,
            isPremium: false,
          }),
        ),
      )
    },
  }))

export interface IStickerStore extends Instance<typeof StickerStoreModel> {}
export interface IStickerStoreSnapshotIn extends SnapshotIn<typeof StickerStoreModel> {}
export interface IStickerStoreSnapshotOut extends SnapshotOut<typeof StickerStoreModel> {}
