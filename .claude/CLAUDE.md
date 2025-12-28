# Purrsuit Mobile App - Claude Guide

This guide defines the project structure, development patterns, and available AI skills for the Purrsuit Mobile App.

## Project Identity
A pet encounter tracking app using Expo, MST, and MapLibre. Built for offline-first resilience and privacy.

## Architecture
- **State**: MobX State Tree (RootStore pattern).
- **Navigation**: React Navigation 7 (Nested Tabs inside Stack).
- **Maps**: MapLibre with offline tile management.
- **Storage**: Encrypted MMKV via Expo SecureStore.
- **Photos**: Expo Camera (v17) with SVG-based sticker creation.

## AI Skills (Automated Workflows)
Leverage these skills in `.claude/skills/` for consistent implementation:

### 1. mobx-state-tree-store-builder
- **Purpose**: Create models/stores with correct MST typing.
- **Usage**: Use when adding new domain entities or collection stores.

### 2. expo-camera-workflow
- **Purpose**: Unified photo capture and sticker creation pipeline.
- **Usage**: Implementation of camera features and image manipulation.

### 3. react-native-navigation-builder
- **Purpose**: Type-safe navigation configuration.
- **Usage**: Adding new screens, tabs, or modal flows.

### 4. maplibre-offline-map-manager
- **Purpose**: Offline tile caching and GPS tracking.
- **Usage**: Map feature development and location permission handling.

### 5. react-native-i18n-workflow
- **Purpose**: Internationalization management.
- **Usage**: Adding text content or new language support.

### 6. react-native-testing-patterns
- **Purpose**: Quality assurance templates.
- **Usage**: Writing Jest, RTL, or Maestro tests.

### 7. react-native-storage-manager
- **Purpose**: Encrypted data persistence.
- **Usage**: Storing user preferences, tokens, or app state.

## Best Practices
- **TypeScript**: Strict mode enabled. Use explicit interfaces for MST snapshots.
- **Components**: Functional components only. Mandatory props destructuring.
- **Styling**: use `useAppTheme` hook. Styles should be externalized to constants with `$` prefix.
- **i18n**: Support dot and colon notation. Sync all languages with `en.ts`.
- **Git**: Branch from `main`. Use conventional commits.

## Testing
- **Unit**: Jest + MST.
- **Component**: React Testing Library React Native.
- **E2E**: Maestro (flows in `.maestro/`).