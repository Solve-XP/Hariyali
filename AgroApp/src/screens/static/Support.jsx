import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenShell from "../../components/ScreenShell";
import Card        from "../../components/Card";
import { colors, spacing, radius, fontSize } from "../../theme";

const FAQS = [
  { q: "How do I add a farm?",                  a: "Navigate to the Farms section and click the \"Add Farm\" button to create a new farm record." },
  { q: "How do I create a marketplace listing?", a: "Open Marketplace and click \"Create Listing\" to upload crop or equipment information." },
  { q: "How do equipment rentals work?",          a: "Browse rentals, contact the owner, and discuss rental details directly using call or WhatsApp." },
  { q: "I found incorrect information. What should I do?", a: "Contact support through the contact section and we will help resolve it." },
];

export default function Support() {
  return (
    <ScreenShell title="Support" showBack>
      <View style={s.hero}>
        <Text style={s.heroTitle}>Support Center</Text>
        <Text style={s.heroSub}>Need help using Field Management? Find quick answers and support resources below.</Text>
      </View>

      {/* FAQ cards — replaces .faq-list + .faq-card */}
      {FAQS.map((faq) => (
        <Card key={faq.q} style={s.faqCard}>
          <Text style={s.faqQ}>{faq.q}</Text>
          <Text style={s.faqA}>{faq.a}</Text>
        </Card>
      ))}
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  hero:     { padding: spacing[5], borderRadius: 28, backgroundColor: colors.primary, marginBottom: spacing[2] },
  heroTitle:{ fontSize: fontSize["2xl"], fontWeight: "800", color: "#fff", marginBottom: 8 },
  heroSub:  { fontSize: fontSize.md, color: "rgba(255,255,255,0.92)", lineHeight: 26 },
  faqCard:  { padding: spacing[5], gap: spacing[2] },
  faqQ:     { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  faqA:     { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 26 },
});