module.exports = {
  expo: {
    name: "SunnySpot",
    slug: "sunny-spot",
    version: "0.9.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.flori.sunnyspot"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.flori.sunnyspot",
      versionCode: 4,
      permissions: [
        "android.permission.INTERNET",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ],
      // Add this section to specifically remove certain permissions
      blockedPermissions: [
        "android.permission.BODY_SENSORS",
        "android.permission.ACTIVITY_RECOGNITION",
        "com.google.android.gms.permission.ACTIVITY_RECOGNITION"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    plugins: [
      "expo-font",
      "expo-dev-client"
    ],
    extra: {
      eas: {
        projectId: "29a6328a-7021-41c5-91d1-d3a62d29343c"
      }
    }
  }
};