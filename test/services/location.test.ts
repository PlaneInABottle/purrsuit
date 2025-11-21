import * as Location from "expo-location"

import {
  formatCoordinates,
  formatAddress,
  getCurrentLocation,
  reverseGeocodeAsync,
  hasLocationPermissions,
  requestLocationPermissions,
} from "../../app/services/location"

// Mock expo-location
jest.mock("expo-location")

describe("LocationService", () => {
  describe("formatCoordinates", () => {
    it("formats coordinates to 4 decimal places", () => {
      expect(formatCoordinates(40.123456, -73.987654)).toBe("40.1235, -73.9877")
      expect(formatCoordinates(0, 0)).toBe("0.0000, 0.0000")
    })
  })

  describe("formatAddress", () => {
    it("formats a full address correctly", () => {
      const address = {
        street: "123 Main St",
        city: "New York",
        region: "NY",
        country: "USA",
      }
      expect(formatAddress(address)).toBe("123 Main St, New York, NY, USA")
    })

    it("handles missing fields gracefully", () => {
      const address = {
        city: "Paris",
        country: "France",
      }
      expect(formatAddress(address)).toBe("Paris, France")
    })

    it("returns 'Unknown location' if all fields are missing", () => {
      expect(formatAddress({})).toBe("Unknown location")
    })
  })

  describe("Permissions", () => {
    it("checks permissions correctly", async () => {
      ;(Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      })
      const result = await hasLocationPermissions()
      expect(result).toBe(true)
    })

    it("requests permissions correctly", async () => {
      ;(Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
        canAskAgain: true,
      })
      const result = await requestLocationPermissions()
      expect(result.granted).toBe(true)
    })
  })

  describe("getCurrentLocation", () => {
    it("returns location when permission is granted", async () => {
      // Mock permission check
      ;(Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      })

      // Mock location retrieval
      ;(Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
          accuracy: 10,
        },
      })

      const location = await getCurrentLocation()
      expect(location).toEqual({
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
      })
    })

    it("returns null when permission is denied", async () => {
      ;(Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" })
      const location = await getCurrentLocation()
      expect(location).toBeNull()
    })
  })

  describe("reverseGeocodeAsync", () => {
    it("returns formatted address object on success", async () => {
      ;(Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
        {
          street: "123 Test St",
          city: "Test City",
          region: "TC",
          country: "Testland",
          postalCode: "12345",
        },
      ])

      const result = await reverseGeocodeAsync(10, 20)
      expect(result).toEqual({
        street: "123 Test St",
        city: "Test City",
        region: "TC",
        country: "Testland",
        postalCode: "12345",
      })
    })

    it("returns null if no results found", async () => {
      ;(Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([])
      const result = await reverseGeocodeAsync(10, 20)
      expect(result).toBeNull()
    })
  })
})
