// CONVERTED FROM: src/pages/marketplace/ListingDetails.jsx
//
// Web used Modal open={true} as a full-page overlay
// RN: full screen via ScreenShell with showBack=true (no modal needed — it IS the screen)
// useParams({ id }) → route.params.id
// navigate back → navigation.goBack() with from-based logic

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenShell        from "../../components/ScreenShell";
import Card               from "../../components/Card";
import Button             from "../../components/Button";
import ConfirmDialog      from "../../components/ConfirmDialog";
import LocationBadge      from "../../components/LocationBadge";
import ListingSkeleton    from "../../components/marketplace/ListingSkeleton";
import ListingSellerInfo  from "../../components/marketplace/ListingSellerInfo";
import ListingImageSlider from "../../components/marketplace/ListingImageSlider";

import { MarketplaceService } from "../../services/marketplaceService";
import { getErrorMessage }    from "../../utils/errorHandler";
import { useApp }             from "../../context/AppContext";
import { useAuth }            from "../../context/AuthContext";
import { colors, spacing, fontSize } from "../../theme";

export default function ListingDetailsScreen() {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const route         = useRoute();
  const { pushToast } = useApp();
  const { user, isFarmer } = useAuth();

  const { id, from } = route.params || {};

  const [listing,    setListing]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleClose = () => {
    if (from === "my-listings") {
      navigation.navigate("MyListings"); return;
    }
    navigation.goBack();
  };

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await MarketplaceService.getListingById(id);
      setListing(response?.data);
    } catch (error) {
      pushToast(getErrorMessage(error) || "Failed to load listing", "error");
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchListing(); }, [id]);

  const handleDelete = async () => {
    try {
      await MarketplaceService.deleteListing(listing.id);
      pushToast("Listing deleted successfully", "success");
      setDeleteOpen(false);
      navigation.navigate("MyListings");
    } catch (error) {
      pushToast(getErrorMessage(error) || "Failed to delete listing", "error");
    }
  };

  const isOwner      = listing?.seller_phone === user?.phone_number;
  const formattedDate = listing?.harvest_date
    ? new Date(listing.harvest_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "N/A";

  return (
    <ScreenShell title={listing?.crop_name || t("marketplace.marketplace")} showBack>
      {loading ? (
        <ListingSkeleton count={1} />
      ) : (
        <View style={s.content}>
          {/* Image slider */}
          <ListingImageSlider images={listing?.crop_images || []} />

          {/* Header: crop name + price */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <Text style={s.cropName}>{listing.crop_name}</Text>
              <Text style={s.farmName}>{listing.farm_name}</Text>
            </View>
            <Text style={s.price}>₹{Number(listing.expected_price || 0).toLocaleString()}</Text>
          </View>

          {/* Details grid */}
          <Card>
            <View style={s.detailsGrid}>
              {[
                [t("listingDetails.quantity"),    `${listing.quantity} ${listing.unit}`],
                [t("listingDetails.harvestDate"),  formattedDate],
                [t("listingDetails.village"),      listing.village],
                [t("listingDetails.taluka"),       listing.taluka],
                [t("listingDetails.district"),     listing.district],
                [t("listingDetails.status"),       listing.status],
              ].map(([label, value]) => (
                <View key={label} style={s.detailItem}>
                  <Text style={s.detailLabel}>{label}</Text>
                  <Text style={s.detailValue}>{value || "—"}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Location */}
          <Card>
            <Text style={s.sectionTitle}>{t("listingDetails.location")}</Text>
            <LocationBadge
              village={listing.village}  taluka={listing.taluka}
              district={listing.district} state={listing.state}
              style={s.locationBadge}
            />
          </Card>

          {/* Description */}
          <Card>
            <Text style={s.sectionTitle}>{t("listingDetails.description")}</Text>
            <Text style={s.description}>
              {listing?.description?.trim() || t("listingDetails.noDescription")}
            </Text>
          </Card>

          {/* Seller info */}
          <ListingSellerInfo
            sellerName={listing?.seller_name}
            sellerPhone={listing?.seller_phone}
          />

          {/* Owner actions */}
          {isOwner && isFarmer && (
            <Card>
              <View style={s.ownerActions}>
                <Button
                  onPress={() => navigation.navigate("EditListing", { id: listing.id })}
                  style={s.actionBtn}
                >
                  {t("listingDetails.editListing")}
                </Button>
                <Button variant="danger" onPress={() => setDeleteOpen(true)} style={s.actionBtn}>
                  {t("common.delete")}
                </Button>
              </View>
            </Card>
          )}
        </View>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title={t("listingDetails.deleteListing")}
        message={t("listingDetails.deleteConfirm")}
        confirmText={t("common.delete")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  content:      { gap: spacing[4], paddingBottom: spacing[5] },
  header:       { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing[3] },
  headerLeft:   { flex: 1 },
  cropName:     { fontSize: 24, fontWeight: "800", color: colors.text },
  farmName:     { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  price:        { fontSize: 26, fontWeight: "800", color: colors.success },
  detailsGrid:  { flexDirection: "row", flexWrap: "wrap", gap: spacing[4] },
  detailItem:   { width: "47%", gap: 4 },
  detailLabel:  { fontSize: 11, fontWeight: "700", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.4 },
  detailValue:  { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  sectionTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, marginBottom: spacing[3] },
  locationBadge:{ backgroundColor: colors.surface2, borderRadius: 12, padding: 12 },
  description:  { fontSize: fontSize.sm, color: colors.text2, lineHeight: 22 },
  ownerActions: { flexDirection: "row", gap: spacing[3] },
  actionBtn:    { flex: 1 },
});