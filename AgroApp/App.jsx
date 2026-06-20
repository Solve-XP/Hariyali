// // ─────────────────────────────────────────────────────────────────────────────
// // CONVERTED FROM: src/main.jsx + src/App.jsx
// //
// // Web:  createRoot(document.getElementById("root")).render(<AuthProvider>...)
// //       BrowserRouter + AppRoutes + ToastStack
// //
// // App:  Expo entry point — same provider tree, NavigationContainer replaces
// //       BrowserRouter, AppNavigator replaces AppRoutes + all route files,
// //       ToastStack rendered inside AppProvider via AppNavigator
// // ─────────────────────────────────────────────────────────────────────────────
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import ToastStack from "./src/components/ToastStack"; //


import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import { AppProvider } from "./src/context/AppContext";
import AppNavigator from "./src/navigation/AppNavigator";
import "./src/i18n/i18n";

export default function App() {

  
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
           <ToastStack />
          {/* StatusBar: equivalent of <meta name="theme-color"> — light-content = white icons */}
          <StatusBar style="light" backgroundColor="#047857" />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
