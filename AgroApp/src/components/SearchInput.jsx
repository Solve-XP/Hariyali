// CONVERTED FROM: SearchInput.jsx + SearchInput.css
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { IconSearch } from "./Icons";
import { colors, radius, spacing, fontSize, shadows } from "../theme";

export default function SearchInput({ value, onChange, onChangeText, placeholder }) {
  return (
    <View style={s.wrap}>
      <IconSearch size={15} color={colors.textFaint} />
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChangeText || ((v) => onChange?.({ target: { value: v } }))}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection:   "row",
    alignItems:      "center",
    gap:             spacing[2],
    paddingHorizontal: spacing[4],
    minHeight:       42,
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.border,
    borderRadius:    radius.lg,
    ...shadows.xs,
    flex:            1,
  },
  input: {
    flex:      1,
    fontSize:  fontSize.sm,
    fontWeight:"500",
    color:     colors.text,
    paddingVertical: 0,
  },
});
