# Purrsuit Mobile App - Gemini CLI Guide

This document provides context and guidelines for the Purrsuit Mobile App project when interacting via the Gemini CLI.

## Project Overview

Purrsuit is a cross-platform mobile app built with **Expo** and **React Native** for tracking and managing pet encounters. It features photo capture, sticker creation, location tracking, and detailed analytics.

### Key Technologies
- **React Native 0.81.5** (Hermes & New Architecture)
- **Expo 54.0.23** (Dev Client)
- **MobX State Tree 7.0.2** (Global State)
- **React Navigation 7.x** (Nested Stack + Bottom Tabs)
- **MapLibre React Native** (Offline Maps)
- **MMKV** (Encrypted Persistent Storage)
- **Lucide React Native** (Icons)
- **i18next** (Internationalization)
- **Maestro** (E2E Testing)

## Core Mandates & Architecture

### Navigation Pattern
Nested structure: `AppNavigator` (Container) -> `AppStack` (Native Stack) -> `MainTabs` (Bottom Tabs). Modals are handled at the `AppStack` level.

### State Management
MST stores are centralized in `app/models/`. Every store must be integrated into the `RootStore`. Use `flow` for async actions and `views` for computed data.

### Storage & Security
We use **encrypted MMKV**. The encryption key is managed via **Expo SecureStore**. Use helpers from `@/utils/storage`.

### Photo Pipeline
Capture (`CameraView`) -> Edit (`PhotoEditScreen` / SVG Masking) -> Save (`FileSystem` / Document Directory).

## Available Skills

The following specialized skills are available in `.claude/skills/` and should be leveraged for development:

1. **`mobx-state-tree-store-builder`**: Automates store creation, RootStore integration, and proper typing.
2. **`expo-camera-workflow`**: Manages camera integration, permissions, and sticker creation logic.
3. **`react-native-navigation-builder`**: Handles type-safe navigation setup and screen parameters.
4. **`maplibre-offline-map-manager`**: Manages offline mapping, tile caching, and location services.
5. **`react-native-i18n-workflow`**: Streamlines translation management across multiple languages.
6. **`react-native-testing-patterns`**: Provides templates for unit (Jest), integration (RTL), and E2E (Maestro) tests.
7. **`react-native-storage-manager`**: Handles encrypted persistence and data validation patterns.

## Development Workflow

- **Run Dev Client**: `bun start` (expo start --dev-client)
- **Build Local**: `eas build --profile development --local`
- **Linting**: `bun run lint`
- **Testing**: `bun test`
- **E2E**: `bun run test:maestro`

## Project Conventions

- **Naming**: PascalCase for Components, camelCase for functions/vars.
- **Exports**: Named exports for all components and services.
- **Styling**: Unified theme via `app/theme/context.tsx`. Use `$prefix` for style objects.
- **Translations**: NEVER hardcode strings. Use `tx` prop or `translate()` helper.