import { IRootStore } from "@/models/RootStore"

import { Reactotron } from "./ReactotronClient"

/**
 * Connects the MobX State Tree root store to Reactotron for debugging.
 * This enables:
 * - State tree inspection via the State tab
 * - Action tracking
 * - Snapshot viewing
 * - Subscription monitoring
 *
 * Call this once after the root store is created.
 * The MST plugin must be registered in ReactotronConfig.ts before this is called.
 *
 * @param rootStore - The root store instance to track
 */
export function trackMSTNode(rootStore: IRootStore) {
  if (__DEV__) {
    try {
      // trackMstNode is added to Reactotron by the mst() plugin in ReactotronConfig.ts
      ;(Reactotron as any).trackMstNode(rootStore)
      Reactotron.log("✅ MST RootStore tracking enabled")
    } catch (error) {
      Reactotron.log("❌ Failed to setup MST tracking:", error)
    }
  }
}
