import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View, Text, TouchableOpacity, ScrollView,
  Modal, StyleSheet, Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { colors, spacing, radius, fontSize } from "../theme";

import { useAuth } from "../context/AuthContext";
import { useApp }  from "../context/AppContext";

// ── Screens ───────────────────────────────────────────────────────────────────
import DashboardScreen     from "../screens/farmer/DashboardScreen";
import ExpensesScreen      from "../screens/farmer/ExpensesScreen";
import IncomesScreen       from "../screens/farmer/IncomesScreen";
import FarmsScreen         from "../screens/farmer/FarmsScreen";
import CropsScreen         from "../screens/farmer/CropsScreen";
import FertilizersScreen   from "../screens/farmer/FertilizersScreen";
import PesticidesScreen    from "../screens/farmer/PesticidesScreen";
import MarketplaceScreen   from "../screens/marketplace/MarketplaceScreen";
import MyListingsScreen    from "../screens/marketplace/MyListingsScreen";
import CreateListingScreen from "../screens/marketplace/CreateListingScreen";
import EditListingScreen   from "../screens/marketplace/EditListingScreen";
import ListingDetailsScreen from "../screens/marketplace/ListingDetailsScreen";
import RentalsScreen       from "../screens/rentals/RentalsScreen";
import MyRentalsScreen     from "../screens/rentals/MyRentalsScreen";
import CreateRentalScreen  from "../screens/rentals/CreateRentalScreen";
import EditRentalScreen    from "../screens/rentals/EditRentalScreen";
import RentalDetailsScreen from "../screens/rentals/RentalDetailsScreen";
import ProfileScreen       from "../screens/profile/ProfileScreen";
import Contact             from "../screens/static/Contact";
import PrivacyPolicy       from "../screens/static/PrivacyPolicy";
import Terms               from "../screens/static/Terms";
import Support             from "../screens/static/Support";
import UsefulLinks         from "../screens/static/UsefulLinks";

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─────────────────────────────────────────────────────────────────────────────
// MORE DRAWER
// ─────────────────────────────────────────────────────────────────────────────
function MoreDrawer({ visible, onClose, navigation }) {
  const { t }             = useTranslation();
  const { user, logout }  = useAuth();
  const { pushToast }     = useApp();

  const initial = user?.name?.charAt(0)?.toUpperCase() || "B";

  const handleLogout = () => {
    onClose();
    logout();
    pushToast(t("messages.AUTH_LOGOUT_SUCCESS"));
  };

  // const go = (screen) => {
  //   onClose();
  //   navigation.navigate(screen);
  // };

const go = (screen) => {
  onClose();

  setTimeout(() => {
    navigation.navigate("More", {
      screen,
    });
  }, 100);
};

  const MAIN_MENU = [
    { label: "Farm",        screen: "FarmsHome",    icon: "business-outline"       },
    { label: "Crop",        screen: "Crops",         icon: "leaf-outline"       },
    { label: "Fertilizers", screen: "Fertilizers",  icon: "flask-outline"      },
    { label: "Pesticides",  screen: "Pesticides",   icon: "bug-outline"        },
    { label: "Income",      screen: "IncomesHome",  icon: "cash-outline"       },
  ];

  const ABOUT_US = [
    { label: "Contact",        screen: "Contact"       },
    { label: "Privacy Policy", screen: "PrivacyPolicy" },
    { label: "Terms",          screen: "Terms"         },
    { label: "Support",        screen: "Support"       },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity style={d.backdrop} activeOpacity={1} onPress={onClose} />

      {/* Drawer panel */}
      <View style={d.drawer}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* ── User header ────────────────────────────────────── */}
            <View style={d.userHeader}>
              <View style={d.avatar}>
                <Text style={d.avatarText}>{initial}</Text>
              </View>
              <View>
                <Text style={d.userName}>{user?.name || "Farmer"}</Text>
                <Text style={d.userRole}>{user?.role || "Farmer"}</Text>
              </View>
            </View>

            {/* ── Main Menu ──────────────────────────────────────── */}
            <Text style={d.sectionLabel}>MAIN MENU</Text>
            {MAIN_MENU.map((item) => (
              <TouchableOpacity key={item.screen} style={d.menuItem} onPress={() => go(item.screen)}>
                <View style={d.menuIcon}>
                  <Ionicons name={item.icon} size={20} color={colors.text2} />
                </View>
                <Text style={d.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
              </TouchableOpacity>
            ))}

            {/* ── Useful Links ───────────────────────────────────── */}
            <Text style={d.sectionLabel}>USEFUL LINKS</Text>
            <TouchableOpacity style={d.menuItem} onPress={() => go("UsefulLinks")}>
              <View style={d.menuIcon}>
                <Ionicons name="library-outline" size={20} color={colors.text2} />
              </View>
              <Text style={d.menuLabel}>Government Links</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
            </TouchableOpacity>

            {/* ── Account ────────────────────────────────────────── */}
            <Text style={d.sectionLabel}>ACCOUNT</Text>
            <TouchableOpacity style={d.menuItem} onPress={() => go("ProfileHome")}>
              <View style={d.menuIcon}>
                <Ionicons name="person-outline" size={20} color={colors.text2} />
              </View>
              <Text style={d.menuLabel}>Profile</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
            </TouchableOpacity>

            {/* About Us expands to static pages */}
            <Text style={d.sectionLabel}>ABOUT US</Text>
            {ABOUT_US.map((item) => (
              <TouchableOpacity key={item.screen} style={d.menuItem} onPress={() => go(item.screen)}>
                <View style={d.menuIcon}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.text2} />
                </View>
                <Text style={d.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
              </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity style={[d.menuItem, d.logoutItem]} onPress={handleLogout}>
              <View style={d.menuIcon}>
                <Ionicons name="log-out-outline" size={20} color={colors.error} />
              </View>
              <Text style={[d.menuLabel, { color: colors.error }]}>Logout</Text>
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    position:        "absolute",
    top:             0,
    right:           0,
    bottom:          0,
    width:           "80%",
    maxWidth:        340,
    backgroundColor: colors.surface,
    shadowColor:     "#000",
    shadowOffset:    { width: -4, height: 0 },
    shadowOpacity:   0.15,
    shadowRadius:    12,
    elevation:       16,
  },
  userHeader: {
    flexDirection:   "row",
    alignItems:      "center",
    gap:             spacing[3],
    padding:         spacing[5],
    paddingTop:      spacing[6],
    backgroundColor: colors.primary,
  },
  avatar: {
    width:           52,
    height:          52,
    borderRadius:    26,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  avatarText: { fontSize: fontSize.xl, fontWeight: "700", color: "#fff" },
  userName:   { fontSize: fontSize.md, fontWeight: "700", color: "#fff" },
  userRole:   { fontSize: fontSize.sm, color: "rgba(255,255,255,0.8)", textTransform: "capitalize" },

  sectionLabel: {
    fontSize:      11,
    fontWeight:    "700",
    color:         colors.textFaint,
    letterSpacing: 0.8,
    paddingHorizontal: spacing[5],
    paddingTop:    spacing[4],
    paddingBottom: spacing[2],
  },
  menuItem: {
    flexDirection:   "row",
    alignItems:      "center",
    gap:             spacing[3],
    paddingVertical: 14,
    paddingHorizontal: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuIcon: {
    width:          36,
    height:         36,
    borderRadius:   radius.md,
    backgroundColor: colors.surface2,
    alignItems:     "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex:       1,
    fontSize:   fontSize.sm,
    fontWeight: "500",
    color:      colors.text,
  },
  logoutItem: { marginTop: spacing[2] },
});

// ─────────────────────────────────────────────────────────────────────────────
// "More" tab screen — just a placeholder that opens the drawer
// ─────────────────────────────────────────────────────────────────────────────
function MoreScreen() {
  return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// STACKS
// ─────────────────────────────────────────────────────────────────────────────
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
    </Stack.Navigator>
  );
}

function ExpensesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpensesHome" component={ExpensesScreen} />
      <Stack.Screen name="IncomesHome"  component={IncomesScreen}  />
    </Stack.Navigator>
  );
}

function MarketStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MarketplaceHome"   component={MarketplaceScreen}    />
      <Stack.Screen name="ListingDetails"    component={ListingDetailsScreen} />
      <Stack.Screen name="CreateListing"     component={CreateListingScreen}  />
      <Stack.Screen name="EditListing"       component={EditListingScreen}    />
      <Stack.Screen name="MyListings"        component={MyListingsScreen}     />
      <Stack.Screen name="RentalsHome"       component={RentalsScreen}        />
      <Stack.Screen name="RentalDetails"     component={RentalDetailsScreen}  />
      <Stack.Screen name="CreateRental"      component={CreateRentalScreen}   />
      <Stack.Screen name="EditRental"        component={EditRentalScreen}     />
      <Stack.Screen name="MyRentals"         component={MyRentalsScreen}      />
    </Stack.Navigator>
  );
}

function RentalsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RentalsHome"   component={RentalsScreen}        />
      <Stack.Screen name="RentalDetails" component={RentalDetailsScreen}  />
      <Stack.Screen name="CreateRental"  component={CreateRentalScreen}   />
      <Stack.Screen name="EditRental"    component={EditRentalScreen}     />
      <Stack.Screen name="MyRentals"     component={MyRentalsScreen}      />
    </Stack.Navigator>
  );
}

// All drawer-accessible screens live in a root stack wrapping the tabs

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
      />

      <Stack.Screen
        name="FarmsHome"
        component={FarmsScreen}
      />

      <Stack.Screen
        name="Crops"
        component={CropsScreen}
      />

      <Stack.Screen
        name="Fertilizers"
        component={FertilizersScreen}
      />

      <Stack.Screen
        name="Pesticides"
        component={PesticidesScreen}
      />

      <Stack.Screen
        name="IncomesHome"
        component={IncomesScreen}
      />

      <Stack.Screen
        name="UsefulLinks"
        component={UsefulLinks}
      />

      <Stack.Screen
        name="Contact"
        component={Contact}
      />

      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
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
function TabsWithDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigation = useNavigation();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor:   colors.primary,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarStyle: {
            height:          64,
            paddingBottom:   10,
            paddingTop:      6,
            borderTopColor:  colors.border,
            borderTopWidth:  1,
            backgroundColor: colors.surface,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? "grid" : "grid-outline"} size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Expenses"
          component={ExpensesStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? "receipt" : "receipt-outline"} size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Marketplace"
          component={MarketStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? "storefront" : "storefront-outline"} size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Rentals"
          component={RentalsStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? "construct" : "construct-outline"} size={22} color={color} />
            ),
          }}
        />
        {/* <Tab.Screen
          name="More"
          component={MoreScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="ellipsis-horizontal" size={22} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();       // don't navigate — open drawer instead
              setDrawerOpen(true);
            },
          }}
        /> */}
        <Tab.Screen
  name="More"
  component={MoreStack}
  options={{
    title: "More",
    tabBarIcon: ({ focused, color }) => (
      <Ionicons
        name={
          focused
            ? "ellipsis-horizontal"
            : "ellipsis-horizontal-outline"
        }
        size={22}
        color={color}
      />
    ),
  }}
  listeners={{
    tabPress: (e) => {
      e.preventDefault();
      setDrawerOpen(true);

      // make More tab active
      navigation.navigate("More", {
        screen: "ProfileHome",
      });
    },
  }}
/>
      </Tab.Navigator>

      <MoreDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
      />
    </>
  );
}

// Root stack adds all drawer-destination screens on top of the tabs
export default function FarmerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs"          component={TabsWithDrawer}     />
      {/* Drawer destinations */}
      <Stack.Screen name="FarmsHome"     component={FarmsScreen}        />
      <Stack.Screen name="Crops"         component={CropsScreen}        />
      <Stack.Screen name="Fertilizers"   component={FertilizersScreen}  />
      <Stack.Screen name="Pesticides"    component={PesticidesScreen}   />
      <Stack.Screen name="IncomesHome"   component={IncomesScreen}      />
      <Stack.Screen name="ProfileHome"   component={ProfileScreen}      />
      <Stack.Screen name="UsefulLinks"   component={UsefulLinks}        />
      <Stack.Screen name="Contact"       component={Contact}            />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy}      />
      <Stack.Screen name="Terms"         component={Terms}              />
      <Stack.Screen name="Support"       component={Support}            />
    </Stack.Navigator>
  );
}