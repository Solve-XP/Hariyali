import React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenShell from "../../components/ScreenShell";
import Card        from "../../components/Card";
import { colors, spacing, radius, fontSize } from "../../theme";

const CONTACTS = [
  { icon: "mail-outline",    title: "Email Support",  detail: "contact@solvexp.in",  onPress: () => Linking.openURL("mailto:contact@solvexp.in") },
  { icon: "call-outline",    title: "Phone Support",  detail: "+91 97668 63090",     onPress: () => Linking.openURL("tel:+919766863090") },
  { icon: "globe-outline",   title: "Website",        detail: "https://solvexp.in",  onPress: () => Linking.openURL("https://solvexp.in") },
];

export default function Contact() {
  return (
    <ScreenShell title="Contact Us" showBack>
      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>Contact Us</Text>
        <Text style={s.heroSub}>Have questions, suggestions, or need assistance? We're here to help.</Text>
      </View>

      {/* Contact cards — replaces .contact-grid grid 3-col → stacked */}
      {CONTACTS.map((c) => (
        <Card key={c.title} style={s.card} onPress={c.onPress}>
          <Ionicons name={c.icon} size={28} color={colors.primary} />
          <Text style={s.cardTitle}>{c.title}</Text>
          <Text style={s.cardDetail}>{c.detail}</Text>
        </Card>
      ))}
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  hero:      { padding: spacing[5], borderRadius: 28, backgroundColor: colors.primary, marginBottom: spacing[2] },
  heroTitle: { fontSize: fontSize["2xl"], fontWeight: "800", color: "#fff", marginBottom: 8 },
  heroSub:   { fontSize: fontSize.md, color: "rgba(255,255,255,0.92)", lineHeight: 26 },
  card:      { gap: spacing[2], padding: spacing[5] },
  cardTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  cardDetail:{ fontSize: fontSize.sm, color: colors.textMuted },
});