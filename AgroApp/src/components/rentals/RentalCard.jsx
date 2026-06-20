// CONVERTED FROM: RentalCard.jsx + RentalCard.css
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Card          from "../Card";
import Button        from "../Button";
import ImageCarousel from "../ImageCarousel";
import ContactActions from "../ContactActions";
import { colors, spacing, radius, fontSize } from "../../theme";

export default function RentalCard({
  rental,
  distance,
  isOwner      = false,
  showDistance = false,
  onViewDetails,
  onEdit,
  onDelete,
  onImageClick,
}) {
  const { t } = useTranslation();

  const title      = rental?.equipment_name || t("listing.untitled");
  const owner      = rental?.owner_name     || t("listing.unknownSeller");
  const phone      = rental?.phone          || t("common.na");
  const images     = rental?.equipment_images || [];
  const hourlyPrice = rental?.price_per_hour;
  const dailyPrice  = rental?.price_per_day;

  const locationParts = [rental?.village, rental?.taluka, rental?.district, rental?.state]
    .filter(Boolean).join(", ");

  const getPostedDate = (date) => {
    if (!date) return "";
    const diffDays = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? t("listing.postedToday") : t("listing.postedAgo", { days: diffDays });
  };

  return (
    <Card style={s.card}>
      {/* Image */}
      <View style={s.imageWrap}>
        <ImageCarousel images={images} height={220} onImageClick={onImageClick} />

        {!!rental?.created_at && (
          <View style={s.postedBadge}>
            <Text style={s.postedText}>{getPostedDate(rental.created_at)}</Text>
          </View>
        )}

        {showDistance && distance !== null && distance !== undefined && (
          <View style={s.distanceBadge}>
            <Text style={s.distanceText}>📍 {distance} km {t("common.distance")}</Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={s.body}>
        {/* Header: title + price */}
        <View style={s.header}>
          <View style={s.heading}>
            <Text style={s.title} numberOfLines={2}>{title}</Text>
            <Text style={s.subtitle}>{t("rental.equipmentName")}</Text>
          </View>
          <View style={s.priceWrap}>
            {!!dailyPrice && (
              <View style={s.priceMainRow}>
                <Text style={s.priceMain}>₹{Number(dailyPrice).toLocaleString()}</Text>
                <Text style={s.priceUnit}>{t("rental.perDay")}</Text>
              </View>
            )}
            {!!hourlyPrice && (
              <Text style={s.priceSmall}>₹{Number(hourlyPrice).toLocaleString()} {t("rental.perHour")}</Text>
            )}
          </View>
        </View>

        {/* Owner + phone */}
        <View style={s.sellerRow}>
          <Text style={s.sellerName} numberOfLines={1}>👤 <Text style={{ fontWeight: "700" }}>{owner}</Text></Text>
          <Text style={s.sellerPhone} numberOfLines={1}>📞 <Text style={{ fontWeight: "700" }}>{phone}</Text></Text>
        </View>

        {/* Location */}
        {!!locationParts && (
          <View style={s.locationWrap}>
            <Text style={s.location} numberOfLines={2}>{locationParts}</Text>
          </View>
        )}

        {/* Actions */}
        {/* <View style={s.actions}>
          <Button size="sm" variant="secondary" onPress={() => onViewDetails?.(rental)} style={s.actionBtn}>
            {t("common.details")}
          </Button>
          {isOwner ? (
            <>
              <Button size="sm" variant="accent"  onPress={() => onEdit?.(rental)}   style={s.actionBtn}>{t("common.edit")}</Button>
              <Button size="sm" variant="danger"  onPress={() => onDelete?.(rental)} style={s.actionBtn}>{t("common.delete")}</Button>
            </>
          ) : (
            <View style={s.actionBtn}>
              <ContactActions phone={phone} latitude={rental?.latitude} longitude={rental?.longitude} isLocked={rental?.is_locked} />
            </View>
          )}
        </View> */}
        {/* Actions */}
        {isOwner ? (
          <View style={s.actions}>
            <Button size="sm" variant="secondary" onPress={() => onViewDetails?.(rental)} style={s.actionBtn}>
              {t("common.details")}
            </Button>
            <Button size="sm" variant="accent"   onPress={() => onEdit?.(rental)}   style={s.actionBtn}>{t("common.edit")}</Button>
            <Button size="sm" variant="danger"   onPress={() => onDelete?.(rental)} style={s.actionBtn}>{t("common.delete")}</Button>
          </View>
        ) : (
          <View style={s.marketplaceActions}>
            <Button size="sm" variant="secondary" onPress={() => onViewDetails?.(rental)} style={s.detailsBtn}>
              {t("common.details")}
            </Button>
            <ContactActions
              phone={phone}
              latitude={rental?.latitude}
              longitude={rental?.longitude}
              isLocked={rental?.is_locked}
            />
          </View>
        )}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card:         { padding: 0, overflow: "hidden", borderRadius: 20 },
  imageWrap:    { position: "relative" },
  postedBadge:  { position: "absolute", top: 10, right: 10, zIndex: 10, backgroundColor: "rgba(255,255,255,0.58)", borderRadius: 999, borderWidth: 1, borderColor: "rgba(0,0,0,0.6)", paddingVertical: 5, paddingHorizontal: 12 },
  postedText:   { fontSize: 12, fontWeight: "700", color: "#111827" },
  distanceBadge:{ position: "absolute", bottom: 12, left: 12, zIndex: 10, backgroundColor: "rgba(22,163,74,0.95)", borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12 },
  distanceText: { fontSize: 13, fontWeight: "600", color: "#fff" },
  body:         { padding: 16, gap: spacing[3] },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 14 },
  heading:      { flex: 1, minWidth: 0 },
  title:        { fontSize: 20, fontWeight: "700", color: colors.text },
  subtitle:     { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  priceWrap:    { flexShrink: 0, alignItems: "flex-end" },
  priceMainRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  priceMain:    { fontSize: 22, fontWeight: "800", color: colors.success },
  priceUnit:    { fontSize: 14, fontWeight: "600", color: colors.textMuted },
  priceSmall:   { fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 4 },
  sellerRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  sellerName:   { fontSize: 14, color: colors.text, flex: 1 },
  sellerPhone:  { fontSize: 14, color: colors.text },
  locationWrap: { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12 },
  location:     { fontSize: 13, fontWeight: "600", color: colors.text },
    // Replace actions + actionBtn, add new ones
  actions:           { flexDirection: "row", gap: 8 },
  actionBtn:         { flex: 1 },
  marketplaceActions:{ gap: 8 },           // ← vertical stack
  detailsBtn:        { width: "100%" },    // ← full width on its own row
});