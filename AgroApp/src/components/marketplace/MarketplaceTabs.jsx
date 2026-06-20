// CONVERTED FROM: MarketplaceTabs.jsx + MarketplaceTabs.css
// useLocation + useNavigate → useNavigation + useRoute for active tab detection
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { colors, spacing, radius, fontSize, shadows } from "../../theme";

export default function MarketplaceTabs() {
  const { t }        = useTranslation();
  const navigation   = useNavigation();
  const route        = useRoute();

  // Detect active tab by current route name — replaces location.pathname check
  const isMarketplace = route.name === "MarketplaceHome";
  const isMyListings  = route.name === "MyListings";

  const tabs = [
    { label: t("marketplace.marketplace"), active: isMarketplace, onPress: () => navigation.navigate("MarketplaceHome") },
    { label: t("marketplace.myListings"),  active: isMyListings,  onPress: () => navigation.navigate("MyListings") },
  ];

  return (
    <View style={s.tabs}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.label}
          style={[s.tab, tab.active && s.tabActive]}
          onPress={tab.onPress}
          activeOpacity={0.8}
        >
          <Text style={[s.tabText, tab.active && s.tabTextActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  tabs: {
    flexDirection:   "row",
    alignItems:      "center",
    gap:             8,
    backgroundColor: colors.surface2,
    padding:         4,
    borderRadius:    16,
    ...shadows.xs,
  },
  tab: {
    flex:              1,
    paddingVertical:   12,
    paddingHorizontal: 18,
    borderRadius:      12,
    alignItems:        "center",
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadows.xs,
  },
  tabText: {
    fontSize:   14,
    fontWeight: "600",
    color:      colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
  },
});