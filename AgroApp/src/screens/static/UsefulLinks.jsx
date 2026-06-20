// CONVERTED FROM: UsefulLinks.jsx + UsefulLinks.css
// <a href target="_blank"> → Linking.openURL()
// ExternalLink (lucide) → Ionicons open-outline
// grid auto-fill → FlatList single column
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenShell from "../../components/ScreenShell";
import Card        from "../../components/Card";
import { usefulLinks } from "../../data/usefulLinks";
import { colors, spacing, radius, fontSize } from "../../theme";

export default function UsefulLinks() {
  // Group by category — same logic as web
  const groupedLinks = useMemo(() => {
    return usefulLinks.reduce((acc, link) => {
      if (!acc[link.category]) acc[link.category] = [];
      acc[link.category].push(link);
      return acc;
    }, {});
  }, []);

  const sections = Object.entries(groupedLinks);

  return (
    <ScreenShell title="Useful Links" showBack>
      {/* Page header */}
      <View style={s.pageHeader}>
        <Text style={s.pageTitle}>Useful Links</Text>
        <Text style={s.pageSub}>Helpful agriculture, government, subsidy and farming resources.</Text>
      </View>

      {/* Sections */}
      {sections.map(([category, links]) => (
        <View key={category} style={s.section}>
          <Text style={s.categoryTitle}>{category}</Text>

          {/* Link cards — replaces .useful-links-grid grid auto-fill → stacked */}
          {links.map((link) => (
            <Card key={link.name} style={s.linkCard}>
              <View style={s.linkBody}>
                <Text style={s.linkName}>{link.name}</Text>
                <Text style={s.linkDesc} numberOfLines={3}>{link.description}</Text>
              </View>
              {/* <a href target="_blank"> → Linking.openURL */}
              <TouchableOpacity
                style={s.linkBtn}
                onPress={() => Linking.openURL(link.url)}
              >
                <Text style={s.linkBtnText}>Visit Website</Text>
                <Ionicons name="open-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      ))}
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  pageHeader: { gap: 8, marginBottom: spacing[2] },
  pageTitle:  { fontSize: fontSize["2xl"], fontWeight: "700", color: colors.text },
  pageSub:    { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 22 },

  section:       { gap: spacing[3], marginBottom: spacing[4] },
  categoryTitle: { fontSize: 22, fontWeight: "700", color: colors.text },

  // Link card — replaces .useful-link-card
  linkCard: {
    padding:       spacing[5],
    borderRadius:  24,
    gap:           spacing[4],
    justifyContent:"space-between",
  },
  linkBody: { gap: 8 },
  linkName: { fontSize: 17, fontWeight: "700", color: colors.text },
  linkDesc: { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 22 },

  // Visit button — replaces .useful-link-btn + <a>
  linkBtn: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
    alignSelf:      "flex-start",
    paddingVertical:   12,
    paddingHorizontal: 18,
    borderRadius:   14,
    backgroundColor: colors.primary,
  },
  linkBtnText: { fontSize: fontSize.sm, fontWeight: "600", color: "#fff" },
});