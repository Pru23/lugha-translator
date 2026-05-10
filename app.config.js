export default {
  expo: {
    name: "Lugha Translator",
    slug: "lugha-translator",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#FAFAF8",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourname.lugha",
      infoPlist: {
        NSSpeechRecognitionUsageDescription: "Used for text-to-speech playback",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#FAFAF8",
      },
      package: "com.yourname.lugha",
    },
    extra: {
      anthropicKey: process.env.EXPO_PUBLIC_ANTHROPIC_KEY,
    },
  },
};