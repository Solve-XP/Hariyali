// // ─────────────────────────────────────────────────────────────────────────────
// // REPLACES: src/routes/MerchantRoutes.jsx
// //
// // Web:                          RN:
// //   /merchant/profile         → Profile tab
// //   /merchant/marketplace     → Market tab
// //   /merchant/marketplace/:id → nested in Market stack
// // ─────────────────────────────────────────────────────────────────────────────
// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Ionicons } from "@expo/vector-icons";
// import { colors, layout } from "../theme";

// import MerchantDashboardScreen from "../screens/merchant/MerchantDashboardScreen";
// import MarketplaceScreen       from "../screens/marketplace/MarketplaceScreen";
// import ListingDetailsScreen    from "../screens/marketplace/ListingDetailsScreen";
// import RentalsScreen           from "../screens/rentals/RentalsScreen";
// import RentalDetailsScreen     from "../screens/rentals/RentalDetailsScreen";
// import ProfileScreen from "../screens/profile/ProfileScreen";


// const Tab   = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// function MarketStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="MarketplaceHome" component={MarketplaceScreen} />
//       <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
//     </Stack.Navigator>
//   );
// }

// function RentalsStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="RentalsHome"  component={RentalsScreen} />
//       <Stack.Screen name="RentalDetails" component={RentalDetailsScreen} />
//     </Stack.Navigator>
//   );
// }

// function ProfileStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="ProfileHome" component={ProfileScreen} />
//     </Stack.Navigator>
//   );
// }

// const TAB_ICONS = {
//   Dashboard:   ["grid",       "grid-outline"],
//   Marketplace: ["storefront", "storefront-outline"],
//   Rentals:     ["construct",  "construct-outline"],
//   Profile:     ["person",     "person-outline"],
// };

// export default function MerchantNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor:   colors.primary,
//         tabBarInactiveTintColor: colors.textFaint,
//         tabBarStyle: {
//           height:          layout.bottomTabHeight,
//           paddingBottom:   10,
//           paddingTop:      6,
//           borderTopColor:  colors.border,
//           borderTopWidth:  1,
//           backgroundColor: colors.surface,
//         },
//         tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
//         tabBarIcon: ({ focused, color }) => {
//           const [active, inactive] = TAB_ICONS[route.name] || ["ellipse", "ellipse-outline"];
//           return <Ionicons name={focused ? active : inactive} size={22} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Dashboard"   component={MerchantDashboardScreen} />
//       <Tab.Screen name="Marketplace" component={MarketStack} />
//       <Tab.Screen name="Rentals"     component={RentalsStack} />
//       <Tab.Screen name="Profile"     component={ProfileStack} />
//     </Tab.Navigator>
//   );
// }


import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { colors, spacing, radius, fontSize } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

// Screens
import MarketplaceScreen from "../screens/marketplace/MarketplaceScreen";
import ListingDetailsScreen from "../screens/marketplace/ListingDetailsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

