import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenShell from "../../components/ScreenShell";
import Card        from "../../components/Card";
import { colors, spacing, fontSize } from "../../theme";

const SECTIONS = [
  {
    title: "Information We Collect",
    body:  "We may collect profile information, farm records, marketplace activity, rental data, and account details to provide platform services efficiently.",
  },
  {
    title: "How We Use Data",
    bullets: [
      "To improve farming management services",
      "To personalize your dashboard",
      "To improve marketplace experience",
      "To ensure platform security",
    ],
  },
  {
    title: "Data Protection",
    body:  "We use secure systems and modern security practices to protect your account and information from unauthorized access.",
  },
];

export default function PrivacyPolicy() {
  return (
    <ScreenShell title="Privacy Policy" showBack>
      <View style={s.hero}>
        <Text style={s.heroTitle}>Privacy Policy</Text>
        <Text style={s.heroSub}>Your privacy matters to us. This policy explains how Field Management collects, stores, and protects your information.</Text>
      </View>
      <Card style={s.card}>
        {SECTIONS.map((sec, i) => (
          <View key={sec.title} style={[s.section, i > 0 && s.sectionTop]}>
            <Text style={s.h2}>{sec.title}</Text>
            {sec.body && <Text style={s.body}>{sec.body}</Text>}
            {sec.bullets?.map((b) => (
              <View key={b} style={s.bulletRow}>
                <Text style={s.bullet}>•</Text>
                <Text style={s.bulletText}>{b}</Text>
              </View>
            ))}
          </View>
        ))}
      </Card>
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  hero:       { padding: spacing[5], borderRadius: 28, backgroundColor: colors.primary, marginBottom: spacing[2] },
  heroTitle:  { fontSize: fontSize["2xl"], fontWeight: "800", color: "#fff", marginBottom: 8 },
  heroSub:    { fontSize: fontSize.md, color: "rgba(255,255,255,0.92)", lineHeight: 26 },
  card:       { padding: spacing[5], gap: spacing[5] },
  section:    { gap: spacing[3] },
  sectionTop: { marginTop: spacing[5], paddingTop: spacing[5], borderTopWidth: 1, borderTopColor: colors.divider },
  h2:         { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  body:       { fontSize: fontSize.sm, color: colors.text2, lineHeight: 28 },
  bulletRow:  { flexDirection: "row", gap: spacing[2], alignItems: "flex-start" },
  bullet:     { fontSize: fontSize.sm, color: colors.text2, marginTop: 2 },
  bulletText: { fontSize: fontSize.sm, color: colors.text2, lineHeight: 22, flex: 1 },
});