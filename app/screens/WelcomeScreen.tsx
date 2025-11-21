import React, { FC, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, Alert, Linking } from "react-native"
import { useCameraPermissions } from "expo-camera"
import * as Location from "expo-location"
import { Camera, MapPin, Check, Map, Navigation } from "lucide-react-native"
import { observer } from "mobx-react-lite"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useStores } from "@/models"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

const welcomeFace = require("@assets/images/welcome-face.png")

export const WelcomeScreen: FC<AppStackScreenProps<"Welcome">> = observer(function WelcomeScreen({
  navigation,
}) {
  const {
    theme: { colors, spacing },
  } = useAppTheme()
  const { userStore } = useStores()
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const [step, setStep] = useState(0)
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [locationChoice, setLocationChoice] = useState<"none" | "manual" | "gps">("manual")

  // Step 1: Welcome
  const renderWelcomeStep = () => (
    <View style={$stepContainer}>
      <View style={$iconContainer}>
        <Image
          source={welcomeFace}
          style={$welcomeImage}
          resizeMode="contain"
        />
      </View>
      <Text preset="heading" text="Welcome to Purrsuit! 🐾" style={$heading} />
      <Text
        preset="subheading"
        text="Your private journal for the adorable pets you meet every day."
        style={$subheading}
      />
      <View style={$spacer} />
      <Button
        text="Get Started"
        preset="filled"
        onPress={() => setStep(1)}
        style={$button}
      />
    </View>
  )

  // Step 2: Camera Permissions
  const handleCameraPermission = async () => {
    if (cameraPermission?.granted) {
      setStep(2)
      return
    }

    const result = await requestCameraPermission()
    if (result.granted) {
      setStep(2)
    } else {
      Alert.alert(
        "Camera Required",
        "Purrsuit needs camera access to snap photos of pets! Please enable it in settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      )
    }
  }

  const renderCameraStep = () => (
    <View style={$stepContainer}>
      <View style={[$iconCircle, { backgroundColor: colors.palette.primary100 }]}>
        <Camera size={64} color={colors.palette.primary500} />
      </View>
      <Text preset="heading" text="Capture Moments 📸" style={$heading} />
      <Text
        text="Purrsuit needs camera access to save photos of the furry friends you find."
        style={$bodyText}
      />
      <View style={$spacer} />
      <Button
        text={cameraPermission?.granted ? "Camera Enabled ✅" : "Allow Camera Access"}
        preset="filled"
        onPress={handleCameraPermission}
        style={$button}
      />
      {!cameraPermission?.granted && (
        <Button
          text="Maybe Later"
          preset="reversed"
          onPress={() => setStep(2)}
          style={$secondaryButton}
        />
      )}
    </View>
  )

  // Step 3: Location Choice
  const handleLocationChoice = async () => {
    if (locationChoice === "gps") {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Denied",
          "We couldn't access your location. Switching to Manual Tags mode.",
          [{ text: "OK", onPress: () => setLocationChoice("manual") }]
        )
        return
      }
    }
    
    userStore.setLocationPermission(locationChoice)
    setStep(3)
  }

  const renderLocationStep = () => (
    <View style={$stepContainer}>
      <View style={[$iconCircle, { backgroundColor: colors.palette.secondary100 }]}>
        <Map size={64} color={colors.palette.secondary500} />
      </View>
      <Text preset="heading" text="Remember Places 📍" style={$heading} />
      <Text
        text="How would you like to remember where you met these pets?"
        style={$bodyText}
      />

      <View style={$optionsContainer}>
        <OptionItem
          icon={<MapPin size={24} color={colors.palette.neutral500} />}
          title="Manual Tags (Recommended)"
          description="Type names like 'Park' or 'Cafe'"
          isSelected={locationChoice === "manual"}
          onPress={() => setLocationChoice("manual")}
        />
        <OptionItem
          icon={<Navigation size={24} color={colors.palette.neutral500} />}
          title="GPS Location"
          description="Automatically save coordinates"
          isSelected={locationChoice === "gps"}
          onPress={() => setLocationChoice("gps")}
        />
        <OptionItem
          icon={<Check size={24} color={colors.palette.neutral500} />}
          title="No Location"
          description="Just the photos, please"
          isSelected={locationChoice === "none"}
          onPress={() => setLocationChoice("none")}
        />
      </View>

      <View style={$spacer} />
      <Button
        text="Continue"
        preset="filled"
        onPress={handleLocationChoice}
        style={$button}
      />
    </View>
  )

  // Step 4: Ready
  const handleFinish = () => {
    userStore.completeOnboarding()
    // Navigation will automatically handle the switch to MainTabs 
    // because of the conditional rendering in AppNavigator (once we implement it)
    // But for now, we can also explicitly navigate if needed, 
    // though the state change usually triggers a re-render of the navigator.
  }

  const renderReadyStep = () => (
    <View style={$stepContainer}>
      <View style={[$iconCircle, { backgroundColor: colors.palette.accent100 }]}>
        <Text text="🎉" style={{ fontSize: 64 }} />
      </View>
      <Text preset="heading" text="You're All Set!" style={$heading} />
      <Text
        text="Go find some furry friends and start your collection!"
        style={$bodyText}
      />
      <View style={$spacer} />
      <Button
        text="Start Exploring"
        preset="filled"
        onPress={handleFinish}
        style={$button}
      />
    </View>
  )

  return (
    <Screen 
      preset="fixed" 
      contentContainerStyle={[$container, $bottomContainerInsets]}
      backgroundColor={colors.background}
    >
      {step === 0 && renderWelcomeStep()}
      {step === 1 && renderCameraStep()}
      {step === 2 && renderLocationStep()}
      {step === 3 && renderReadyStep()}
      
      {/* Step Indicator */}
      <View style={$dotsContainer}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              $dot,
              { 
                backgroundColor: i === step ? colors.palette.primary500 : colors.palette.neutral300,
                width: i === step ? 24 : 8 
              }
            ]}
          />
        ))}
      </View>
    </Screen>
  )
})

