// CONVERTED FROM: ListingCard.jsx + ListingCard.css
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Card          from "../Card";
import Button        from "../Button";
import Badge         from "../Badge";
import ImageCarousel from "../ImageCarousel";
import ContactActions from "../ContactActions";
import { colors, spacing, radius, fontSize } from "../../theme";

export default function ListingCard({
  listing,
  distance,
  type        = "marketplace",
  isOwner     = false,
  onViewDetails,
  onEdit,
  onDelete,
  onImageClick,
}) {
  const { t } = useTranslation();

  const formattedDate = listing?.harvest_date
    ? new Date(listing.harvest_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : t("common.na");

  const title    = listing?.crop_name || listing?.equipment_name || t("listing.untitled");
  const subtitle = listing?.farm_name || listing?.owner_name || "";
  const price    = listing?.expected_price || listing?.rental_price || 0;
  const images   = listing?.crop_images || listing?.images || [];

  const priceLabel    = type === "rental" ? t("listing.rentalPrice")    : t("listing.expectedPrice");
  const quantityLabel = type === "rental" ? t("listing.available")      : t("listing.expectedQuantity");
  const dateLabel     = type === "rental" ? t("listing.availableDate")  : t("listing.harvestDate");

  const getPostedDate = (date) => {
    if (!date) return "";
    const diffDays = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? t("listing.postedToday") : t("listing.postedAgo", { days: diffDays });
  };

  const locationParts = [listing?.village, listing?.taluka, listing?.district, listing?.state].filter(Boolean).join(", ");

  return (
    <Card style={s.card}>
      {/* Image */}
      <View style={s.imageWrap}>
        <ImageCarousel images={images} height={180} onImageClick={onImageClick} />

        {/* Posted badge — replaces .listing-card__posted-badge absolute top-right */}
        {!!listing?.created_at && (
          <View style={s.postedBadge}>
            <Text style={s.postedText}>{getPostedDate(listing.created_at)}</Text>
          </View>
        )}

        {/* Distance badge — replaces .listing-card__distance-badge absolute bottom-left */}
        {distance !== null && distance !== undefined && (
          <View style={s.distanceBadge}>
            <Text style={s.distanceText}>📍 {distance} km {t("common.distance")}</Text>
          </View>
        )}

        {listing?.is_verified && (
          <View style={s.verifiedBadge}>
            <Badge variant="success">{t("listing.verified")}</Badge>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={s.body}>
        {/* Header: title + price */}
        <View style={s.header}>
          <View style={s.heading}>
            <Text style={s.title} numberOfLines={2}>{title}</Text>
            {!!subtitle && <Text style={s.subtitle} numberOfLines={1}>{subtitle}</Text>}
          </View>
          <View style={s.priceWrap}>
            <Text style={s.price}>₹{Number(price).toLocaleString()}</Text>
            <Text style={s.priceLabel}>{priceLabel}</Text>
          </View>
        </View>

        {/* Meta: quantity + date */}
        <View style={s.meta}>
          <View style={s.metaItem}>
            <Text style={s.metaValue}>{listing?.quantity} {listing?.unit}</Text>
            <Text style={s.metaLabel}>{quantityLabel}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.metaValue}>{formattedDate}</Text>
            <Text style={s.metaLabel}>{dateLabel}</Text>
          </View>
        </View>

        {/* Seller */}
        <View style={s.sellerRow}>
          <Text style={s.sellerName} numberOfLines={1}>
            👤 {listing?.seller_name || t("listing.unknownSeller")}
          </Text>
          <Text style={s.sellerPhone} numberOfLines={1}>
            📞 {listing?.seller_phone || t("common.na")}
          </Text>
        </View>

        {/* Location */}
        {!!locationParts && (
          <Text style={s.location} numberOfLines={2}>{locationParts}</Text>
        )}

        {/* Actions */}
        {/* <View style={s.actions}>
          <Button size="sm" variant="secondary" onPress={() => onViewDetails?.(listing)} style={s.actionBtn}>
            {t("common.details")}
          </Button>

          {isOwner ? (
            <>
              <Button size="sm" variant="accent"  onPress={() => onEdit?.(listing)}   style={s.actionBtn}>{t("common.edit")}</Button>
              <Button size="sm" variant="danger"  onPress={() => onDelete?.(listing)} style={s.actionBtn}>{t("common.delete")}</Button>
            </>
          ) : (
            <View style={s.contactWrap}>
              <ContactActions
                phone={listing?.seller_phone}
                latitude={listing?.latitude}
                longitude={listing?.longitude}
                isLocked={listing?.is_locked}
              />
            </View>
          )}
        </View> */}
        {/* Actions */}
        {isOwner ? (
          <View style={s.actions}>
            <Button size="sm" variant="secondary" onPress={() => onViewDetails?.(listing)} style={s.actionBtn}>
              {t("common.details")}
            </Button>
            <Button size="sm" variant="accent"  onPress={() => onEdit?.(listing)}   style={s.actionBtn}>{t("common.edit")}</Button>
            <Button size="sm" variant="danger"  onPress={() => onDelete?.(listing)} style={s.actionBtn}>{t("common.delete")}</Button>
          </View>
        ) : (
          <View style={s.marketplaceActions}>
            <Button size="sm" variant="secondary" onPress={() => onViewDetails?.(listing)} style={s.detailsBtn}>
              {t("common.details")}
            </Button>
            <ContactActions
              phone={listing?.seller_phone}
              latitude={listing?.latitude}
              longitude={listing?.longitude}
              isLocked={listing?.is_locked}
            />
          </View>
        )}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  // card: { padding: 0, overflow: "hidden", borderRadius: 20, marginBottom: 14 },
  card: { padding: 0, overflow: "hidden", borderRadius: 20 },

  // Image area
  imageWrap: { position: "relative" },

  postedBadge: {
    position: "absolute", top: 10, right: 10, zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.58)", borderRadius: 999,
    borderWidth: 1, borderColor: "rgba(0,0,0,0.6)",
    paddingVertical: 5, paddingHorizontal: 12,
  },
  postedText: { fontSize: 12, fontWeight: "600", color: "#000" },

  distanceBadge: {
    position: "absolute", bottom: 12, left: 12, zIndex: 10,
    backgroundColor: "rgba(22,163,74,0.95)", borderRadius: 999,
    paddingVertical: 5, paddingHorizontal: 12,
  },
  distanceText: { fontSize: 13, fontWeight: "600", color: "#fff" },

  verifiedBadge: { position: "absolute", top: 12, right: 12, zIndex: 2 },

  // Body
  body: { padding: 16, gap: spacing[3] },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 14 },
  heading: { flex: 1, minWidth: 0 },
  title:   { fontSize: 20, fontWeight: "700", color: colors.text, lineHeight: 24 },
  subtitle:{ fontSize: 13, color: colors.textMuted, marginTop: 4 },

  priceWrap:  { flexShrink: 0, alignItems: "flex-end" },
  price:      { fontSize: 22, fontWeight: "800", color: colors.success, lineHeight: 26 },
  priceLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },

  // Meta
  meta: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  metaItem:  { minWidth: 0 },
  metaValue: { fontSize: 16, fontWeight: "700", color: colors.text },
  metaLabel: { fontSize: 12, fontWeight: "500", color: colors.textMuted, marginTop: 4 },

  // Seller
  sellerRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  sellerName:  { fontSize: 14, fontWeight: "700", color: colors.text, flex: 1 },
  sellerPhone: { fontSize: 14, fontWeight: "700", color: colors.text },

  // Location
  location: { fontSize: 13, fontWeight: "600", color: colors.text, lineHeight: 18 },

  // Actions
  actions:           { flexDirection: "row", gap: 8, marginTop: 4 },
  actionBtn:         { flex: 1 },
  marketplaceActions:{ gap: 8, marginTop: 4 },   // ← vertical stack
  detailsBtn:        { width: "100%" },           // ← full width top row
  contactWrap:       { flex: 1 },                 // ← keep for safety
});