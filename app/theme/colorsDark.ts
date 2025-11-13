const palette = {
  // Inverted soft neutrals with warm undertone
  neutral900: "#FFFFFF",
  neutral800: "#F9F7F7",
  neutral700: "#E8E4E6",
  neutral600: "#C8C3C5",
  neutral500: "#9B9497",
  neutral400: "#6B6466",
  neutral300: "#453F42",
  neutral200: "#2A2528",
  neutral100: "#000000",

  // Adjusted coral for dark mode (slightly less saturated)
  primary600: "#FFE8E5",
  primary500: "#FFCEC7",
  primary400: "#FFB3A7",
  primary300: "#FF9A8A",
  primary200: "#FF8A80",
  primary100: "#E6756C",

  // Adjusted lavender for dark mode
  secondary600: "#F3E5F5",
  secondary500: "#E1BEE7",
  secondary400: "#CE93D8",
  secondary300: "#BA68C8",
  secondary200: "#9575CD",
  secondary100: "#7E57C2",

  // Adjusted yellow for dark mode (less bright)
  accent600: "#FFF9E6",
  accent500: "#FFF4CC",
  accent400: "#FFECB3",
  accent300: "#FFE082",
  accent200: "#FFD54F",
  accent100: "#FFC400",

  // Success for dark mode
  success100: "#E8F5E9",
  success500: "#81C784",

  // Error for dark mode
  error100: "#FFEBEE",
  error500: "#EF5350",

  overlay20: "rgba(255, 255, 255, 0.2)",
  overlay50: "rgba(255, 255, 255, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  background: palette.neutral200,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  error: palette.error500,
  errorBackground: palette.error100,
  overlay20: palette.overlay20,
  overlay50: palette.overlay50,
} as const
