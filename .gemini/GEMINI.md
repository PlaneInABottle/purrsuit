# Project Context

<!-- Generated: 2025-12-13T19:30:45Z | Template Version: 2.0.0 -->

<project_identity>

## Project Information

### Description

A cross-platform mobile app for tracking and managing pet encounters with photo capture, location tracking, and detailed encounter analytics. Built with Expo for seamless iOS/Android deployment.

### Key Technologies

React Native 0.81.5 with New Architecture (Hermes), Expo 54.0.23 (dev client), MobX State Tree 7.0.2 for global state, React Navigation 7.x (native stack + bottom tabs), TypeScript 5.9.2 (strict mode), Expo Camera (photo capture with editing), Expo Location (GPS tracking), MapLibre React Native (offline-capable mapping), i18next + react-i18next (internationalization), Lucide React Native (icons), Maestro (E2E testing), MMKV (fast persistent storage)
</project_identity>

---

<few_shot_examples>

## Project-Specific Examples

```typescript
// app/models/EncounterStore.ts
import { types, flow, getEnv } from "mobx-state-tree"
import type { IRootStore } from "./RootStore"
export const EncounterStoreModel = types
  .model("EncounterStore", {
    encounters: types.map(EncounterModel),
    isLoading: false,
  })
  .views((self) => ({
    get encountersArray() {
      return Array.from(self.encounters.values())
    },
  }))
  .actions((self) => ({
    // Async action using flow
    fetchEncounters: flow(function* () {
      self.isLoading = true
      try {
        const api = getEnv(self).api
        const response = yield api.getEncounters()
        if (response.ok) {
          self.encounters.clear()
          response.data.forEach((encounter) => {
            self.encounters.put(encounter)
          })
        }
      } finally {
        self.isLoading = false
      }
    }),
    // Simple property setter
    setLoading(loading: boolean) {
      self.isLoading = loading
    },
  }))
```
```typescript
// app/screens/HomeScreen.tsx
import { observer } from "mobx-react-lite"
import { FlatList } from "react-native"
import { useStores } from "@/models"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
export const HomeScreen = observer(function HomeScreen(
  _props: MainTabScreenProps<"Home">
) {
  const { encountersStore } = useStores()
  
  return (
    <FlatList
      data={encountersStore.encountersArray}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EncounterCard encounter={item} />
      )}
    />
  )
})
```
```typescript
// app/services/camera.ts
export async function requestCameraPermissions(): Promise<CameraPermissionStatus> {
  try {
    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync()
    return {
      granted: status === "granted",
      canAskAgain,
    }
  } catch (error) {
    console.error("Failed to request camera permissions:", error)
    return { granted: false, canAskAgain: false }
  }
}
// Usage in component
const handleCapture = async () => {
  const permission = await requestCameraPermissions()
  if (permission.granted) {
    // Proceed with camera
  }
}
```
```typescript
// app/navigators/MainTabNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
const Tab = createBottomTabNavigator<MainTabParamList>()
export function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={focused ? "primary" : "textDim"} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
```
```typescript
// app/models/EncounterStore.ts
const Photo = types.model("Photo", {
  original: types.string,    // File path to original image
  thumbnail: types.string,   // File path to thumbnail
})
const Location = types.model("Location", {
  type: types.enumeration(["none", "manual", "gps"]),
  label: types.maybe(types.string), // "Coffee shop on 5th"
  coordinates: types.maybe(
    types.model({
      latitude: types.number,
      longitude: types.number,
    }),
  ),
})
export const EncounterModel = types
  .model("Encounter", {
    id: types.identifier,
    timestamp: types.number,
    photos: Photo,
    petType: types.enumeration(["cat", "dog", "other"]),
    location: types.optional(Location, { type: "none" }),
    note: types.maybe(types.string),
  })
  .views((self) => ({
    get formattedDate() {
      return new Date(self.timestamp).toLocaleDateString()
    },
  }))
```
</few_shot_examples>

---

<architecture>
## Architecture Patterns

MobX State Tree (RootStore, UiStore, UserStore, EncounterStore, StatsStore, StickerStore), Feature-based folder structure (screens, navigators, services, models), Service layer: API integration, Camera service, Location service, Offline Map Manager, Navigator: Tab-based navigation with nested stacks, Encounter management: Create, edit, view, filter, delete, and analytics, Photo pipeline: Capture → Edit → Store, MapLibre integration with offline tile caching (internet only for initial load), Privacy-first: Optional location, offline-first storage
</architecture>

---

<code_style>

## Code Style Guidelines

- TypeScript strict mode enforced
- ESLint with Expo config + Prettier for formatting
- Functional components with React hooks
- Props destructuring mandatory
- Named exports for all components and services
- Folder-scoped barrel exports (index.ts)
- Consistent naming: PascalCase for components, camelCase for functions
</code_style>

---

<file_organization>

## File Organization

