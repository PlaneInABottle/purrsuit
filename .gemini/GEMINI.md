# PurrsuitMobileApp - Project Context

<!-- Generated: 2025-11-19T17:37:57Z | Template Version: 1.0.0 -->

<project_identity>
## Project Information

**Name:** PurrsuitMobileApp  
**Type:** mobile  
**Language:** TypeScript  
**Stack:** React Native 0.81.5, Expo 54, MobX State Tree, React Navigation

### Description
A cross-platform mobile app for tracking and managing pet encounters with photo capture, location tracking, and detailed encounter analytics. Built with Expo for seamless iOS/Android deployment.

### Key Technologies
- React Native 0.81.5 with New Architecture (Hermes)
- Expo 54.0.23 (dev client)
- MobX State Tree 7.0.2 for global state
- React Navigation 7.x (native stack + bottom tabs)
- TypeScript 5.9.2 (strict mode)
- Expo Camera (photo capture with editing)
- Expo Location (GPS tracking)
- React Native Maps (location visualization)
- i18next + react-i18next (internationalization)
- Lucide React Native (icons)
- Maestro (E2E testing)
</project_identity>

---

<architecture>
## Architecture Patterns

- MobX State Tree (RootStore, UiStore, UserStore, EncounterStore, StatsStore, StickerStore)
- Feature-based folder structure (screens, navigators, services, models)
- Service layer: API integration, Camera service, Location service
- Navigator: Tab-based navigation with nested stacks
- Encounter management: Create, edit, view, filter, and analytics
- Photo pipeline: Capture → Edit → Store
- Map integration for encounter visualization
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

- Jest 29.7 with jest-expo for React Native testing
- React Testing Library for component tests
- Testing Library React Native for native component testing
- Maestro for E2E testing across platforms
- Mock Expo modules in tests
- Test user workflows: capture photo, create encounter, view map
- Aim for >70% coverage on models and services
- Test actual behavior, not implementation details
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

<project_notes>
## Project-Specific Notes

Mobile-first development with Expo. Use 'expo start --dev-client' for development. Pre-build: 'eas build --profile development --local'. Map and Location features require permissions in app.json. Photo editing uses expo-image-manipulator. State persists via MMKV (fast, persistent storage).
</project_notes>
