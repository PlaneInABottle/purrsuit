# MobX State Tree (MST) Implementation

This directory contains the MobX State Tree state management implementation for the app.

## 📁 Structure

```
models/
├── RootStore.ts          # Main store combining all sub-stores
├── UserStore.ts          # User authentication and preferences
├── UiStore.ts            # Global UI state (loading, errors, modals)
├── USAGE_EXAMPLES.tsx    # Code examples for using MST in components
├── helpers/
│   ├── setupRootStore.ts # Store initialization and persistence
│   ├── useStores.tsx     # React hook and provider
│   └── withSetPropAction.ts # Generic property setter helper
└── index.ts              # Public API exports
```

## 🚀 Quick Start

### 1. Access stores in components

```typescript
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"

export const MyScreen = observer(() => {
  const { userStore, uiStore } = useStores()

  return (
    <View>
      <Text>{userStore.displayName}</Text>
      <Button onPress={() => userStore.logout()} title="Logout" />
    </View>
  )
})
```

### 2. Always use `observer`

Components that read from stores MUST be wrapped with `observer()`:

```typescript
// ✅ Correct
const MyComponent = observer(() => {
  const { userStore } = useStores()
  return <Text>{userStore.name}</Text>
})

// ❌ Wrong - component won't update when store changes
const MyComponent = () => {
  const { userStore } = useStores()
  return <Text>{userStore.name}</Text>
}
```

## 📦 Available Stores

### UserStore

Manages user authentication and preferences.

**Properties:**

- `id`, `email`, `name`, `avatar` - User profile data
- `preferences` - User settings (theme, notifications, language)

**Views (Computed):**

- `isAuthenticated` - Boolean indicating if user is logged in
- `displayName` - Formatted display name with fallbacks

**Actions:**

- `setUser(user)` - Set authenticated user
- `updatePreferences(prefs)` - Update user preferences
- `logout()` - Clear user data

### UiStore

Manages global UI state.

**Properties:**

- `isLoading` - Global loading state
- `errorMessage` - Current error message
- `isModalOpen`, `modalContent` - Modal state

**Views:**

- `hasError` - Boolean indicating if error exists

**Actions:**

- `setLoading(bool)` - Set loading state
- `showError(message)` - Display error
- `clearError()` - Clear error
- `openModal(content?)`, `closeModal()` - Manage modals

### RootStore

The root store that combines all sub-stores.

**Actions:**

- `reset()` - Reset all stores to initial state

## 🔄 Async Actions

For async operations, use `flow` from MST:

```typescript
import { flow } from "mobx-state-tree"
import { getEnv } from "mobx-state-tree"

.actions((self) => ({
  fetchData: flow(function* () {
    self.isLoading = true
    try {
      const api = getEnv(self).api
      const response = yield api.getData()
      if (response.ok) {
        self.data = response.data
      }
    } catch (error) {
      self.errorMessage = error.message
    } finally {
      self.isLoading = false
    }
  })
}))
```

## 💾 Persistence

State is automatically persisted to MMKV storage (in production only).

**Storage key:** `root-store-v1`

**Manual persistence:**

```typescript
import { persistRootStore, clearPersistedRootStore } from "@/models/helpers/setupRootStore"

// Save manually
persistRootStore(rootStore)

// Clear saved state
clearPersistedRootStore()
```

## 🐛 Debugging with Reactotron

MST is integrated with Reactotron for powerful debugging:

1. **View state tree** - Inspect current state structure
2. **Track actions** - See all actions as they happen
3. **View snapshots** - Examine state snapshots
4. **Time-travel** - Step through state changes

Open Reactotron while running the app in development mode to access these features.

## 📝 Creating New Stores

1. Create a new file in `models/` (e.g., `TodoStore.ts`)
2. Define your model:

```typescript
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export const TodoStoreModel = types
  .model("TodoStore", {
    todos: types.array(types.frozen()),
  })
  .views((self) => ({
    get completedCount() {
      return self.todos.filter((t) => t.done).length
    },
  }))
  .actions((self) => ({
    addTodo(text: string) {
      self.todos.push({ id: Date.now(), text, done: false })
    },
  }))

export interface ITodoStore extends Instance<typeof TodoStoreModel> {}
export interface ITodoStoreSnapshotIn extends SnapshotIn<typeof TodoStoreModel> {}
export interface ITodoStoreSnapshotOut extends SnapshotOut<typeof TodoStoreModel> {}
```

3. Add to RootStore:

```typescript
// RootStore.ts
import { TodoStoreModel } from "./TodoStore"

export const RootStoreModel = types.model("RootStore", {
  userStore: types.optional(UserStoreModel, {}),
  uiStore: types.optional(UiStoreModel, {}),
  todoStore: types.optional(TodoStoreModel, {}), // Add here
})
```

4. Export from index.ts:

```typescript
export * from "./TodoStore"
```

## 🎯 Best Practices

1. **Use TypeScript interfaces** - Export `Instance`, `SnapshotIn`, `SnapshotOut` types
2. **Keep stores focused** - One store per domain concept
3. **Use views for computed values** - Don't calculate in components
4. **Actions modify state** - Never mutate state directly in components
5. **Observer wrapping** - Only wrap components that read store data
6. **Small observers** - Wrap leaf components for better performance
7. **Environment injection** - Use `getEnv(self)` to access services
8. **Async with flow** - Always use `flow()` for async actions

## 📚 Resources

- [MST Documentation](https://mobx-state-tree.js.org/)
- [MobX Documentation](https://mobx.js.org/)
- [mobx-react-lite](https://github.com/mobxjs/mobx-react-lite)
- See `USAGE_EXAMPLES.tsx` for more code examples

## 🔧 TypeScript Configuration

The project's `tsconfig.json` is already configured with recommended MST settings:

- `strict: true`
- `noImplicitAny: true`
- `noImplicitReturns: true`
- `noImplicitThis: true`

These ensure maximum type safety when working with MST.
