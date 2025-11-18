import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react"

import { IRootStore } from "../RootStore"
import { setupRootStore } from "./setupRootStore"

/**
 * Create the root store context
 */
const RootStoreContext = createContext<IRootStore | null>(null)

/**
 * Props for the StoreProvider component
 */
export interface StoreProviderProps {
  /**
   * Optional pre-initialized store for testing or SSR
   */
  store?: IRootStore
}

/**
 * Provider component that initializes and provides the root store to the app.
 * Wrap your app's JSX hierarchy with this component to access stores via useStores().
 *
 * Similar to ThemeProvider pattern in this codebase.
 */
export const StoreProvider: FC<PropsWithChildren<StoreProviderProps>> = ({ children, store }) => {
  const [rootStore, setRootStore] = useState<IRootStore | null>(store || null)

  useEffect(() => {
    // Setup root store on mount
    ;(async () => {
      const initializedStore = await setupRootStore(store)
      setRootStore(initializedStore)
    })()
  }, [store])

  // Don't render children until store is ready
  if (!rootStore) {
    return null
  }

  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>
}

/**
 * Hook to access the root store and its sub-stores.
 * Must be used within a StoreProvider.
 *
 * @example
 * ```tsx
 * const { userStore, uiStore } = useStores()
 * ```
 */
export function useStores(): IRootStore {
  const store = useContext(RootStoreContext)
  if (!store) {
    throw new Error("useStores must be used within a StoreProvider")
  }
  return store
}
