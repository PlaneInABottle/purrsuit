import { mst } from "reactotron-mst"

import { IRootStore } from "@/models/RootStore"

import { Reactotron } from "./ReactotronClient"

let mstPlugin: ReturnType<typeof mst> | null = null

/**
 * Initialize the MST plugin for Reactotron.
 * This should be called during Reactotron configuration, before connect().
 */
export function initReactotronMST() {
  if (__DEV__) {
    mstPlugin = mst()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(Reactotron as any).use(mstPlugin)
  }
}

/**
 * Connects the MobX State Tree root store to Reactotron for debugging.
 * This enables:
 * - State tree inspection
 * - Action tracking
 * - Snapshot viewing
 * - Time-travel debugging
 *
 * Call this once after the root store is created.
 *
 * @param rootStore - The root store instance to track
 */
export function trackMSTNode(rootStore: IRootStore) {
  if (__DEV__ && mstPlugin) {
    try {
      const plugin = (Reactotron as any).use(mst())
      const result = plugin.features.trackMstNode(rootStore, "RootStore")

      if (result.kind === "ok") {
        Reactotron.log("✅ MST RootStore tracking enabled")
      } else if (result.kind === "already-tracking") {
        Reactotron.log("⚠️ MST RootStore already being tracked")
      } else {
        Reactotron.log(`❌ MST tracking failed: ${result.kind}`, result.message)
      }
    } catch (error) {
      Reactotron.log("❌ Failed to setup MST tracking:", error)
    }
  }
}
