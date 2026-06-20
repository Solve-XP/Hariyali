// CONVERTED FROM: PageHeader.jsx + PageHeader.css
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fontSize } from "../theme";

export default function PageHeader({ title, subtitle, action }) {
  return (
    <View style={s.header}>
      <View style={s.text}>
        <Text style={s.title}>{title}</Text>
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    gap:            spacing[4],
    flexWrap:       "wrap",
    marginBottom:   spacing[4],
  },
  text: { flex: 1 },
  title: {
    fontSize:     fontSize["2xl"],
    fontWeight:   "700",
    letterSpacing:-0.5,
    color:        colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize:  fontSize.base,
    lineHeight:fontSize.base * 1.5,
    color:     colors.textMuted,
  },
});
