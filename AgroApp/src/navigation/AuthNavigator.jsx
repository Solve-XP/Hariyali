// ─────────────────────────────────────────────────────────────────────────────
// REPLACES: public routes in AppRoutes.jsx
//   /login       → LoginScreen
//   /signup      → SignupScreen
//   /marketplace → MarketplaceScreen  (public, no auth needed)
//   /rentals     → RentalsScreen      (public, no auth needed)
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import MarketplaceScreen from "../screens/marketplace/MarketplaceScreen";
import RentalsScreen from "../screens/rentals/RentalsScreen";
import ListingDetailsScreen from "../screens/marketplace/ListingDetailsScreen";
import RentalDetailsScreen from "../screens/rentals/RentalDetailsScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Signup"   component={SignupScreen} />
      {/* Public browsing — accessible without login, same as web */}
      <Stack.Screen name="PublicMarketplace"   component={MarketplaceScreen} />
      <Stack.Screen name="PublicListingDetails" component={ListingDetailsScreen} />
      <Stack.Screen name="PublicRentals"        component={RentalsScreen} />
      <Stack.Screen name="PublicRentalDetails"  component={RentalDetailsScreen} />
    </Stack.Navigator>
  );
}
