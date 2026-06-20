// CONVERTED FROM: Sidebar.jsx + Sidebar.css
//
// Web: fixed left column with NavLink navigation
// RN:  NOT used as a side drawer — navigation is handled by bottom tabs.
//      This component is kept for any screens that might need a drawer,
//      but in practice the FarmerNavigator bottom tabs replace Sidebar entirely.
//
// However it IS still useful as a "profile + logout" panel or drawer.
// Here it's converted as a full-screen modal drawer that can be opened
// from the Topbar if needed.
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import {
  IconDashboard, IconFarm, IconCrop, IconExpense, IconRental,
  IconUsers, IconAdmin, IconLogout, IconFertilizer, IconIncome, IconPesticide,
} from "./Icons";
import { colors, spacing, radius, fontSize } from "../theme";

const FARMER_ITEMS = [
  { screen: "DashboardHome",   labelKey: "nav.dashboard",   Icon: IconDashboard },
  { screen: "FarmsHome",       labelKey: "nav.farms",       Icon: IconFarm },
  { screen: "Crops",           labelKey: "nav.crops",       Icon: IconCrop },
  { screen: "Fertilizers",     labelKey: "nav.fertilizers", Icon: IconFertilizer },
  { screen: "Pesticides",      labelKey: "nav.pesticides",  Icon: IconPesticide },
  { screen: "IncomesHome",     labelKey: "nav.incomes",     Icon: IconIncome },
  { screen: "Expenses",        labelKey: "nav.expenses",    Icon: IconExpense },
  { screen: "RentalsHome",     labelKey: "nav.rental",      Icon: IconRental },
  { screen: "MarketplaceHome", labelKey: "nav.marketplace", Icon: IconCrop },
];

export default function Sidebar({ open, onClose }) {
  const { t }               = useTranslation();
  const navigation          = useNavigation();
  const { logout, user, isAdmin } = useAuth();
  const { pushToast }       = useApp();

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleNav = (screen) => {
    navigation.navigate(screen);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    pushToast(t("messages.AUTH_LOGOUT_SUCCESS"));
    onClose?.();
  };

  return (
    <Modal visible={!!open} transparent animationType="slide" onRequestClose={onClose}>
      {/* Overlay */}
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose} />

      <View style={s.drawer}>
        {/* Brand */}
        <View style={s.brand}>
          <View style={s.logo}><Text style={s.logoText}>SX</Text></View>
          <View>
            <Text style={s.appName}>{t("app.name")}</Text>
            <Text style={s.appTagline}>{t("app.tagline")}</Text>
          </View>
        </View>

        {/* Section label */}
        <Text style={s.sectionLabel}>{t("topbar.user_role")}</Text>

        {/* Nav items */}
        <ScrollView style={s.nav} showsVerticalScrollIndicator={false}>
          {FARMER_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={s.navItem}
              onPress={() => handleNav(item.screen)}
            >
              <item.Icon size={18} color={colors.sidebarText} />
              <Text style={s.navLabel}>{t(item.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* User + logout */}
        <View style={s.userSection}>
          <TouchableOpacity style={s.userInfo} onPress={() => handleNav("ProfileHome")}>
            <View style={s.avatar}><Text style={s.avatarText}>{userInitial}</Text></View>
            <View>
              <Text style={s.userName}>{user?.name || "User"}</Text>
              <Text style={s.userRole}>{user?.role || "Farmer"}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <IconLogout size={16} color={colors.sidebarTextMuted} />
          </TouchableOpacity>
        </View>

        <Text style={s.footerText}>{t("footer.copyright")}</Text>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15,23,42,0.5)" },
  drawer: {
    position:        "absolute",
    top:             0,
    bottom:          0,
    left:            0,
    width:           280,
    backgroundColor: colors.sidebarBg,
    paddingTop:      48,
    borderRightWidth: 1,
    borderRightColor: colors.sidebarBorder,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: spacing[3], paddingHorizontal: spacing[5], paddingBottom: spacing[5], borderBottomWidth: 1, borderBottomColor: colors.sidebarBorder },
  logo:  { width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.primary500 || colors.primary, alignItems: "center", justifyContent: "center" },
  logoText:   { fontSize: 14, fontWeight: "800", color: "#fff" },
  appName:    { fontSize: fontSize.md, fontWeight: "700", color: "#fff" },
  appTagline: { fontSize: fontSize.xs, color: colors.sidebarTextMuted },
  sectionLabel: { paddingHorizontal: spacing[5], paddingTop: spacing[5], paddingBottom: spacing[2], fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, color: colors.sidebarTextMuted, fontWeight: "600" },
  nav:     { flex: 1, paddingHorizontal: spacing[3] },
  navItem: { flexDirection: "row", alignItems: "center", gap: spacing[3], paddingVertical: 10, paddingHorizontal: spacing[3], borderRadius: radius.md, marginBottom: 2 },
  navLabel:{ fontSize: fontSize.sm, fontWeight: "500", color: colors.sidebarText },
  userSection: { flexDirection: "row", alignItems: "center", gap: spacing[3], paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderTopWidth: 1, borderTopColor: colors.sidebarBorder },
  userInfo:    { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: spacing[2], paddingHorizontal: spacing[2], borderRadius: radius.md },
  avatar:      { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary500 || colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText:  { fontSize: 16, fontWeight: "700", color: "#fff" },
  userName:    { fontSize: fontSize.sm, fontWeight: "600", color: "#fff" },
  userRole:    { fontSize: fontSize.xs, color: colors.sidebarTextMuted, textTransform: "capitalize" },
  logoutBtn:   { width: 32, height: 32, borderWidth: 1, borderColor: colors.sidebarBorder, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  footerText:  { paddingHorizontal: spacing[5], paddingVertical: spacing[3], fontSize: fontSize.xs, color: colors.sidebarTextMuted, borderTopWidth: 1, borderTopColor: colors.sidebarBorder },
});
