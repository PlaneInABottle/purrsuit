# Onboarding & Welcome Flow Implementation Plan

## Goal
Implement a user-friendly onboarding flow that introduces the app, requests necessary permissions (Camera), and lets the user choose their preferred location privacy level.

## UX Flow (from PRODUCT_PLAN.md)

1.  **Screen 1: Welcome**
    *   **Visual:** Cute mascot/logo, welcoming text.
    *   **Copy:** "Welcome to Purrsuit! 🐾", "Your private journal for pets you meet".
    *   **Action:** [Get Started] button.

2.  **Screen 2: Permissions (Camera)**
    *   **Visual:** Camera icon/illustration.
    *   **Copy:** "Let's capture some moments! 📸", "Purrsuit needs camera access to save pet photos".
    *   **Action:** [Allow Camera] button (triggers system permission dialog).
    *   **Fallback:** If denied, show explanation or "Open Settings".

3.  **Screen 3: Location Choice (Privacy First)**
    *   **Visual:** Map/Pin icons.
    *   **Copy:** "How would you like to remember places?"
    *   **Options:**
        *   **Option 1: No Location** (Default) - "I'll remember on my own".
        *   **Option 2: Manual Tags** (Recommended) - "I'll type location names".
        *   **Option 3: GPS Location** - "Use GPS coordinates" (triggers system permission).
    *   **Action:** [Continue] button.

4.  **Screen 4: Ready!**
    *   **Visual:** Celebration confetti/party popper.
    *   **Copy:** "You're all set! Go find some furry friends 🐱🐶".
    *   **Action:** [Start Exploring] button (Navigates to MainTabs).

## Technical Implementation

### 1. State Management (`UserStore`)
*   Add `hasCompletedOnboarding` (boolean) to `UserStore`.
*   Add `locationPermissionType` ('none' | 'manual' | 'gps') to `UserStore`.
*   Persist these values using MMKV (already set up in RootStore).

### 2. Navigation (`AppNavigator`)
*   Uncomment `Welcome` screen in `AppStack`.
*   Add logic to conditionally show `Welcome` screen as the initial route if `!hasCompletedOnboarding`.
    *   *Note:* Since `initialRouteName` is static, we might need a "Loading" or "Bootstrap" screen, or just check the store in `AppNavigator` before rendering.

### 3. Components & Screens
*   **`WelcomeScreen.tsx`**: Refactor existing or create new. Use a `PagerView` or simple state-based step wizard for the 4 steps.
*   **Step 1 (Intro):** Simple layout.
*   **Step 2 (Camera):** Use `expo-camera`'s `useCameraPermissions`.
*   **Step 3 (Location):** Use `expo-location` (only if GPS selected). Update `UserStore`.
*   **Step 4 (Finish):** Update `UserStore.hasCompletedOnboarding = true` and navigate to `MainTabs`.

### 4. Assets
*   Ensure we have necessary icons (Camera, Map, Checkmark) from `lucide-react-native`.
*   Use existing `assets/images/welcome-face.png` if available.

## Checklist
- [ ] Update `UserStore` with onboarding state.
- [ ] Create/Update `WelcomeScreen` with multi-step wizard logic.
- [ ] Implement Camera permission handling.
- [ ] Implement Location preference selection.
- [ ] Update `AppNavigator` to route correctly based on onboarding status.
- [ ] Verify persistence (restarting app shouldn't show onboarding again).
