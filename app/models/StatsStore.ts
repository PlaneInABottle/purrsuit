import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Achievement badge
 */
const Achievement = types.model("Achievement", {
  id: types.string,
  name: types.string,
  description: types.string,
  icon: types.string, // Icon name or emoji
  unlockedAt: types.maybe(types.number), // Timestamp when unlocked
  isUnlocked: types.optional(types.boolean, false),
  progress: types.optional(types.number, 0), // Current progress (0-100)
  requirement: types.number, // Required value to unlock
})

/**
 * Stats and achievements store
 * Tracks user progress, streaks, and milestone achievements
 */
export const StatsStoreModel = types
  .model("StatsStore", {
    // Core Counters
    totalEncounters: types.optional(types.number, 0),
    catCount: types.optional(types.number, 0),
    dogCount: types.optional(types.number, 0),
    otherCount: types.optional(types.number, 0),

    // Streaks
    currentStreak: types.optional(types.number, 0),
    longestStreak: types.optional(types.number, 0),
    lastEncounterDate: types.maybe(types.string), // ISO date string (YYYY-MM-DD)

    // Location tracking - maps location name to count
    locationCounts: types.optional(types.map(types.number), {}),

    // Achievements
    achievements: types.optional(types.array(Achievement), []),
  })
  .views((self) => ({
    /**
     * Get total unique locations visited
     */
    get uniqueLocationCount() {
      return self.locationCounts.size
    },
    /**
     * Get top locations sorted by frequency
     */
    get topLocations() {
      return Array.from(self.locationCounts.entries())
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
    },
    /**
     * Get percentage of cats vs total
     */
    get catPercentage() {
      if (self.totalEncounters === 0) return 0
      return Math.round((self.catCount / self.totalEncounters) * 100)
    },
    /**
     * Get percentage of dogs vs total
     */
    get dogPercentage() {
      if (self.totalEncounters === 0) return 0
      return Math.round((self.dogCount / self.totalEncounters) * 100)
    },
    /**
     * Get unlocked achievements
     */
    get unlockedAchievements() {
      return self.achievements.filter((a) => a.isUnlocked)
    },
    /**
     * Get locked achievements
     */
    get lockedAchievements() {
      return self.achievements.filter((a) => !a.isUnlocked)
    },
    /**
     * Get achievement unlock count
     */
    get achievementCount() {
      return self.achievements.filter((a) => a.isUnlocked).length
    },
    /**
     * Check if user has active streak (encountered today or yesterday)
     */
    get hasActiveStreak() {
      if (!self.lastEncounterDate) return false

      const today = new Date().toISOString().split("T")[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

      return self.lastEncounterDate === today || self.lastEncounterDate === yesterday
    },
  }))
  .actions((self) => ({
    /**
     * Record a new encounter and update stats
     */
    recordEncounter(petType: "cat" | "dog" | "other" | "unknown", location?: string) {
      self.totalEncounters += 1

      // Update pet type counter
      if (petType === "cat") self.catCount += 1
      else if (petType === "dog") self.dogCount += 1
      else if (petType === "other") self.otherCount += 1

      // Update location tracking
      if (location) {
        const currentCount = self.locationCounts.get(location) || 0
        self.locationCounts.set(location, currentCount + 1)
      }

      // Update streak
      const today = new Date().toISOString().split("T")[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

      if (self.lastEncounterDate === yesterday) {
        // Continuing streak
        self.currentStreak += 1
        if (self.currentStreak > self.longestStreak) {
          self.longestStreak = self.currentStreak
        }
      } else if (self.lastEncounterDate !== today) {
        // New streak or broken streak
        self.currentStreak = 1
      }
      // If same day, don't change streak

      self.lastEncounterDate = today

      // Check achievements after stats update
      this.checkAchievements()
    },
    /**
     * Check and unlock achievements based on current stats
     */
    checkAchievements() {
      self.achievements.forEach((achievement) => {
        if (!achievement.isUnlocked) {
          let shouldUnlock = false
          let progress = 0

          // Check achievement conditions
          switch (achievement.id) {
            case "first-encounter":
              shouldUnlock = self.totalEncounters >= 1
              progress = Math.min(100, (self.totalEncounters / 1) * 100)
              break
            case "week-warrior":
              shouldUnlock = self.currentStreak >= 7
              progress = Math.min(100, (self.currentStreak / 7) * 100)
              break
            case "month-master":
              shouldUnlock = self.currentStreak >= 30
              progress = Math.min(100, (self.currentStreak / 30) * 100)
              break
            case "cat-whisperer":
              shouldUnlock = self.catCount >= 50
              progress = Math.min(100, (self.catCount / 50) * 100)
              break
            case "dog-person":
              shouldUnlock = self.dogCount >= 50
              progress = Math.min(100, (self.dogCount / 50) * 100)
              break
            case "explorer":
              shouldUnlock = self.locationCounts.size >= 10
              progress = Math.min(100, (self.locationCounts.size / 10) * 100)
              break
            case "photographer":
              shouldUnlock = self.totalEncounters >= 100
              progress = Math.min(100, (self.totalEncounters / 100) * 100)
              break
            case "collector":
              shouldUnlock = self.totalEncounters >= 250
              progress = Math.min(100, (self.totalEncounters / 250) * 100)
              break
          }

          achievement.progress = Math.round(progress)

          if (shouldUnlock) {
            achievement.isUnlocked = true
            achievement.unlockedAt = Date.now()
          }
        }
      })
    },
    /**
     * Initialize default achievements
     */
    initializeAchievements() {
      const defaultAchievements = [
        {
          id: "first-encounter",
          name: "First Purrsuit",
          description: "Log your first pet encounter",
          icon: "🌟",
          requirement: 1,
        },
        {
          id: "week-warrior",
          name: "Week Warrior",
          description: "Maintain a 7-day streak",
          icon: "🎯",
          requirement: 7,
        },
        {
          id: "month-master",
          name: "Month Master",
          description: "Maintain a 30-day streak",
          icon: "🔥",
          requirement: 30,
        },
        {
          id: "cat-whisperer",
          name: "Cat Whisperer",
          description: "Encounter 50 cats",
          icon: "😺",
          requirement: 50,
        },
        {
          id: "dog-person",
          name: "Dog Person",
          description: "Encounter 50 dogs",
          icon: "🐕",
          requirement: 50,
        },
        {
          id: "explorer",
          name: "Neighborhood Explorer",
          description: "Visit 10 unique locations",
          icon: "🗺️",
          requirement: 10,
        },
        {
          id: "photographer",
          name: "Photographer",
          description: "Log 100 encounters",
          icon: "📸",
          requirement: 100,
        },
        {
          id: "collector",
          name: "Collector",
          description: "Log 250 encounters",
          icon: "⭐",
          requirement: 250,
        },
      ]

      self.achievements.replace(
        defaultAchievements.map((a) =>
          Achievement.create({
            ...a,
            isUnlocked: false,
            progress: 0,
          }),
        ),
      )
    },
    /**
     * Reset all stats (for testing or user preference)
     */
    reset() {
      self.totalEncounters = 0
      self.catCount = 0
      self.dogCount = 0
      self.otherCount = 0
      self.currentStreak = 0
      self.longestStreak = 0
      self.lastEncounterDate = undefined
      self.locationCounts.clear()
      this.initializeAchievements()
    },
  }))

export interface IStatsStore extends Instance<typeof StatsStoreModel> {}
export interface IStatsStoreSnapshotIn extends SnapshotIn<typeof StatsStoreModel> {}
export interface IStatsStoreSnapshotOut extends SnapshotOut<typeof StatsStoreModel> {}