interface OptionItemProps {
  icon: React.ReactNode
  title: string
  description: string
  isSelected: boolean
  onPress: () => void
}

const OptionItem = ({ icon, title, description, isSelected, onPress }: OptionItemProps) => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <View
      style={[
        $optionItem,
        {
          borderColor: isSelected ? colors.palette.primary500 : colors.palette.neutral200,
          backgroundColor: isSelected ? colors.palette.primary100 : colors.palette.neutral100,
        },
      ]}
      onTouchEnd={onPress}
    >
      <View style={$optionIcon}>{icon}</View>
      <View style={$optionText}>
        <Text preset="bold" text={title} style={{ color: colors.text }} />
        <Text size="xs" text={description} style={{ color: colors.textDim }} />
      </View>
      {isSelected && (
        <View style={$checkIcon}>
          <Check size={20} color={colors.palette.primary500} />
        </View>
      )}
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: 24,
  paddingTop: 60,
  paddingBottom: 24,
}

const $stepContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}

const $iconContainer: ViewStyle = {
  marginBottom: 40,
  height: 200,
  justifyContent: "center",
  alignItems: "center",
}

const $welcomeImage: ImageStyle = {
  width: 250,
  height: 250,
}

const $iconCircle: ViewStyle = {
  width: 120,
  height: 120,
  borderRadius: 60,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 32,
}

const $heading: TextStyle = {
  textAlign: "center",
  marginBottom: 16,
  fontSize: 28,
}

const $subheading: TextStyle = {
  textAlign: "center",
  fontSize: 18,
  lineHeight: 26,
  opacity: 0.8,
}

const $bodyText: TextStyle = {
  textAlign: "center",
  fontSize: 16,
  lineHeight: 24,
  opacity: 0.7,
  maxWidth: 300,
}

const $spacer: ViewStyle = {
  flex: 1,
}

const $button: ViewStyle = {
  width: "100%",
  marginBottom: 16,
}

const $secondaryButton: ViewStyle = {
  width: "100%",
}

const $optionsContainer: ViewStyle = {
  width: "100%",
  gap: 12,
  marginTop: 32,
}

const $optionItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: 16,
  borderRadius: 12,
  borderWidth: 2,
}

const $optionIcon: ViewStyle = {
  marginRight: 16,
}

const $optionText: ViewStyle = {
  flex: 1,
}

const $checkIcon: ViewStyle = {
  marginLeft: 8,
}

const $dotsContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  gap: 8,
  marginTop: 24,
}

const $dot: ViewStyle = {
  height: 8,
  borderRadius: 4,
}
