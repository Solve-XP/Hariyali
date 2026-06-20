// ─────────────────────────────────────────────────────────────────────────────
// REPLACES: src/routes/AppRoutes.jsx + src/routes/ProtectedRoute.jsx
//
// Web logic:                          RN equivalent:
//   <Navigate to="/login" replace />  → AppNavigator returns <AuthNavigator />
//   ProtectedRoute checks role        → each RoleNavigator is only mounted
//                                        when isAuthenticated + correct role
//   <Route path="/marketplace">       → public screens added to AuthNavigator
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import FarmerNavigator from "./FarmerNavigator";
import MerchantNavigator from "./MerchantNavigator";
import AdminNavigator from "./AdminNavigator";
import { colors } from "../theme";

export default function AppNavigator() {
  const { isAuthenticated, isFarmer, isMerchant, isAdmin, ready } = useAuth();

  // Wait until SecureStore restores session (replaces synchronous localStorage read)
  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Not logged in → Login / Signup
  if (!isAuthenticated) return <AuthNavigator />;

  // Role routing — replaces ProtectedRoute role check + AppRoutes role branches
  if (isFarmer)   return <FarmerNavigator />;
  if (isMerchant) return <MerchantNavigator />;
  if (isAdmin)    return <AdminNavigator />;

  return <AuthNavigator />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
});