import Contact from "../screens/static/Contact";
import PrivacyPolicy from "../screens/static/PrivacyPolicy";
import Terms from "../screens/static/Terms";
import Support from "../screens/static/Support";
import UsefulLinks from "../screens/static/UsefulLinks";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─────────────────────────────────────────────
// MORE DRAWER (same style as farmer)
// ─────────────────────────────────────────────
function MoreDrawer({
  visible,
  onClose,
  navigation,
}) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { pushToast } = useApp();

  const initial =
    user?.name?.charAt(0)?.toUpperCase() ||
    "M";

  const handleLogout = () => {
    onClose();
    logout();
    pushToast(
      t("messages.AUTH_LOGOUT_SUCCESS")
    );
  };

  const go = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  const MAIN_MENU = [
    {
      label: "Marketplace",
      screen: "Marketplace",
      icon: "storefront-outline",
    },
  ];

  const ABOUT_US = [
    {
      label: "Contact",
      screen: "Contact",
    },
    {
      label: "Privacy Policy",
      screen: "PrivacyPolicy",
    },
    {
      label: "Terms",
      screen: "Terms",
    },
    {
      label: "Support",
      screen: "Support",
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={d.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={d.drawer}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
          >
            {/* User Header */}
            <View style={d.userHeader}>
              <View style={d.avatar}>
                <Text style={d.avatarText}>
                  {initial}
                </Text>
              </View>

              <View>
                <Text style={d.userName}>
                  {user?.name || "Merchant"}
                </Text>

                <Text style={d.userRole}>
                  {user?.role ||
                    "Merchant"}
                </Text>
              </View>
            </View>

            {/* Main Menu */}
            <Text style={d.sectionLabel}>
              MAIN MENU
            </Text>

            {MAIN_MENU.map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={d.menuItem}
                onPress={() =>
                  go(item.screen)
                }
              >
                <View
                  style={d.menuIcon}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={
                      colors.text2
                    }
                  />
                </View>

                <Text
                  style={d.menuLabel}
                >
                  {item.label}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={
                    colors.textFaint
                  }
                />
              </TouchableOpacity>
            ))}

            {/* Useful Links */}
            <Text style={d.sectionLabel}>
              USEFUL LINKS
            </Text>

            <TouchableOpacity
              style={d.menuItem}
              onPress={() =>
                go("UsefulLinks")
              }
            >
              <View style={d.menuIcon}>
                <Ionicons
                  name="library-outline"
                  size={20}
                  color={
                    colors.text2
                  }
                />
              </View>

              <Text
                style={d.menuLabel}
              >
                Government Links
              </Text>

              <Ionicons
                name="chevron-forward"
                size={16}
                color={
                  colors.textFaint
                }
              />
            </TouchableOpacity>

            {/* Account */}
            <Text style={d.sectionLabel}>
              ACCOUNT
            </Text>

            <TouchableOpacity
              style={d.menuItem}
              onPress={() =>
                go("ProfileHome")
              }
            >
              <View style={d.menuIcon}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={
                    colors.text2
                  }
                />
              </View>

              <Text
                style={d.menuLabel}
              >
                Profile
              </Text>

              <Ionicons
                name="chevron-forward"
                size={16}
                color={
                  colors.textFaint
                }
              />
            </TouchableOpacity>

            {/* About Us */}
            <Text style={d.sectionLabel}>
              ABOUT US
            </Text>

            {ABOUT_US.map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={d.menuItem}
                onPress={() =>
                  go(item.screen)
                }
              >
                <View
                  style={d.menuIcon}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={
                      colors.text2
                    }
                  />
                </View>

                <Text
                  style={d.menuLabel}
                >
                  {item.label}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={
                    colors.textFaint
                  }
                />
              </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity
              style={[
                d.menuItem,
                d.logoutItem,
              ]}
              onPress={
                handleLogout
              }
            >
              <View style={d.menuIcon}>
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={
                    colors.error
                  }
                />
              </View>

              <Text
                style={[
                  d.menuLabel,
                  {
                    color:
                      colors.error,
                  },
                ]}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const d = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "rgba(0,0,0,0.4)",
  },

  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "80%",
    maxWidth: 340,
    backgroundColor:
      colors.surface,
    shadowColor: "#000",
    shadowOffset: {
      width: -4,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },

  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    padding: spacing[5],
    paddingTop: spacing[6],
    backgroundColor:
      colors.primary,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor:
      "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: "#fff",
  },

  userName: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: "#fff",
  },

  userRole: {
    fontSize: fontSize.sm,
    color:
      "rgba(255,255,255,0.8)",
    textTransform:
      "capitalize",
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textFaint,
    letterSpacing: 0.8,
    paddingHorizontal:
      spacing[5],
    paddingTop: spacing[4],
    paddingBottom:
      spacing[2],
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    paddingVertical: 14,
    paddingHorizontal:
      spacing[5],
    borderBottomWidth: 1,
    borderBottomColor:
      colors.divider,
  },

  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor:
      colors.surface2,
    alignItems: "center",
    justifyContent: "center",
  },

  menuLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: "500",
    color: colors.text,
  },

  logoutItem: {
    marginTop: spacing[2],
  },
});

// Market Stack
function MarketStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MarketplaceHome"
        component={
          MarketplaceScreen
        }
      />

      <Stack.Screen
        name="ListingDetails"
        component={
          ListingDetailsScreen
        }
      />
    </Stack.Navigator>
  );
}

function MoreScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          colors.bg,
      }}
    />
  );
}

function TabsWithDrawer() {
  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const navigation =
    useNavigation();

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor:
            colors.primary,
          tabBarInactiveTintColor:
            colors.textFaint,

          tabBarStyle: {
            height: 64,
            paddingBottom: 10,
            paddingTop: 6,
            borderTopColor:
              colors.border,
            borderTopWidth: 1,
            backgroundColor:
              colors.surface,
          },

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        <Tab.Screen
          name="Marketplace"
          component={MarketStack}
          options={{
            tabBarIcon: ({
              focused,
              color,
            }) => (
              <Ionicons
                name={
                  focused
                    ? "storefront"
                    : "storefront-outline"
                }
                size={22}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="More"
          component={
            MoreScreen
          }
          options={{
            tabBarIcon: ({
              color,
            }) => (
              <Ionicons
                name="ellipsis-horizontal"
                size={22}
                color={color}
              />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setDrawerOpen(
                true
              );
            },
          }}
        />
      </Tab.Navigator>

      <MoreDrawer
        visible={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
        navigation={
          navigation
        }
      />
    </>
  );
}

export default function MerchantNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={
          TabsWithDrawer
        }
      />

      <Stack.Screen
        name="ProfileHome"
        component={
          ProfileScreen
        }
      />

      <Stack.Screen
        name="UsefulLinks"
        component={
          UsefulLinks
        }
      />

      <Stack.Screen
        name="Contact"
        component={
          Contact
        }
      />

      <Stack.Screen
        name="PrivacyPolicy"
        component={
          PrivacyPolicy
        }
      />

      <Stack.Screen
        name="Terms"
        component={Terms}
      />

      <Stack.Screen
        name="Support"
        component={Support}
      />
    </Stack.Navigator>
  );
}