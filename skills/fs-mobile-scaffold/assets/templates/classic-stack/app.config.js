module.exports = ({ config }) => ({
  ...config,
  name: "__APP_NAME__",
  slug: "__SLUG__",
  scheme: "__SLUG__",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    ...config.ios,
    bundleIdentifier: "__BUNDLE_ID__",
    supportsTablet: false,
  },
  android: {
    ...config.android,
    package: "__BUNDLE_ID__",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  plugins: [
    "expo-secure-store",
    "expo-splash-screen",
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        ios: { useFrameworks: "static" },
      },
    ],
  ],
  updates: {
    url: "__EAS_UPDATE_URL__",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  extra: {
    eas: {
      projectId: "__EAS_PROJECT_ID__",
    },
  },
});
