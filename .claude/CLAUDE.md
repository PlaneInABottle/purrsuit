# Project Context

<!-- Generated: 2025-12-13T16:14:29Z | Template Version: 2.0.0 -->

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

GitHub Actions CI: lint, type-check, test, bundle verification, EAS Build profiles: development (local), preview, production, Development: 'expo start --dev-client', Testing: 'npm test' (unit), 'maestro test' (E2E), Build: 'eas build --profile development --platform ios/android --local', Deploy: 'eas build --profile production --platform ios/android'
</development_workflow>

---

<implementation_guidelines>

## Implementation Guidelines


</implementation_guidelines>

---

<common_patterns>

## Common Code Patterns


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
