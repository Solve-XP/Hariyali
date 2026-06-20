import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import EmptyState from "../EmptyState";
import Button from "../Button";
import { colors, spacing, fontSize } from "../../theme";

export default function ListingEmptyState({
  title    = "No listings found",
  subtitle = "Try changing filters or create a listing.",
  actionText,
  onAction,
}) {
  const { t } = useTranslation();

  return (
    <View style={s.wrap}>
      <EmptyState
        message={title === "No listings found" ? t("listing.noListingsFound") : title}
      />
      {!!subtitle && (
        <Text style={s.subtitle}>
          {subtitle === "Try changing filters or create a listing."
            ? t("listing.tryChangingFilters")
            : subtitle}
        </Text>
      )}
      {!!actionText && (
        <Button onPress={onAction} style={s.btn}>{actionText}</Button>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:     { alignItems: "center", gap: spacing[3] },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center" },
  btn:      { marginTop: spacing[2] },
});