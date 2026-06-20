// ─────────────────────────────────────────────────────────────────────────────
// REPLACES: src/layouts/MainLayout.jsx + MainLayout.css
//
// Web MainLayout:                      RN ScreenShell:
//   CSS grid (sidebar | topbar/main)  → SafeAreaView + Topbar + ScrollView
//   <Sidebar> (260px left column)     → Bottom tabs (FarmerNavigator handles this)
//   <Topbar>                          → <AppTopbar> inside ScreenShell
//   <Outlet />                        → {children}
//   <Footer />                        → <AppFooter> at bottom
//   <ToastStack />                    → <ToastStack> overlaid via AppContext
//   Mobile: sidebar drawer overlay    → Bottom tabs replace drawer on mobile
//
// Usage in any screen:
//   <ScreenShell title="Dashboard">
//     <YourContent />
//   </ScreenShell>
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTopbar from "./Topbar";
import ToastStack from "./ToastStack";
import { colors, layout } from "../theme";

export default function ScreenShell({
  children,
  title,
  subtitle,
  scrollable = true,    // set false for screens with their own FlatList
  noPadding  = false,   // set true for full-bleed screens (marketplace grid)
  topbarRight,          // optional right element in topbar (button, icon)
  showBack   = false,   // show back arrow in topbar
}) {
  const content = (
    <View style={[styles.page, noPadding && styles.pageNoPad]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.shell} edges={["top", "left", "right"]}>

      {/* TOPBAR — replaces web <Topbar> + sidebar menu button */}
      <AppTopbar
        title={title}
        subtitle={subtitle}
        showBack={showBack}
        right={topbarRight}
      />

      {/* MAIN CONTENT — replaces .app-shell__main + .app-shell__page */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scrollable ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          <View style={styles.flex}>
            {content}
          </View>
        )}
      </KeyboardAvoidingView>

      {/* TOAST — replaces <ToastStack /> at bottom of MainLayout */}
      <ToastStack />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex:            1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  page: {
    flex:    1,
    padding: layout.screenPadding,
    gap:     16,   // replaces CSS gap: var(--space-4) on .page
  },
  pageNoPad: {
    padding: 0,
  },
});
