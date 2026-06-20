// CONVERTED FROM: LocationBadge.jsx + LocationBadge.css
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fontSize } from "../theme";

export default function LocationBadge({ village, taluka, district, state, style }) {
  const parts = [village, taluka, district, state].filter(Boolean);
  if (!parts.length) return null;
  return (
    <View style={[s.wrap, style]}>
      <Text style={s.pin}>📍</Text>
      <Text style={s.text} numberOfLines={1}>{parts.join(", ")}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  pin:  { fontSize: 13 },
  text: {
    fontSize:  12,
    color:     colors.textMuted,
    lineHeight:12 * 1.4,
    flex:      1,
  },
});
