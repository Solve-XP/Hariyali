// CONVERTED FROM: Footer.jsx + Footer.css
// Web: navigate() to static pages, window.open for external
// RN:  navigation.navigate() + Linking.openURL()
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, fontSize } from "../theme";

export default function Footer() {
  const navigation = useNavigation();

  const links = [
    { label: "Privacy Policy", screen: "PrivacyPolicy" },
    { label: "Terms",          screen: "Terms" },
    { label: "Support",        screen: "Support" },
    { label: "Contact",        screen: "Contact" },
    { label: "Useful Links",   screen: "UsefulLinks" },
  ];

  return (
    <View style={s.footer}>
      {/* Copyright */}
      <Text style={s.copy}>© 2026</Text>

      {/* Links row */}
      <View style={s.links}>
        {links.map((l) => (
          <TouchableOpacity key={l.screen} onPress={() => navigation.navigate(l.screen)}>
            <Text style={s.link}>{l.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Built by */}
      <TouchableOpacity
        style={s.brand}
        onPress={() => Linking.openURL("https://solvexp.in")}
      >
        <Text style={s.brandText}>Built with </Text>
        <Ionicons name="heart" size={14} color={colors.primary} />
        <Text style={s.brandText}> by </Text>
        <Text style={[s.brandText, { fontWeight: "700" }]}>Solve XP</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  footer: {
    paddingVertical:   14,
    paddingHorizontal: spacing[5],
    borderTopWidth:    1,
    borderTopColor:    colors.border,
    backgroundColor:   colors.surface,
    alignItems:        "center",
    gap:               spacing[3],
  },
  copy: {
    fontSize: fontSize.sm,
    color:    colors.textMuted,
  },
  links: {
    flexDirection: "row",
    flexWrap:      "wrap",
    justifyContent:"center",
    gap:           spacing[4],
  },
  link: {
    fontSize: fontSize.sm,
    color:    colors.textMuted,
  },
  brand: {
    flexDirection: "row",
    alignItems:    "center",
  },
  brandText: {
    fontSize: fontSize.sm,
    color:    colors.textMuted,
  },
});
