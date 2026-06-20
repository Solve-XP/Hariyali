// CONVERTED FROM: ListingFilters.jsx + ListingFilters.css
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import SearchInput from "../SearchInput";
import Select      from "../Select";
import Card        from "../Card";
import { colors, spacing, radius, fontSize } from "../../theme";

export default function ListingFilters({
  search           = "",
  onSearchChange,
  sortBy           = "latest",
  onSortChange,
  radius: radiusVal = 20,
  onRadiusChange,
  showLocationFilters = true,
}) {
  const { t } = useTranslation();

  return (
    <Card style={s.filters}>
      {/* Search — replaces .listing-filters__search flex:1 */}
      <SearchInput
        value={search}
        onChangeText={(v) => onSearchChange?.(v)}
        placeholder={t("listing.searchPlaceholder")}
      />

      {/* Radius input — replaces .listing-filters__radius-input */}
      <View style={s.radiusRow}>
        <TextInput
          style={s.radiusInput}
          value={String(radiusVal)}
          onChangeText={(v) => onRadiusChange?.(Number(v) || 0)}
          keyboardType="numeric"
          returnKeyType="done"
        />
        <Text style={s.radiusLabel}>{t("listing.showListingsWithin")}</Text>
      </View>

      {/* Sort — replaces .listing-filters__sort width:220px */}
      <Select
        value={sortBy}
        onValueChange={(v) => onSortChange?.(v)}
        style={s.sort}
      >
        <Select.Item label={t("listing.latestListings")} value="latest"     />
        <Select.Item label={t("listing.oldestListings")} value="oldest"     />
        <Select.Item label={t("listing.priceLowHigh")}   value="price-low"  />
        <Select.Item label={t("listing.priceHighLow")}   value="price-high" />
      </Select>
    </Card>
  );
}

const s = StyleSheet.create({
  filters:    { gap: spacing[3], padding: spacing[4] },
  radiusRow:  { flexDirection: "row", alignItems: "center", gap: 8 },
  radiusInput:{
    width: 72, height: 44, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: 12,
    textAlign: "center", fontWeight: "600", fontSize: fontSize.sm,
    color: colors.text, backgroundColor: colors.surface,
  },
  radiusLabel: { fontSize: 14, color: colors.textMuted, flex: 1 },
  sort:        { marginTop: 0 },
});