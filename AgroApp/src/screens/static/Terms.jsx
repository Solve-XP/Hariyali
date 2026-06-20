import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenShell from "../../components/ScreenShell";
import Card        from "../../components/Card";
import { colors, spacing, fontSize } from "../../theme";

const SECTIONS = [
  {
    title: "User Responsibilities",
    body:  "Users are responsible for providing accurate information while using marketplace, rentals, and farm management features.",
  },
  {
    title: "Marketplace Rules",
    bullets: ["No misleading listings", "No fraudulent activity", "Respect platform rules", "Maintain fair dealings"],
  },
  {
    title: "Account Suspension",
    body:  "Accounts violating platform rules may be restricted or suspended for safety and trust purposes.",
  },
];

export default function Terms() {
  return (
    <ScreenShell title="Terms & Conditions" showBack>
      <View style={s.hero}>
        <Text style={s.heroTitle}>Terms & Conditions</Text>
        <Text style={s.heroSub}>Please read these terms carefully before using Field Management.</Text>
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
  card:       { padding: spacing[5] },
  section:    { gap: spacing[3] },
  sectionTop: { marginTop: spacing[5], paddingTop: spacing[5], borderTopWidth: 1, borderTopColor: colors.divider },
  h2:         { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  body:       { fontSize: fontSize.sm, color: colors.text2, lineHeight: 28 },
  bulletRow:  { flexDirection: "row", gap: spacing[2], alignItems: "flex-start" },
  bullet:     { fontSize: fontSize.sm, color: colors.text2, marginTop: 2 },
  bulletText: { fontSize: fontSize.sm, color: colors.text2, lineHeight: 22, flex: 1 },
});