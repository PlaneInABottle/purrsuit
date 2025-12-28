import { MMKV } from "react-native-mmkv"
import * as SecureStore from "expo-secure-store"
import * as Crypto from "expo-crypto"

const STORAGE_KEY = "mmkv-encryption-key"

/**
 * Retrieve or generate a secure encryption key for MMKV.
 * Uses Expo SecureStore to persist the key securely on the device.
 */
function getEncryptionKey(): string {
  try {
    // Try to retrieve existing key
    const existingKey = SecureStore.getItem(STORAGE_KEY)
    if (existingKey) {
      return existingKey
    }

    // Generate new secure key if none exists
    const newKey = Crypto.randomUUID()
    SecureStore.setItem(STORAGE_KEY, newKey)
    return newKey
  } catch (error) {
    console.error("Critical: Failed to manage encryption key", error)
    // Fallback: If SecureStore fails completely, we can't encrypt safely.
    // Returning undefined will result in unencrypted storage, which is better than crashing,
    // but this error should be monitored.
    return ""
  }
}

// Initialize MMKV with encryption
// We use a specific ID to separate our storage from default instances
export const storage = new MMKV({
  id: "purrsuit-storage",
  encryptionKey: getEncryptionKey(),
})

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function loadString(key: string): string | null {
  try {
    return storage.getString(key) ?? null
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function saveString(key: string, value: string): boolean {
  try {
    storage.set(key, value)
    return true
  } catch {
    return false
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export function load<T>(key: string): T | null {
  let almostThere: string | null = null
  try {
    almostThere = loadString(key)
    return JSON.parse(almostThere ?? "") as T
  } catch {
    return (almostThere as T) ?? null
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function save(key: string, value: unknown): boolean {
  try {
    saveString(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key: string): void {
  try {
    storage.delete(key)
  } catch {}
}

/**
 * Burn it all to the ground.
 */
export function clear(): void {
  try {
    storage.clearAll()
  } catch {}
}