app/
├── screens/              # Screen components (Home, Capture, Encounter, Map, etc.)
├── navigators/           # Navigation setup (AppNavigator, navigation utilities)
├── components/           # Reusable UI components (Toggle, etc.)
├── models/               # MobX State Tree stores (RootStore, feature stores)
├── services/             # Business logic (API, Camera, Location)
├── utils/                # Utility functions (storage, gesture handler)
├── theme/                # Theme, colors, typography
├── i18n/                 # Internationalization strings
├── config/               # App configuration
├── devtools/             # Dev tools (Reactotron)
└── app.tsx               # App entry point
</file_organization>

---

<testing>
## Testing Strategy

Jest 29.7 with jest-expo for React Native testing, React Testing Library for component tests, Testing Library React Native for native component testing, Maestro for E2E testing across platforms, Mock Expo modules in tests, Current: Basic model and service tests (EncounterStore, Location, i18n), Target: Expand coverage for user workflows (capture, edit, map interaction), Test actual behavior, not implementation details
</testing>

---

<dependencies>
## Dependency Management

- Use Expo-provided modules when available (Camera, Location, FileSystem, etc.)
- Minimize native dependencies; pre-build only when necessary
- Pin Expo and major framework versions (React Native, MST)
- Allow patch updates for bug fixes
- Regularly audit with 'npm audit' for security
- Document why each major dependency is needed
- Keep devDependencies separate from production
</dependencies>

---

<development_workflow>

## Development Workflow


</development_workflow>

---

<implementation_guidelines>

## Implementation Guidelines


</implementation_guidelines>

---

<common_patterns>

## Common Code Patterns

### MST Store Patterns

#### Computed Properties (Views)
```typescript
.views((self) => ({
  // Simple computed
  get totalEncounters() {
    return self.encounters.size
  },
  
  // Complex computed with filtering
  get recentEncounters() {
    return Array.from(self.encounters.values())
      .filter(encounter => 
        Date.now() - encounter.timestamp < 7 * 24 * 60 * 60 * 1000 // 7 days
      )
      .sort((a, b) => b.timestamp - a.timestamp)
  },
  
  // Computed with parameters
  encounterById(id: string) {
    return self.encounters.get(id)
  },
}))
```

#### Action Patterns
```typescript
.actions((self) => ({
  // Property setter (auto-generated helper available)
  setLoading(value: boolean) {
    self.isLoading = value
  },
  
  // Simple action
  addEncounter(encounter: Encounter) {
    self.encounters.put(encounter)
  },
  
  // Async action with flow
  deleteEncounter: flow(function* (id: string) {
    try {
      const api = getEnv(self).api
      yield api.deleteEncounter(id)
      self.encounters.delete(id)
    } catch (error) {
      console.error('Failed to delete encounter:', error)
      throw error
    }
  }),
  
  // Complex action with multiple steps
  createEncounter: flow(function* (data: EncounterInput) {
    self.isLoading = true
    try {
      // 1. Validate data
      if (!data.photos?.original) {
        throw new Error('Photo is required')
      }
      
      // 2. Call API
      const api = getEnv(self).api
      const response = yield api.createEncounter(data)
      
      // 3. Update local state
      if (response.ok) {
        self.encounters.put(response.data)
        return response.data
      } else {
        throw new Error(response.problem)
      }
    } finally {
      self.isLoading = false
    }
  }),
}))
```

### Component Patterns

#### Observer Component Structure
```typescript
export const EncounterList = observer(function EncounterList() {
  const { encountersStore } = useStores()
  
  // Don't destructure store properties in render
  // This breaks reactivity - access via store object
  
  if (encountersStore.isLoading) {
    return <LoadingSpinner />
  }
  
  return (
    <FlatList
      data={encountersStore.encountersArray}
      renderItem={({ item }) => <EncounterItem encounter={item} />}
    />
  )
})
```

#### Custom Hook Pattern
```typescript
// utils/useEncounterActions.ts
export function useEncounterActions() {
  const { encountersStore, uiStore } = useStores()
  
  const deleteEncounter = useCallback(async (id: string) => {
    try {
      uiStore.setLoading(true)
      await encountersStore.deleteEncounter(id)
      uiStore.showSuccess('Encounter deleted')
    } catch (error) {
      uiStore.showError('Failed to delete encounter')
    } finally {
      uiStore.setLoading(false)
    }
  }, [encountersStore, uiStore])
  
  return { deleteEncounter }
}

// Usage in component
export const EncounterCard = observer(function EncounterCard({ encounter }) {
  const { deleteEncounter } = useEncounterActions()
  
  return (
    <Card>
      <Button onPress={() => deleteEncounter(encounter.id)}>
        Delete
      </Button>
    </Card>
  )
})
```

### Navigation Patterns

