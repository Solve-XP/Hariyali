// ─────────────────────────────────────────────────────────────────────────────
// REPLACES: src/routes/AdminRoutes.jsx
//
// Web:                     RN:
//   /admin/dashboard     → Dashboard tab
//   /admin/profile       → Profile tab
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors, layout } from "../theme";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import ProfileScreen        from "../screens/profile/ProfileScreen";

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboardHome" component={AdminDashboardScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

const TAB_ICONS = {
  Dashboard: ["speedometer", "speedometer-outline"],
  Profile:   ["person",      "person-outline"],
};

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          height:          layout.bottomTabHeight,
          paddingBottom:   10,
          paddingTop:      6,
          borderTopColor:  colors.border,
          borderTopWidth:  1,
          backgroundColor: colors.surface,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ focused, color }) => {
          const [active, inactive] = TAB_ICONS[route.name] || ["ellipse", "ellipse-outline"];
          return <Ionicons name={focused ? active : inactive} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Profile"   component={ProfileStack} />
    </Tab.Navigator>
  );
}
