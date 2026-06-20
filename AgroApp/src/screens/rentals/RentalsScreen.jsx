// // CONVERTED FROM: src/pages/rentals/Rentals.jsx + Rental.css
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useTranslation } from "react-i18next";

// import ScreenShell       from "../../components/ScreenShell";
// import Card              from "../../components/Card";
// import SearchInput       from "../../components/SearchInput";
// import Select            from "../../components/Select";
// import RentalCard        from "../../components/rentals/RentalCard";
// import ListingEmptyState from "../../components/marketplace/ListingEmptyState";
// import ListingSkeleton   from "../../components/marketplace/ListingSkeleton";

// import { RentalsService }    from "../../services/rentalsService";
// import { calculateDistance } from "../../utils/location";
// import { getErrorMessage }   from "../../utils/errorHandler";
// import { useApp }            from "../../context/AppContext";
// import { useAuth }           from "../../context/AuthContext";
// import { colors, spacing, radius, fontSize } from "../../theme";

// export default function RentalsScreen() {
//   const { t }                        = useTranslation();
//   const navigation                   = useNavigation();
//   const { pushToast, userLocation }  = useApp();
//   const { isAuthenticated, isFarmer }= useAuth();

//   const [rentals,  setRentals]  = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [search,   setSearch]   = useState("");
//   const [sortBy,   setSortBy]   = useState("latest");
//   const [radiusKm, setRadiusKm] = useState(20);
//   const [district, setDistrict] = useState("");
//   const [showAll,  setShowAll]  = useState(false);

//   const fetchRentals = async () => {
//     try {
//       setLoading(true);
//       const params = { search };
//       if (isAuthenticated && isFarmer) params.exclude_my_listings = true;
//       const response = isAuthenticated
//         ? await RentalsService.getRentals(params)
//         : await RentalsService.getPublicRentals(params);
//       setRentals(response?.data || []);
//     } catch (error) {
//       pushToast(getErrorMessage(error) || t("rentals.failedToLoad"), "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchRentals(); }, [search]);

//   const filteredRentals = useMemo(() => {
//     let data = rentals
//       .map((item) => {
//         let distance = null;
//         if (userLocation?.latitude && userLocation?.longitude && item?.latitude && item?.longitude) {
//           distance = calculateDistance(userLocation.latitude, userLocation.longitude, item.latitude, item.longitude);
//         }
//         return { ...item, distance };
//       })
//       .filter((item) => item.distance !== null && item.distance <= radiusKm)
//       .sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));

//     if (district) data = data.filter((x) => x.district?.toLowerCase() === district.toLowerCase());

//     if (sortBy === "oldest")     data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//     if (sortBy === "price-low")  data.sort((a, b) => (a.price_per_day || a.price_per_hour || 0) - (b.price_per_day || b.price_per_hour || 0));
//     if (sortBy === "price-high") data.sort((a, b) => (b.price_per_day || b.price_per_hour || 0) - (a.price_per_day || a.price_per_hour || 0));
//     if (sortBy === "latest")     data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//     return data;
//   }, [rentals, district, sortBy, radiusKm, userLocation]);

//   const visibleRentals    = !isAuthenticated && !showAll ? filteredRentals.slice(0, 8) : filteredRentals;
//   const districtOptions   = [...new Set(rentals.map((r) => r.district).filter(Boolean))];

//   const handleViewDetails = (rental) => {
//     if (rental?.is_locked) {
//       pushToast(t("authMessages.loginToViewRental"), "error");
//       navigation.navigate("Login");
//       return;
//     }
//     navigation.navigate("RentalDetails", { id: rental.id, from: "rentals" });
//   };

