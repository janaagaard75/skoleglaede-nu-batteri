export default {
  expo: {
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
        foregroundImage: "./assets/icon-light.png",
      },
      package: "com.janaagaard75.skoleglaedenubatteri",
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
      bundleIdentifier: "com.janaagaard75.skoleglaedenubatteri",
      config: {
        usesNonExemptEncryption: false,
      },
      entitlements: {
        "aps-environment": "development",
      },
      supportsTablet: true,
    },
    name: "Skoleglæde.nu Batteri",
    newArchEnabled: true,
    orientation: "portrait",
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission:
            "Tillad at $(PRODUCT_NAME) får adgang til kameraet.",
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
          image: "./assets/icon-light.png",
          dark: {
            image: "./assets/icon-dark.png",
            backgroundColor: "#000000",
          },
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
    version: "1.0.0",
  },
};