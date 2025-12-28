# Purrsuit Mobile App 🐾

Purrsuit is a cross-platform mobile application designed for tracking and managing pet encounters. Capture photos, log locations, and build your personal collection of animal friends found in the wild. Built with a focus on privacy, offline-first capability, and a delightful user experience.

## ✨ Features

- **📸 Capture & Collect**: Snap photos of cats, dogs, and other pets you meet.
- **🗺️ Map Visualization**: View your encounters on an interactive map using MapLibre (works offline!).
- **📍 Location Tracking**: Automatically tag encounters with GPS coordinates (privacy-focused, optional).
- **🔒 Secure Storage**: All your data is stored locally on your device, encrypted with AES-256 via MMKV and Expo SecureStore.
- **📱 Offline First**: Fully functional without an internet connection.
- **🎨 Customization**: Add moods, tags, and notes to every encounter.
- **🌙 Dark Mode**: Beautifully themed for both light and dark environments.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (Managed Workflow)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [MobX-State-Tree](https://mobx-state-tree.js.org/)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/)
- **Maps**: [MapLibre React Native](https://github.com/maplibre/maplibre-react-native)
- **Storage**: [MMKV](https://github.com/mamous/react-native-mmkv) (Encrypted) + [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- **Error Tracking**: [Sentry](https://sentry.io/) (Privacy-configured)
- **Testing**: Jest, Maestro

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (> 18.x)
- [Bun](https://bun.sh/) (Package Manager)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/purrsuit-mobile.git
    cd purrsuit-mobile
    ```

2.  **Install dependencies**
    ```bash
    bun install
    ```

3.  **Set up Environment Variables**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    *Note: API keys are optional for development but required for Sentry reporting.*

4.  **Run the App**
    ```bash
    # Start the development server
    bun start

    # Run on Android Emulator
    bun run android

    # Run on iOS Simulator
    bun run ios
    ```

## 🔐 Security & Privacy

Purrsuit is built with a "Privacy by Default" architecture:

*   **Local-First**: User data lives on the device. No cloud account is required.
*   **Encrypted Storage**: Sensitive data (locations, notes) is stored in MMKV using an encryption key secured by the device's hardware KeyStore/Keychain.
*   **Production Hardening**: Console logs are automatically stripped in production builds to prevent data leakage.
*   **Dependency Safety**: Dependencies are regularly audited for vulnerabilities.

## 🧪 Testing

We use **Jest** for unit/integration tests and **Maestro** for end-to-end testing.

```bash
# Run Unit Tests
bun run test

# Run Linting
bun run lint
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.