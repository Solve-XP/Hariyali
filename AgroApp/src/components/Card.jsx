// CONVERTED FROM: Card.jsx + Card.css
import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, radius, shadows } from "../theme";

export default function Card({ children, variant = "default", style }) {
  return (
    <View style={[s.card, variant === "soft" && s.soft, style]}>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.border,
    borderRadius:    radius.lg,
    padding:         12,
    ...shadows.sm,
  },
  soft: {
    backgroundColor: colors.surface2,
    shadowOpacity:   0,
    elevation:       0,
  },
});
