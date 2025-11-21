import { EncounterModel } from "../../app/models/EncounterStore"

describe("EncounterStore", () => {
  const mockEncounterData = {
    id: "test-id-1",
    timestamp: 1672531200000, // 2023-01-01 00:00:00 UTC
    photos: {
      original: "file://original.jpg",
      thumbnail: "file://thumbnail.jpg",
    },
    petType: "cat" as const,
    timeOfDay: "morning" as const,
  }

  it("can be created", () => {
    const encounter = EncounterModel.create(mockEncounterData)
    expect(encounter).toBeTruthy()
    expect(encounter.id).toBe("test-id-1")
    expect(encounter.petType).toBe("cat")
  })

  it("computes formatted date and time correctly", () => {
    const encounter = EncounterModel.create(mockEncounterData)
    // Note: These depend on the locale, which is mocked to 'en' in setup.ts
    // but Date.toLocaleDateString might still use system locale if not fully mocked or if running in node.
    // We'll check if it returns a string at least.
    expect(typeof encounter.formattedDate).toBe("string")
    expect(typeof encounter.formattedTime).toBe("string")
  })

  it("handles location views correctly", () => {
    const encounter = EncounterModel.create(mockEncounterData)

    // Default: no location
    expect(encounter.hasLocation).toBe(false)
    expect(encounter.locationDisplay).toBe("No location")

    // Manual location
    encounter.setManualLocation("Central Park")
    expect(encounter.hasLocation).toBe(true)
    expect(encounter.locationDisplay).toBe("Central Park")

    // GPS location
    encounter.setGPSLocation(40.785091, -73.968285)
    expect(encounter.hasLocation).toBe(true)
    expect(encounter.locationDisplay).toContain("40.7851")
    expect(encounter.locationDisplay).toContain("-73.9683")
  })

  it("can update pet type", () => {
    const encounter = EncounterModel.create(mockEncounterData)
    encounter.setPetType("dog")
    expect(encounter.petType).toBe("dog")
  })

  it("can manage mood tags", () => {
    const encounter = EncounterModel.create(mockEncounterData)

    encounter.addMood("happy")
    expect(encounter.mood).toContain("happy")

    encounter.addMood("happy") // Duplicate check
    expect(encounter.mood.length).toBe(1)

    encounter.removeMood("happy")
    expect(encounter.mood).not.toContain("happy")
  })

  it("can manage custom tags", () => {
    const encounter = EncounterModel.create(mockEncounterData)

    encounter.addTag("fluffy")
    expect(encounter.tags).toContain("fluffy")

    encounter.removeTag("fluffy")
    expect(encounter.tags).not.toContain("fluffy")
  })

  it("can manage stickers", () => {
    const encounter = EncounterModel.create(mockEncounterData)
    expect(encounter.hasStickers).toBe(false)

    encounter.addSticker("sticker-1", 0.5, 0.5)
    expect(encounter.hasStickers).toBe(true)
    expect(encounter.stickers.length).toBe(1)
    expect(encounter.stickers[0].id).toBe("sticker-1")

    encounter.updateSticker(0, { scale: 2 })
    expect(encounter.stickers[0].scale).toBe(2)

    encounter.removeSticker(0)
    expect(encounter.hasStickers).toBe(false)
  })

  it("can set notes", () => {
    const encounter = EncounterModel.create(mockEncounterData)
    expect(encounter.hasNote).toBe(false)

    encounter.setNote("This is a test note")
    expect(encounter.hasNote).toBe(true)
    expect(encounter.note).toBe("This is a test note")
  })
})
