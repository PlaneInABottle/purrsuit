import { getRoot, IAnyModelType } from "mobx-state-tree"

/**
 * A generic helper for creating property setter actions.
 * This allows you to call `model.setProp("propertyName", value)` instead of
 * creating individual setter actions for each property.
 *
 * Usage:
 * ```typescript
 * const MyModel = types.model("MyModel", { name: types.string })
 *   .actions(withSetPropAction)
 *
 * const instance = MyModel.create({ name: "test" })
 * instance.setProp("name", "new name")
 * ```
 */
export const withSetPropAction = <T extends IAnyModelType>(mstInstance: T) => ({
  /**
   * Sets a property on the model instance.
   * @param key - The property name to set
   * @param value - The value to set
   */
  setProp<K extends keyof T["Type"], V extends T["Type"][K]>(key: K, value: V) {
    ;(mstInstance as any)[key] = value
  },
})

/**
 * Helper to get the root store from any MST node.
 * Useful when you need to access the root store from within a model action.
 */
export const getRootStore = <T extends IAnyModelType>(self: T) => {
  return getRoot<T>(self)
}
