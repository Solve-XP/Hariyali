// CONVERTED FROM: Button.jsx + Button.css
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from "react-native";
import { colors, radius, fontSize, spacing } from "../theme";

const VARIANTS = {
  primary:   { bg: colors.primary,   text: "#fff",             border: "transparent" },
  secondary: { bg: colors.surface,   text: colors.text,        border: colors.borderStrong },
  ghost:     { bg: "transparent",    text: colors.text2,       border: "transparent" },
  danger:    { bg: colors.surface,   text: colors.error,       border: colors.border },
  accent:    { bg: colors.accent,    text: "#fff",             border: "transparent" },
  success:   { bg: colors.success,   text: "#fff",             border: "transparent" },
};

const SIZES = {
  sm: { paddingVertical: 6,  paddingHorizontal: 8, fontSize: fontSize.xs },
  md: { paddingVertical: 9,  paddingHorizontal: spacing[4], fontSize: fontSize.sm },
  lg: { paddingVertical: 13, paddingHorizontal: spacing[5], fontSize: fontSize.md },
};

export default function Button({
  variant  = "primary",
  size     = "md",
  block    = false,
  loading  = false,
  disabled = false,
  children,
  onPress,
  style,
  ...rest
}) {
  const v    = VARIANTS[variant] || VARIANTS.primary;
  const sz   = SIZES[size]       || SIZES.md;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        s.btn,
        {
          backgroundColor:  v.bg,
          borderColor:      v.border,
          paddingVertical:  sz.paddingVertical,
          paddingHorizontal: sz.paddingHorizontal,
          opacity:          isDisabled ? 0.55 : 1,
          width:            block ? "100%" : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {loading
        ? <ActivityIndicator size="small" color={v.text} />
        : (
          // <Text style={[s.text, { color: v.text, fontSize: sz.fontSize }]}>
          //   {children}
          // </Text>
          // 2. Add numberOfLines and adjustsFontSizeToFit to Text
          <Text
            style={[s.text, { color: v.text, fontSize: sz.fontSize }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {children}
          </Text>
        )
      }
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
    borderRadius:   radius.md,
    borderWidth:    1,
    minHeight:      36,
  },
  text: {
    fontWeight:    "600",
    letterSpacing: -0.1,
    textAlign:     "center",
  },
});
