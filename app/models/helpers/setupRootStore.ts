import { onSnapshot } from "mobx-state-tree"
import { storage } from "@/utils/storage"
import { IRootStore, RootStoreModel } from "../RootStore"
import { api } from "@/services/api"

// Import Reactotron MST tracking if in dev mode
let trackMSTNode: ((store: IRootStore) => void) | undefined
if (__DEV__) {
  // Dynamic import to avoid production bundle
  trackMSTNode = require("@/devtools/ReactotronMST").trackMSTNode
}

/**
 * The key we'll be saving our state as within MMKV storage.
 */
const ROOT_STATE_STORAGE_KEY = "root-store-v1"

/**
 * Setup the root store with persistence and environment injection.
 * This should be called once at app startup.
 *
 * @param rootStore - Optional existing root store instance to restore
 * @returns The initialized root store
 */
export async function setupRootStore(rootStore?: IRootStore) {
  let restoredState: any

  try {
    // Load persisted state from storage
    const data = storage.getString(ROOT_STATE_STORAGE_KEY)
    if (data) {
      restoredState = JSON.parse(data)
    }
  } catch (error) {
    // If there's any problem loading, ignore and start fresh
    if (__DEV__) {
      console.error("Error loading root store:", error)
    }
  }

  // Create or restore the root store
  const finalStore =
    rootStore ||
    RootStoreModel.create(restoredState || {}, {
      // Environment injection - make services available to all models
      api,
    })

  // Track changes and persist to storage automatically
  onSnapshot(finalStore, (snapshot) => {
    storage.set(ROOT_STATE_STORAGE_KEY, JSON.stringify(snapshot))
  })

  // Setup Reactotron MST tracking in development
  if (__DEV__ && trackMSTNode) {
    trackMSTNode(finalStore)
  }

  return finalStore
}

/**
 * Manually persist the root store state to storage.
 * Useful for controlled persistence in development or before app close.
 *
 * @param rootStore - The root store instance to persist
 */
export function persistRootStore(rootStore: IRootStore) {
  try {
    const snapshot = JSON.stringify(rootStore)
    storage.set(ROOT_STATE_STORAGE_KEY, snapshot)
  } catch (error) {
    if (__DEV__) {
      console.error("Error persisting root store:", error)
    }
  }
}

/**
 * Clear the persisted root store state from storage.
 */
export function clearPersistedRootStore() {
  storage.delete(ROOT_STATE_STORAGE_KEY)
}
