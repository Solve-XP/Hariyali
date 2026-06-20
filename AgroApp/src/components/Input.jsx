// CONVERTED FROM: Input.jsx + Input.css
// Web: <input type="password"> with eye toggle
// RN:  <TextInput secureTextEntry> with same toggle logic
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { IconEye, IconEyeOff } from "./Icons";
import { colors, radius, spacing, fontSize } from "../theme";

export default function Input({
  label,
  id,
  type      = "text",
  optional  = false,
  style,
  inputStyle,
  ...rest
}) {
  const { t }   = useTranslation();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <View style={[s.field, style]}>
      {label && (
        <View style={s.labelRow}>
          <Text style={s.label}>{label}</Text>
          {optional
            ? <Text style={s.optional}> ({t("common.optional")})</Text>
            : <Text style={s.required}>*</Text>
          }
        </View>
      )}

      <View style={s.inputWrap}>
        <TextInput
          style={[s.input, inputStyle]}
          secureTextEntry={isPassword && !show}
          keyboardType={
            type === "email"  ? "email-address" :
            type === "number" ? "numeric"       :
            type === "tel"    ? "phone-pad"     : "default"
          }
          autoCapitalize={type === "email" || isPassword ? "none" : "sentences"}
          autoCorrect={false}
          placeholderTextColor={colors.textFaint}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={s.eyeBtn}
            onPress={() => setShow((s) => !s)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {show
              ? <IconEyeOff size={15} color={colors.textMuted} />
              : <IconEye    size={15} color={colors.textMuted} />
            }
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  field: { gap: 6 },
  labelRow: {
    flexDirection: "row",
    alignItems:    "center",
  },
  label: {
    fontSize:   fontSize.sm,
    fontWeight: "500",
    color:      colors.text2,
  },
  required: {
    color:      "#ef4444",
    fontSize:   15,
    fontWeight: "700",
    marginLeft: 4,
  },
  optional: {
    fontSize:  fontSize.sm,
    fontWeight:"500",
    color:     colors.textMuted,
  },
  inputWrap: { position: "relative" },
  input: {
    width:           "100%",
    paddingVertical:  9,
    paddingHorizontal: spacing[3],
    borderWidth:     1,
    borderColor:     colors.borderStrong,
    borderRadius:    radius.md,
    backgroundColor: colors.surface,
    color:           colors.text,
    fontSize:        fontSize.sm,
    paddingRight:    38, // space for eye icon on password fields
  },
  eyeBtn: {
    position:  "absolute",
    right:     10,
    top:       "50%",
    transform: [{ translateY: -8 }],
    padding:   4,
  },
});
