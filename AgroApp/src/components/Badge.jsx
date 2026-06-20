// CONVERTED FROM: Badge.jsx + Badge.css
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius } from "../theme";

const VARIANTS = {
  success: { bg: colors.successBg,  text: colors.success,  border: "#a7f3d0" },
  neutral: { bg: colors.surface2,   text: colors.text2,    border: colors.border },
  accent:  { bg: colors.accent50,   text: colors.accent600, border: "#fde68a" },
  error:   { bg: colors.errorBg,    text: colors.error,    border: "#fecaca" },
  info:    { bg: colors.infoBg,     text: colors.info,     border: "#bfdbfe" },
  cyan:    { bg: colors.cyanBg,     text: colors.cyan,     border: "#a5f3fc" },
  purple:  { bg: colors.purpleBg,   text: colors.purple,   border: "#d8b4fe" },
};

export default function Badge({ children, variant = "neutral" }) {
  const v = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <View style={[s.badge, { backgroundColor: v.bg, borderColor: v.border }]}>
      <Text style={[s.text, { color: v.text }]}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    alignSelf:         "flex-start",
    flexDirection:     "row",
    alignItems:        "center",
    paddingVertical:   3,
    paddingHorizontal: 10,
    borderRadius:      radius.pill,
    borderWidth:       1,
  },
  text: {
    fontSize:      11,
    fontWeight:    "600",
    letterSpacing: 0.1,
  },
});
