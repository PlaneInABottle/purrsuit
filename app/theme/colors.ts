const palette = {
  // Soft neutrals with warm undertone
  neutral100: "#FFFFFF",
  neutral200: "#F9F7F7", // Softer warm white
  neutral300: "#E8E4E6", // Light warm gray
  neutral400: "#C8C3C5", // Medium warm gray
  neutral500: "#9B9497", // Balanced gray
  neutral600: "#6B6466", // Deep warm gray
  neutral700: "#453F42", // Rich dark gray
  neutral800: "#2A2528", // Almost black
  neutral900: "#000000",

  // Soft coral/peach primary (warm, approachable)
  primary100: "#FFE8E5", // Lightest peachy pink
  primary200: "#FFCEC7", // Light coral
  primary300: "#FFB3A7", // Soft coral
  primary400: "#FF9A8A", // Medium coral
  primary500: "#FF8A80", // Main coral (primary action)
  primary600: "#E6756C", // Deeper coral

  // Gentle lavender/purple secondary (calming, premium)
  secondary100: "#F3E5F5", // Lightest lavender
  secondary200: "#E1BEE7", // Light purple
  secondary300: "#CE93D8", // Soft purple
  secondary400: "#BA68C8", // Medium purple
  secondary500: "#9575CD", // Main lavender
  secondary600: "#7E57C2", // Deep purple

  // Sunny yellow accent (cheerful, energetic)
  accent100: "#FFF9E6", // Lightest yellow
  accent200: "#FFF4CC", // Light sunny
  accent300: "#FFECB3", // Soft yellow
  accent400: "#FFE082", // Warm yellow
  accent500: "#FFD54F", // Main sunny yellow
  accent600: "#FFC400", // Vibrant yellow

  // Success/stats - mint green
  success100: "#E8F5E9",
  success500: "#81C784",

  // Error/warning - keep softer
  error100: "#FFEBEE",
  error500: "#EF5350",

  overlay20: "rgba(42, 37, 40, 0.2)", // Updated to match new neutral800
  overlay50: "rgba(42, 37, 40, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.error500,
  /**
   * Error Background.
   */
  errorBackground: palette.error100,
  /**
   * Overlay colors for camera UI and modals.
   */
  overlay20: palette.overlay20,
  overlay50: palette.overlay50,
} as const