#### Type-Safe Navigation
```typescript
// In screen component
export const HomeScreen = observer(function HomeScreen(
  props: MainTabScreenProps<'Home'>
) {
  const navigation = useNavigation<MainTabNavigationProp>()
  
  const goToEncounter = (encounterId: string) => {
    navigation.navigate('EncounterDetail', { encounterId })
  }
  
  return (
    <Button onPress={() => goToEncounter(encounter.id)}>
      View Details
    </Button>
  )
})
```

#### Navigation Options Pattern
```typescript
// In navigator
<Tab.Screen
  name="Home"
  component={HomeScreen}
  options={({ route }) => ({
    title: 'My Pets',
    tabBarIcon: ({ focused, color, size }) => (
      <Icon 
        icon="home" 
        size={size} 
        color={focused ? colors.primary : colors.textDim} 
      />
    ),
    headerRight: () => (
      <HeaderButton onPress={handleSettings} />
    ),
  })}
/>
```

### Storage Patterns

#### MMKV Usage
```typescript
// utils/storage.ts
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

// Typed storage helpers
export function getUserPreferences(): UserPreferences {
  const stored = storage.getString('userPreferences')
  return stored ? JSON.parse(stored) : defaultPreferences
}

export function setUserPreferences(prefs: UserPreferences) {
  storage.set('userPreferences', JSON.stringify(prefs))
}

// Usage in store
.actions((self) => ({
  loadPreferences() {
    const prefs = getUserPreferences()
    self.preferences = prefs
  },
  
  updatePreferences(newPrefs: Partial<UserPreferences>) {
    self.preferences = { ...self.preferences, ...newPrefs }
    setUserPreferences(self.preferences)
  },
}))
```

### API Integration Patterns

#### Service Layer Structure
```typescript
// services/api/index.ts
export interface ApiConfig {
  url: string
  timeout: number
}

export function createApi(config: ApiConfig) {
  const apisauce = create({
    baseURL: config.url,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  return {
    // Encounters
    getEncounters: () => apisauce.get('/encounters'),
    createEncounter: (data: EncounterInput) => apisauce.post('/encounters', data),
    deleteEncounter: (id: string) => apisauce.delete(`/encounters/${id}`),
    
    // User
    getUser: () => apisauce.get('/user'),
    updateUser: (data: UserUpdate) => apisauce.patch('/user', data),
  }
}
```

#### Error Handling in API Calls
```typescript
// services/api/apiProblem.ts
export type ApiProblem =
  | 'TIMEOUT_ERROR'
  | 'NETWORK_ERROR' 
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR'
  | 'CANCEL_ERROR'

export function getApiProblem(response: ApiResponse): ApiProblem | void {
  // Map HTTP status and response to problem types
  if (response.problem === 'TIMEOUT') return 'TIMEOUT_ERROR'
  if (response.problem === 'NETWORK_ERROR') return 'NETWORK_ERROR'
  if (!response.ok) return 'SERVER_ERROR'
}

// Usage in store actions
const response = yield api.getEncounters()
if (!response.ok) {
  const problem = getApiProblem(response)
  throw new Error(`Failed to fetch encounters: ${problem}`)
}
```

### File System Patterns

#### Photo Storage
```typescript
// utils/fileSystem.ts
import * as FileSystem from 'expo-file-system'

export const PHOTOS_DIR = `${FileSystem.documentDirectory}purrsuit/photos/`
export const THUMBNAILS_DIR = `${FileSystem.documentDirectory}purrsuit/thumbnails/`

export async function ensureDirectoriesExist() {
  await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true })
  await FileSystem.makeDirectoryAsync(THUMBNAILS_DIR, { intermediates: true })
}

export async function savePhoto(uri: string, filename: string): Promise<string> {
  await ensureDirectoriesExist()
  const destination = `${PHOTOS_DIR}${filename}`
  await FileSystem.copyAsync({ from: uri, to: destination })
  return destination
}

// Usage in camera service
export async function captureAndSavePhoto(): Promise<PhotoPaths> {
  const photo = await Camera.takePictureAsync()
  
  const filename = `photo_${Date.now()}.jpg`
  const originalPath = await savePhoto(photo.uri, filename)
  
  // Create thumbnail
  const thumbnail = await ImageManipulator.manipulateAsync(
    photo.uri,
    [{ resize: { width: 200 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  )
  
  const thumbnailFilename = `thumb_${filename}`
  const thumbnailPath = await savePhoto(thumbnail.uri, thumbnailFilename)
  
  return {
    original: originalPath,
    thumbnail: thumbnailPath,
  }
}
```
</common_patterns>

---

<troubleshooting>
## Troubleshooting Guide


</troubleshooting>

---

<project_notes>

## Project-Specific Notes

Mobile-first development with Expo. Use 'expo start --dev-client' for development. Pre-build: 'eas build --profile development --local'. MapLibre requires internet only for initial tile download, then works offline. Location features are optional and privacy-focused. Photo editing uses expo-image-manipulator. State persists via MMKV. Long-press to delete encounters. Multiple map styles available. Internationalization supports 6 languages.
</project_notes>

---

<specialized_agents>


</specialized_agents>
