// CONVERTED FROM: src/pages/rentals/RentalDetails.jsx
// Web used Modal open={true} — RN uses full ScreenShell with showBack
// useParams → route.params.id
// location.state?.from → route.params.from
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenShell        from "../../components/ScreenShell";
import Card               from "../../components/Card";
import Button             from "../../components/Button";
import ConfirmDialog      from "../../components/ConfirmDialog";
import ListingSkeleton    from "../../components/marketplace/ListingSkeleton";
import ListingImageSlider from "../../components/marketplace/ListingImageSlider";
import ListingSellerInfo  from "../../components/marketplace/ListingSellerInfo";
import ContactActions     from "../../components/ContactActions";

import { RentalsService }  from "../../services/rentalsService";
import { getErrorMessage } from "../../utils/errorHandler";
import { useApp }          from "../../context/AppContext";
import { colors, spacing, fontSize } from "../../theme";

export default function RentalDetailsScreen() {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const route         = useRoute();
  const { pushToast } = useApp();

  const { id, from } = route.params || {};

  const [rental,     setRental]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = from === "my-rentals";

  const handleClose = () => {
    if (from === "my-rentals") { navigation.navigate("MyRentals"); return; }
    navigation.navigate("RentalsHome");
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await RentalsService.getRentalById(id);
        setRental(res?.data);
      } catch (error) {
        pushToast(getErrorMessage(error) || "Failed to load rental", "error");
        handleClose();
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    try {
      await RentalsService.deleteRental(rental.id);
      pushToast("Rental deleted successfully", "success");
      navigation.navigate("MyRentals");
    } catch (error) {
      pushToast(getErrorMessage(error) || "Failed to delete rental", "error");
    }
  };

  return (
    <ScreenShell title={rental?.equipment_name || t("rentals.marketplace")} showBack>
      {loading ? (
        <ListingSkeleton count={1} />
      ) : (
        <View style={s.content}>
          <ListingImageSlider images={rental?.equipment_images || []} />

          {/* Header */}
          <Text style={s.title}>{rental?.equipment_name}</Text>

          {/* Prices */}
          <Card>
            <View style={s.priceRow}>
              {!!rental?.price_per_hour && (
                <View style={s.priceCard}>
                  <Text style={s.priceValue}>₹{Number(rental.price_per_hour).toLocaleString()}</Text>
                  <Text style={s.priceUnit}>{t("rental.perHour")}</Text>
                </View>
              )}
              {!!rental?.price_per_day && (
                <View style={s.priceCard}>
                  <Text style={s.priceValue}>₹{Number(rental.price_per_day).toLocaleString()}</Text>
                  <Text style={s.priceUnit}>{t("rental.perDay")}</Text>
                </View>
              )}
            </View>
          </Card>

          {/* Details grid */}
          <Card>
            <View style={s.detailsGrid}>
              {[
                [t("listingDetails.village"),        rental?.village],
                [t("listingDetails.taluka"),         rental?.taluka],
                [t("listingDetails.district"),       rental?.district],
                [t("rentalDetails.state"),           rental?.state],
                [t("rentalDetails.availability"),    rental?.is_available ? t("rentalDetails.available") : t("rentalDetails.unavailable")],
              ].map(([label, value]) => (
                <View key={label} style={s.detailItem}>
                  <Text style={s.detailLabel}>{label}</Text>
                  <Text style={s.detailValue}>{value || "—"}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Description */}
          <Card>
            <Text style={s.sectionTitle}>{t("listingDetails.description")}</Text>
            <Text style={s.description}>{rental?.description?.trim() || t("rentalDetails.noDescription")}</Text>
          </Card>

          {/* Seller info */}
          <ListingSellerInfo sellerName={rental?.owner_name} sellerPhone={rental?.phone} />

          {/* Actions */}
          <Card>
            {isOwner ? (
              <View style={s.actions}>
                <Button onPress={() => navigation.navigate("EditRental", { id: rental.id })} style={s.actionBtn}>
                  {t("editRental.editRental")}
                </Button>
                <Button variant="danger" onPress={() => setDeleteOpen(true)} style={s.actionBtn}>
                  {t("common.delete")}
                </Button>
              </View>
            ) : (
              <ContactActions phone={rental?.phone} />
            )}
          </Card>
        </View>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title={t("myRentals.deleteRental")}
        message={t("rentalDetails.deleteConfirm")}
        confirmText={t("common.delete")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  content:      { gap: spacing[4], paddingBottom: spacing[5] },
  title:        { fontSize: 26, fontWeight: "800", color: colors.text },
  priceRow:     { flexDirection: "row", gap: spacing[4] },
  priceCard:    { flex: 1, alignItems: "center", gap: 4 },
  priceValue:   { fontSize: 24, fontWeight: "800", color: colors.success },
  priceUnit:    { fontSize: 14, color: colors.textMuted },
  detailsGrid:  { flexDirection: "row", flexWrap: "wrap", gap: spacing[4] },
  detailItem:   { width: "47%", gap: 4 },
  detailLabel:  { fontSize: 11, fontWeight: "700", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.4 },
  detailValue:  { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  sectionTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, marginBottom: spacing[3] },
  description:  { fontSize: fontSize.sm, color: colors.text2, lineHeight: 22 },
  actions:      { flexDirection: "row", gap: spacing[3] },
  actionBtn:    { flex: 1 },
});