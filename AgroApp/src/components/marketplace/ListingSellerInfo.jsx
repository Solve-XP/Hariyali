// CONVERTED FROM: ListingSellerInfo.jsx + ListingSellerInfo.css
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Card from "../Card";
import Badge from "../Badge";
import ContactActions from "../ContactActions";
import { colors, spacing, fontSize, radius } from "../../theme";

export default function ListingSellerInfo({
  sellerName,
  sellerPhone,
  sellerType  = "Farmer",
  isVerified  = false,
}) {
  const { t } = useTranslation();

  return (
    <Card style={s.card}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.avatar}><Text style={s.avatarIcon}>👤</Text></View>
        <View style={s.info}>
          <View style={s.nameRow}>
            <Text style={s.name}>{sellerName || t("listingSeller.unknownSeller")}</Text>
            {isVerified && <Badge variant="success">{t("listingSeller.verified")}</Badge>}
          </View>
          <Text style={s.role}>{sellerType}</Text>
        </View>
      </View>

      {/* Phone */}
      <View style={s.contactBox}>
        <View style={s.phoneRow}>
          <Text>📞</Text>
          <Text style={s.phone}>{sellerPhone || t("common.na")}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <ContactActions phone={sellerPhone} />
    </Card>
  );
}

const s = StyleSheet.create({
  card:       { gap: spacing[4] },
  header:     { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar:     { width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  avatarIcon: { fontSize: 22 },
  info:       { flex: 1, gap: 4 },
  nameRow:    { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  name:       { fontSize: 16, fontWeight: "700", color: colors.text },
  role:       { fontSize: 13, color: colors.textMuted },
  contactBox: { padding: 14, borderRadius: 16, backgroundColor: colors.surface2 },
  phoneRow:   { flexDirection: "row", alignItems: "center", gap: 10 },
  phone:      { fontSize: 14, fontWeight: "600", color: colors.text2 },
});