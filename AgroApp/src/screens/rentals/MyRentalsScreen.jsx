// // CONVERTED FROM: src/pages/rentals/MyRentals.jsx
// import React, { useEffect, useState } from "react";
// import { View, StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useTranslation } from "react-i18next";

// import ScreenShell       from "../../components/ScreenShell";
// import PageHeader        from "../../components/PageHeader";
// import Button            from "../../components/Button";
// import ConfirmDialog     from "../../components/ConfirmDialog";
// import RentalCard        from "../../components/rentals/RentalCard";
// import ListingEmptyState from "../../components/marketplace/ListingEmptyState";
// import ListingSkeleton   from "../../components/marketplace/ListingSkeleton";

// import { RentalsService }  from "../../services/rentalsService";
// import { getErrorMessage } from "../../utils/errorHandler";
// import { useApp }          from "../../context/AppContext";
// import { spacing }         from "../../theme";

// export default function MyRentalsScreen() {
//   const { t }         = useTranslation();
//   const navigation    = useNavigation();
//   const { pushToast } = useApp();

//   const [rentals,        setRentals]        = useState([]);
//   const [loading,        setLoading]        = useState(true);
//   const [selectedRental, setSelectedRental] = useState(null);
//   const [deleteOpen,     setDeleteOpen]     = useState(false);

//   const fetchRentals = async () => {
//     try {
//       setLoading(true);
//       const res = await RentalsService.getMyRentals();
//       setRentals(res?.data || []);
//     } catch (error) {
//       pushToast(getErrorMessage(error) || t("myRentals.failedToLoad"), "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchRentals(); }, []);

//   const handleDelete = async () => {
//     if (!selectedRental) return;
//     try {
//       await RentalsService.deleteRental(selectedRental.id);
//       pushToast(t("myRentals.deletedSuccess"), "success");
//       setDeleteOpen(false);
//       setSelectedRental(null);
//       fetchRentals();
//     } catch (error) {
//       pushToast(getErrorMessage(error) || t("myRentals.failedToDelete"), "error");
//     }
//   };

//   return (
//     <ScreenShell title={t("myRentals.myRentals")}>
//       <PageHeader
//         title={t("myRentals.myRentals")}
//         subtitle={t("myRentals.manageEquipment")}
//         action={<Button onPress={() => navigation.navigate("CreateRental")}>{t("myRentals.addRental")}</Button>}
//       />

//       {/* Tabs */}
//       <View style={s.tabs}>
//         <Button variant="ghost" onPress={() => navigation.navigate("RentalsHome")} style={s.tab}>
//           {t("myRentals.rentalMarketplace")}
//         </Button>
//         <Button variant="secondary" style={s.tab}>{t("myRentals.myRentals")}</Button>
//       </View>

//       {loading ? (
//         <ListingSkeleton count={4} />
//       ) : !rentals.length ? (
//         <ListingEmptyState
//           title={t("myRentals.noRentals")}
//           subtitle={t("myRentals.createFirstRental")}
//           actionText={t("myRentals.addRental")}
//           onAction={() => navigation.navigate("CreateRental")}
//         />
//       ) : (
//         <View style={s.grid}>
//           {rentals.map((rental) => (
//             <RentalCard
//               key={rental.id}
//               rental={rental}
//               isOwner
//               onViewDetails={() => navigation.navigate("RentalDetails", { id: rental.id, from: "my-rentals" })}
//               onEdit={() => navigation.navigate("EditRental", { id: rental.id })}
//               onDelete={() => { setSelectedRental(rental); setDeleteOpen(true); }}
//             />
//           ))}
//         </View>
//       )}

//       <ConfirmDialog
//         open={deleteOpen}
//         title={t("myRentals.deleteRental")}
//         message={`${t("myRentals.deleteConfirm")} "${selectedRental?.equipment_name}"?`}
//         confirmText={t("common.delete")}
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteOpen(false)}
//       />
//     </ScreenShell>
//   );
// }

