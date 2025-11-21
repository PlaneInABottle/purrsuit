import { View, ViewStyle, ScrollView, TextStyle, TouchableOpacity } from "react-native"
import { ArrowLeft } from "lucide-react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"

export const LegalScreen = ({ navigation, route }: AppStackScreenProps<"Legal">) => {
  const { type } = route.params
  const {
    theme: { colors },
  } = useAppTheme()

  const isPrivacy = type === "privacy"
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service"
  const lastUpdated = "November 18, 2025"

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={$container}
      backgroundColor="white"
    >
      <View style={$header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text preset="heading" text={title} style={$headerTitle} />
        <View style={$headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={$content} showsVerticalScrollIndicator={false}>
        <Text text={`Last Updated: ${lastUpdated}`} style={$lastUpdated} />

        {isPrivacy ? (
          <>
            <Text preset="subheading" text="1. Introduction" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="Purrsuit ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how your information is collected, used, and disclosed by Purrsuit."
            />

            <Text preset="subheading" text="2. Data Collection" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="Purrsuit is designed as an offline-first application. Most of your data, including photos, encounter details, and notes, is stored locally on your device."
            />
            <Text
              style={$paragraph}
              text="We do not upload your personal data to any cloud server. All photos, encounter details, and notes remain exclusively on your device."
            />

            <Text preset="subheading" text="3. Location Data" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="You may choose to associate location data with your pet encounters. This location data is stored locally on your device. We do not track your location in the background or share your location history with third parties."
            />

            <Text preset="subheading" text="4. Data Backup" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="Since Purrsuit does not provide cloud backup services, you are solely responsible for backing up your device to prevent data loss."
            />

            <Text preset="subheading" text="5. Third-Party Services" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="We may use third-party services for specific features, such as maps (Google Maps). These services may collect data as governed by their own privacy policies."
            />

            <Text preset="subheading" text="6. Your Rights" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="Since your data is stored locally, you have full control over it. You can delete your data at any time by uninstalling the application or using the in-app delete functions."
            />
          </>
        ) : (
          <>
            <Text preset="subheading" text="1. Acceptance of Terms" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="By accessing or using the Purrsuit mobile application, you agree to be bound by these Terms of Service."
            />

            <Text preset="subheading" text="2. Use of the App" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="You are responsible for your use of the app and for any content you create or store using the app. You agree not to use the app for any illegal or unauthorized purpose."
            />

            <Text preset="subheading" text="3. User Content" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="You retain all rights to the photos and data you create. Purrsuit does not claim ownership of your content."
            />

            <Text preset="subheading" text="4. Disclaimer" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="The app is provided 'as is' without warranties of any kind. We are not responsible for any data loss or damages resulting from the use of the app. Please ensure you back up your device regularly."
            />

            <Text preset="subheading" text="5. Changes to Terms" style={$sectionTitle} />
            <Text
              style={$paragraph}
              text="We reserve the right to modify these terms at any time. Continued use of the app constitutes acceptance of the updated terms."
            />
          </>
        )}

        <View style={$footerSpacer} />
      </ScrollView>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}

const $header: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#F0F0F0",
}

const $backButton: ViewStyle = {
  padding: 8,
  marginLeft: -8,
}

const $headerTitle: TextStyle = {
  fontSize: 20,
}

const $content: ViewStyle = {
  padding: 20,
}

const $lastUpdated: TextStyle = {
  fontSize: 12,
  color: "#888",
  marginBottom: 24,
}

const $sectionTitle: TextStyle = {
  marginTop: 16,
  marginBottom: 8,
  fontSize: 18,
  color: "#333",
}

const $paragraph: TextStyle = {
  fontSize: 15,
  lineHeight: 24,
  color: "#555",
  marginBottom: 12,
}

const $footerSpacer: ViewStyle = {
  height: 40,
}

const $headerSpacer: ViewStyle = {
  width: 40,
}
