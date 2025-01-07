module.exports = {
  android: {
    package: "nu.skoleglaede.batteri",
    permissions: ["android.permission.CAMERA"],
  },
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "4445138c-8d76-4f8e-a92c-e6e56c81924c",
    },
  },
  icon: "./assets/icon-light.png",
  ios: {
    bundleIdentifier: "nu.skoleglaede.batteri",
    config: {
      usesNonExemptEncryption: false,
    },
    entitlements: {
      "aps-environment": "development",
    },
    language: "da-DK",
    supportsTablet: false,
  },
  locales: {
    da: "./da.json",
  },
  name: "Skoleglæde.nu Batteri",
  newArchEnabled: true,
  orientation: "portrait",
  plugins: [
    [
      "expo-camera",
      {
        cameraPermission:
          "App'en har brug for adgang til kameraet for at kunne scanne QR-koderne i spillet.",
        recordAudioAndroid: false,
      },
    ],
    "expo-font",
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
          image: "./assets/icon-dark.png",
        },
        image: "./assets/icon-light.png",
        imageWidth: 200,
      },
    ],
  ],
  runtimeVersion: {
    policy: "appVersion",
  },
  scheme: "myapp",
  slug: "skoleglaede-nu-batteri",
  userInterfaceStyle: "automatic",
  updates: {
    url: "https://u.expo.dev/4445138c-8d76-4f8e-a92c-e6e56c81924c",
  },
  version: "1.0.1",
};
