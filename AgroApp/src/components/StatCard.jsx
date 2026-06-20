// CONVERTED FROM: StatCard.jsx / StatsCard.jsx + StatCard.css
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, fontSize, shadows } from "../theme";

const ICON_VARIANTS = {
  default: { bg: colors.primary50,  color: colors.primary,  border: colors.primary100 },
  accent:  { bg: colors.accent50,   color: colors.accent600, border: "#fde68a" },
  info:    { bg: colors.infoBg,     color: colors.info,     border: "#bfdbfe" },
  success: { bg: colors.successBg,  color: colors.success,  border: "#a7f3d0" },
  cyan:    { bg: colors.cyanBg,     color: colors.cyan,     border: "#a5f3fc" },
  purple:  { bg: colors.purpleBg,   color: colors.purple,   border: "#d8b4fe" },
};

export default function StatCard({ icon, title, value, subtitle, hint, colorVariant = "default" }) {
  const v = ICON_VARIANTS[colorVariant] || ICON_VARIANTS.default;
  return (
    <View style={s.card}>
      {/* Icon box */}
      <View style={[s.iconBox, { backgroundColor: v.bg, borderColor: v.border }]}>
        {icon}
      </View>
      {/* Body */}
      <View style={s.body}>
        <Text style={s.label}>{title}</Text>
        <Text style={s.value}>{value}</Text>
        {subtitle ? <Text style={s.hint}>{subtitle}</Text> : null}
        {hint    ? <Text style={s.hint}>{hint}</Text>     : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.border,
    borderRadius:    radius.lg,
    padding:         spacing[4],
    flexDirection:   "row",
    alignItems:      "flex-start",
    gap:             spacing[3],
    ...shadows.sm,
  },
  iconBox: {
    width:        44,
    height:       44,
    borderRadius: radius.md,
    alignItems:   "center",
    justifyContent:"center",
    borderWidth:  1,
  },
  body: { flex: 1, gap: 4 },
  label: { fontSize: fontSize.sm, fontWeight: "500", color: colors.textMuted },
  value: { fontSize: fontSize["2xl"], fontWeight: "700", color: colors.text, letterSpacing: -0.5 },
  hint:  { fontSize: fontSize.xs,  fontWeight: "500", color: colors.textMuted },
});
