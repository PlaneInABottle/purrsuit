# MobX State Tree - Quick Start Guide

## 🎯 TL;DR

```typescript
// 1. Import in any component
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"

// 2. Wrap component with observer
export const MyScreen = observer(() => {
  // 3. Access stores
  const { userStore, uiStore } = useStores()
  
  // 4. Use store data & actions
  return (
    <View>
      <Text>{userStore.displayName}</Text>
      <Button onPress={() => userStore.logout()} title="Logout" />
    </View>
  )
})
```

That's it! Component will auto-update when store data changes.

## 📝 Common Patterns

### Pattern 1: Reading Store Data
```typescript
const { userStore } = useStores()
return <Text>{userStore.email}</Text> // Auto-updates
```

### Pattern 2: Calling Actions
```typescript
const { uiStore } = useStores()
<Button onPress={() => uiStore.showError("Oops!")} />
```

### Pattern 3: Conditional Rendering
```typescript
const { userStore, uiStore } = useStores()
return (
  <View>
    {uiStore.isLoading && <Spinner />}
    {userStore.isAuthenticated ? <Home /> : <Login />}
  </View>
)
```

### Pattern 4: Using Computed Values
```typescript
const { userStore } = useStores()
// displayName is a computed property (view)
<Text>Welcome, {userStore.displayName}!</Text>
```

## 🚨 Common Mistakes

### ❌ Forgetting observer
```typescript
// Won't update when store changes!
const MyScreen = () => {
  const { userStore } = useStores()
  return <Text>{userStore.name}</Text>
}
```

### ✅ Always use observer
```typescript
// Will update when store changes
const MyScreen = observer(() => {
  const { userStore } = useStores()
  return <Text>{userStore.name}</Text>
})
```

### ❌ Mutating store directly
```typescript
const { userStore } = useStores()
userStore.name = "New Name" // DON'T DO THIS!
```

### ✅ Use actions
```typescript
const { userStore } = useStores()
userStore.setUser({ ...user, name: "New Name" }) // ✅ Correct
```

## 📦 Available Stores

### userStore
```typescript
const { userStore } = useStores()

// Properties
userStore.id
userStore.email
userStore.name
userStore.avatar
userStore.preferences.theme
userStore.preferences.notificationsEnabled

// Computed
userStore.isAuthenticated
userStore.displayName

// Actions
userStore.setUser({ id, email, name, avatar })
userStore.updatePreferences({ theme: "dark" })
userStore.logout()
```

### uiStore
```typescript
const { uiStore } = useStores()

// Properties
uiStore.isLoading
uiStore.errorMessage
uiStore.isModalOpen
uiStore.modalContent

// Computed
uiStore.hasError

// Actions
uiStore.setLoading(true)
uiStore.showError("Error message")
uiStore.clearError()
uiStore.openModal("content")
uiStore.closeModal()
```

## 🎨 Real Examples

See `USAGE_EXAMPLES.tsx` for copy-paste examples:
- User profile screen
- Loading states
- Settings management
- Async operations
- Multiple store usage

## 📚 Next Steps

1. **Start using** stores in new features
2. **Check Reactotron** to see state updates
3. **Read** full documentation in `README.md`
4. **Create** new stores when needed

## 🆘 Need Help?

- Full docs: `README.md`
- Examples: `USAGE_EXAMPLES.tsx`
- MST docs: https://mobx-state-tree.js.org/