// const s = StyleSheet.create({
//   tabs: { flexDirection: "row", gap: spacing[2], marginBottom: spacing[3] },
//   tab:  { flex: 1 },
//   grid: { gap: spacing[3] },
// });


import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenShell       from "../../components/ScreenShell";
import PageHeader        from "../../components/PageHeader";
import Button            from "../../components/Button";
import ConfirmDialog     from "../../components/ConfirmDialog";
import RentalCard        from "../../components/rentals/RentalCard";
import ListingEmptyState from "../../components/marketplace/ListingEmptyState";
import ListingSkeleton   from "../../components/marketplace/ListingSkeleton";

import { RentalsService }  from "../../services/rentalsService";
import { getErrorMessage } from "../../utils/errorHandler";
import { useApp }          from "../../context/AppContext";
import { colors, spacing } from "../../theme";

export default function MyRentalsScreen() {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const { pushToast } = useApp();

  const [rentals,        setRentals]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);
  const [deleteOpen,     setDeleteOpen]     = useState(false);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const res = await RentalsService.getMyRentals();
      setRentals(res?.data || []);
    } catch (error) {
      pushToast(getErrorMessage(error) || t("myRentals.failedToLoad"), "error");
    } finally {
      setLoading(false);
    }
  };

  // Refetch every time screen is focused (handles post-create refresh)
  useFocusEffect(
    React.useCallback(() => {
      fetchRentals();
    }, [])
  );

  const handleDelete = async () => {
    if (!selectedRental) return;
    try {
      await RentalsService.deleteRental(selectedRental.id);
      pushToast(t("myRentals.deletedSuccess"), "success");
      setDeleteOpen(false);
      setSelectedRental(null);
      fetchRentals();
    } catch (error) {
      pushToast(getErrorMessage(error) || t("myRentals.failedToDelete"), "error");
    }
  };

  return (
    <ScreenShell title={t("myRentals.myRentals")}>
      <PageHeader
        title={t("myRentals.myRentals")}
        subtitle={t("myRentals.manageEquipment")}
        action={<Button onPress={() => navigation.navigate("CreateRental")}>{t("myRentals.addRental")}</Button>}
      />

      {/* Tabs */}
      <View style={s.tabs}>
        <TouchableOpacity style={s.tab} onPress={() => navigation.navigate("RentalsHome")}>
          <Text style={s.tabText}>{t("myRentals.rentalMarketplace")}</Text>
        </TouchableOpacity>
        <View style={[s.tab, s.tabActive]}>
          <Text style={[s.tabText, s.tabTextActive]}>{t("myRentals.myRentals")}</Text>
        </View>
      </View>

      {loading ? (
        <ListingSkeleton count={4} />
      ) : !rentals.length ? (
        <ListingEmptyState
          title={t("myRentals.noRentals")}
          subtitle={t("myRentals.createFirstRental")}
          actionText={t("myRentals.addRental")}
          onAction={() => navigation.navigate("CreateRental")}
        />
      ) : (
        <View style={s.grid}>
          {rentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              isOwner
              onViewDetails={() => navigation.navigate("RentalDetails", { id: rental.id, from: "my-rentals" })}
              onEdit={() => navigation.navigate("EditRental", { id: rental.id })}
              onDelete={() => { setSelectedRental(rental); setDeleteOpen(true); }}
            />
          ))}
        </View>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title={t("myRentals.deleteRental")}
        message={`${t("myRentals.deleteConfirm")} "${selectedRental?.equipment_name}"?`}
        confirmText={t("common.delete")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  // Tabs
  tabs:         { flexDirection: "row", backgroundColor: "#edf2f7", borderRadius: 22, padding: 8, gap: 8, marginBottom: spacing[3] },
  tab:          { flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: "center" },
  tabActive:    { backgroundColor: "#fff" },
  tabText:      { fontSize: 14, fontWeight: "600", color: colors.textMuted },
  tabTextActive:{ color: "#0f8b5f" },

  grid: { gap: spacing[3] },
});