// CONVERTED FROM: EmptyState.jsx + EmptyState.css
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, fontSize } from "../theme";

export default function EmptyState({ icon, message }) {
  return (
    <View style={s.wrap}>
      {icon && <View style={s.iconBox}>{icon}</View>}
      <Text style={s.message}>{message}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems:     "center",
    justifyContent: "center",
    paddingVertical:   spacing[7],
    paddingHorizontal: spacing[4],
    gap:            spacing[2],
  },
  iconBox: {
    width:           48,
    height:          48,
    borderRadius:    radius.lg,
    backgroundColor: colors.surface2,
    alignItems:      "center",
    justifyContent:  "center",
    marginBottom:    spacing[2],
  },
  message: {
    fontSize:  fontSize.sm,
    color:     colors.textMuted,
    textAlign: "center",
  },
});