//   return (
//     <ScreenShell title={t("rentals.marketplace")} scrollable={false}>
//       <FlatList
//         data={visibleRentals}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={s.listContent}
//         renderItem={({ item }) => (
//           <RentalCard
//             showDistance
//             rental={item}
//             distance={item.distance}
//             isOwner={false}
//             onViewDetails={() => handleViewDetails(item)}
//           />
//         )}
//         ListHeaderComponent={
//           <>
//             {/* Public header */}
//             <View style={s.publicHeader}>
//               <View>
//                 <Text style={s.publicTitle}>{t("rentals.marketplace")}</Text>
//                 <Text style={s.publicSubtitle}>{t("rentals.marketplaceSubtitle")}</Text>
//               </View>
//               {!isAuthenticated && (
//                 <View style={s.authActions}>
//                   <TouchableOpacity style={s.loginBtn}  onPress={() => navigation.navigate("Login")}>
//                     <Text style={s.loginBtnText}>{t("auth.login")}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={s.signupBtn} onPress={() => navigation.navigate("Signup")}>
//                     <Text style={s.signupBtnText}>{t("auth.signup")}</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             {/* Tabs — replaces .marketplace-tabs */}
//             {isAuthenticated && isFarmer && (
//               <View style={s.tabs}>
//                 <View style={[s.tab, s.tabActive]}>
//                   <Text style={[s.tabText, s.tabTextActive]}>{t("rentals.marketplace")}</Text>
//                 </View>
//                 <TouchableOpacity style={s.tab} onPress={() => navigation.navigate("MyRentals")}>
//                   <Text style={s.tabText}>{t("myRentals.myRentals")}</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {/* Filters */}
//             <Card style={s.filterCard}>
//               <SearchInput value={search} onChangeText={setSearch} placeholder={t("rentals.searchPlaceholder")} />
//               <View style={s.radiusRow}>
//                 <TextInput
//                   style={s.radiusInput}
//                   value={String(radiusKm)}
//                   onChangeText={(v) => setRadiusKm(Number(v) || 0)}
//                   keyboardType="numeric"
//                 />
//                 <Text style={s.radiusLabel}>{t("listing.showListingsWithin")}</Text>
//               </View>
//               <Select value={district} onValueChange={setDistrict}>
//                 <Select.Item label={t("rentals.allDistricts")} value="" />
//                 {districtOptions.map((d) => <Select.Item key={d} label={d} value={d} />)}
//               </Select>
//             </Card>

//             {loading && <ListingSkeleton count={4} />}
//             {!loading && !filteredRentals.length && (
//               <ListingEmptyState
//                 title={t("rentals.noRentalsFound")}
//                 subtitle={t("rentals.tryChangingFilters")}
//               />
//             )}
//           </>
//         }
//         ListFooterComponent={
//           !isAuthenticated && filteredRentals.length > 8 ? (
//             <TouchableOpacity style={s.viewAllBtn} onPress={() => setShowAll((v) => !v)}>
//               <Text style={s.viewAllText}>
//                 {showAll ? t("marketplace.showLess") : t("marketplace.viewAll")}
//               </Text>
//             </TouchableOpacity>
//           ) : null
//         }
//       />
//     </ScreenShell>
//   );
// }

// const s = StyleSheet.create({
//   listContent:   { padding: spacing[4], paddingBottom: spacing[7], gap: spacing[3] },
//   publicHeader:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[3], flexWrap: "wrap", marginBottom: spacing[3] },
//   publicTitle:   { fontSize: 28, fontWeight: "800", color: colors.text },
//   publicSubtitle:{ fontSize: 15, fontWeight: "500", color: colors.textMuted, marginTop: 6 },
//   authActions:   { flexDirection: "row", gap: 12 },
//   loginBtn:      { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14, borderWidth: 1, borderColor: "#dbe4ee", backgroundColor: "#fff" },
//   loginBtnText:  { fontSize: 14, fontWeight: "700", color: colors.text },
//   signupBtn:     { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14, backgroundColor: "#0f8b5f" },
//   signupBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
//   tabs:          { flexDirection: "row", backgroundColor: "#edf2f7", borderRadius: 22, padding: 8, gap: 8, marginBottom: spacing[3] },
//   tab:           { flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: "center" },
//   tabActive:     { backgroundColor: "#fff" },
//   tabText:       { fontSize: 14, fontWeight: "600", color: colors.textMuted },
//   tabTextActive: { color: "#0f8b5f" },
//   filterCard:    { gap: spacing[3], padding: spacing[3], marginBottom: spacing[3] },
//   radiusRow:     { flexDirection: "row", alignItems: "center", gap: 8 },
//   radiusInput:   { width: 72, height: 44, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, textAlign: "center", fontWeight: "600", color: colors.text, backgroundColor: colors.surface },
//   radiusLabel:   { fontSize: 14, color: colors.textMuted, flex: 1 },
//   viewAllBtn:    { alignSelf: "center", marginTop: spacing[4], paddingVertical: 14, paddingHorizontal: 28, borderRadius: 18, backgroundColor: colors.primary },
//   viewAllText:   { fontSize: 15, fontWeight: "700", color: "#fff" },
// });


