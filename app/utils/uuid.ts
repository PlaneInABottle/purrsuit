import * as Crypto from "expo-crypto"

/**
 * Generate a UUID v4 string using expo-crypto
 * This is compatible with React Native and doesn't require crypto.getRandomValues
 */
export function generateUUID(): string {
  return Crypto.randomUUID()
}