import React, { useMemo, useState } from "react";
import {
  View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenShell       from "../../components/ScreenShell";
import Card              from "../../components/Card";
import SearchInput       from "../../components/SearchInput";
import Select            from "../../components/Select";
import RentalCard        from "../../components/rentals/RentalCard";
import ListingEmptyState from "../../components/marketplace/ListingEmptyState";
import ListingSkeleton   from "../../components/marketplace/ListingSkeleton";

import { RentalsService }    from "../../services/rentalsService";
import { calculateDistance } from "../../utils/location";
import { getErrorMessage }   from "../../utils/errorHandler";
import { useApp }            from "../../context/AppContext";
import { useAuth }           from "../../context/AuthContext";
import { colors, spacing, radius, fontSize } from "../../theme";

export default function RentalsScreen() {
  const { t }                        = useTranslation();
  const navigation                   = useNavigation();
  const { pushToast, userLocation }  = useApp();
  const { isAuthenticated, isFarmer }= useAuth();

  const [rentals,  setRentals]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [sortBy,   setSortBy]   = useState("latest");
  const [radiusKm, setRadiusKm] = useState(20);
  const [district, setDistrict] = useState("");
  const [showAll,  setShowAll]  = useState(false);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const params = { search };
      if (isAuthenticated && isFarmer) params.exclude_my_listings = true;
      const response = isAuthenticated
        ? await RentalsService.getRentals(params)
        : await RentalsService.getPublicRentals(params);
      setRentals(response?.data || []);
    } catch (error) {
      pushToast(getErrorMessage(error) || t("rentals.failedToLoad"), "error");
    } finally {
      setLoading(false);
    }
  };

  // Refetch every time screen is focused (handles post-create refresh)
  useFocusEffect(
    React.useCallback(() => {
      fetchRentals();
    }, [search])
  );

  const filteredRentals = useMemo(() => {
    let data = rentals
      .map((item) => {
        let distance = null;
        if (userLocation?.latitude && userLocation?.longitude && item?.latitude && item?.longitude) {
          distance = calculateDistance(userLocation.latitude, userLocation.longitude, item.latitude, item.longitude);
        }
        return { ...item, distance };
      })
      .filter((item) => item.distance !== null && item.distance <= radiusKm)
      .sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));

    if (district) data = data.filter((x) => x.district?.toLowerCase() === district.toLowerCase());
    if (sortBy === "oldest")     data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === "price-low")  data.sort((a, b) => (a.price_per_day || a.price_per_hour || 0) - (b.price_per_day || b.price_per_hour || 0));
    if (sortBy === "price-high") data.sort((a, b) => (b.price_per_day || b.price_per_hour || 0) - (a.price_per_day || a.price_per_hour || 0));
    if (sortBy === "latest")     data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return data;
  }, [rentals, district, sortBy, radiusKm, userLocation]);

  const visibleRentals  = !isAuthenticated && !showAll ? filteredRentals.slice(0, 8) : filteredRentals;
  const districtOptions = [...new Set(rentals.map((r) => r.district).filter(Boolean))];

  const handleViewDetails = (rental) => {
    if (rental?.is_locked) {
      pushToast(t("authMessages.loginToViewRental"), "error");
      navigation.navigate("Login");
      return;
    }
    navigation.navigate("RentalDetails", { id: rental.id, from: "rentals" });
  };

  return (
    <ScreenShell title={t("rentals.marketplace")} scrollable={false}>
      <FlatList
        data={visibleRentals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        renderItem={({ item }) => (
          <RentalCard
            showDistance
            rental={item}
            distance={item.distance}
            isOwner={false}
            onViewDetails={() => handleViewDetails(item)}
          />
        )}
        ListHeaderComponent={
          <>
            {/* Public header */}
            <View style={s.publicHeader}>
              <View>
                <Text style={s.publicTitle}>{t("rentals.marketplace")}</Text>
                <Text style={s.publicSubtitle}>{t("rentals.marketplaceSubtitle")}</Text>
              </View>
              {!isAuthenticated && (
                <View style={s.authActions}>
                  <TouchableOpacity style={s.loginBtn} onPress={() => navigation.navigate("Login")}>
                    <Text style={s.loginBtnText}>{t("auth.login")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.signupBtn} onPress={() => navigation.navigate("Signup")}>
                    <Text style={s.signupBtnText}>{t("auth.signup")}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Tabs */}
            {isAuthenticated && isFarmer && (
              <View style={s.tabs}>
                <View style={[s.tab, s.tabActive]}>
                  <Text style={[s.tabText, s.tabTextActive]}>{t("rentals.marketplace")}</Text>
                </View>
                <TouchableOpacity style={s.tab} onPress={() => navigation.navigate("MyRentals")}>
                  <Text style={s.tabText}>{t("myRentals.myRentals")}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Filters */}
            <Card style={s.filterCard}>
              <SearchInput value={search} onChangeText={setSearch} placeholder={t("rentals.searchPlaceholder")} />
              <View style={s.radiusRow}>
                <TextInput
                  style={s.radiusInput}
                  value={String(radiusKm)}
                  onChangeText={(v) => setRadiusKm(Number(v) || 0)}
                  keyboardType="numeric"
                />
                <Text style={s.radiusLabel}>{t("listing.showListingsWithin")}</Text>
              </View>
              <Select value={district} onValueChange={setDistrict}>
                <Select.Item label={t("rentals.allDistricts")} value="" />
                {districtOptions.map((d) => <Select.Item key={d} label={d} value={d} />)}
              </Select>
            </Card>

            {loading && <ListingSkeleton count={4} />}
            {!loading && !filteredRentals.length && (
              <ListingEmptyState
                title={t("rentals.noRentalsFound")}
                subtitle={t("rentals.tryChangingFilters")}
              />
            )}
          </>
        }
        ListFooterComponent={
          !isAuthenticated && filteredRentals.length > 8 ? (
            <TouchableOpacity style={s.viewAllBtn} onPress={() => setShowAll((v) => !v)}>
              <Text style={s.viewAllText}>
                {showAll ? t("marketplace.showLess") : t("marketplace.viewAll")}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  listContent:    {paddingBottom: spacing[7], gap: spacing[3] },
  publicHeader:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[3], flexWrap: "wrap", marginBottom: spacing[3] },
  publicTitle:    { fontSize: 28, fontWeight: "800", color: colors.text },
  publicSubtitle: { fontSize: 15, fontWeight: "500", color: colors.textMuted, marginTop: 6 },
  authActions:    { flexDirection: "row", gap: 12 },
  loginBtn:       { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14, borderWidth: 1, borderColor: "#dbe4ee", backgroundColor: "#fff" },
  loginBtnText:   { fontSize: 14, fontWeight: "700", color: colors.text },
  signupBtn:      { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14, backgroundColor: "#0f8b5f" },
  signupBtnText:  { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Tabs
  tabs:         { flexDirection: "row", backgroundColor: "#edf2f7", borderRadius: 22, padding: 8, gap: 8, marginBottom: spacing[3] },
  tab:          { flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: "center" },
  tabActive:    { backgroundColor: "#fff" },
  tabText:      { fontSize: 14, fontWeight: "600", color: colors.textMuted },
  tabTextActive:{ color: "#0f8b5f" },

  filterCard:  { gap: spacing[3], padding: spacing[3], marginBottom: spacing[3] },
  radiusRow:   { flexDirection: "row", alignItems: "center", gap: 8 },
  radiusInput: { width: 72, height: 44, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, textAlign: "center", fontWeight: "600", color: colors.text, backgroundColor: colors.surface },
  radiusLabel: { fontSize: 14, color: colors.textMuted, flex: 1 },
  viewAllBtn:  { alignSelf: "center", marginTop: spacing[4], paddingVertical: 14, paddingHorizontal: 28, borderRadius: 18, backgroundColor: colors.primary },
  viewAllText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});