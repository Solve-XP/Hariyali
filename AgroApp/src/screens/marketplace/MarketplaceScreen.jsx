// // CONVERTED FROM: src/pages/marketplace/Marketplace.jsx + Marketplace.css
// //
// // Key changes:
// //   useNavigate → useNavigation
// //   useLocation (pathname check) → useAuth isFarmer/isAuthenticated
// //   distance filter applied same way — uses userLocation from AppContext
// //   Public "show all" toggle kept
// //   Grid replaced by FlatList (1 col always on mobile)

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View, Text, TouchableOpacity, FlatList,
//   StyleSheet, ActivityIndicator,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useTranslation } from "react-i18next";

// import ScreenShell       from "../../components/ScreenShell";
// import ListingGrid       from "../../components/marketplace/ListingGrid";
// import ListingFilters    from "../../components/marketplace/ListingFilters";
// import ListingSkeleton   from "../../components/marketplace/ListingSkeleton";
// import ListingEmptyState from "../../components/marketplace/ListingEmptyState";
// import MarketplaceTabs   from "../../components/marketplace/MarketplaceTabs";
// import ImageViewer       from "../../components/ImageViewer";

// import { MarketplaceService } from "../../services/marketplaceService";
// import { calculateDistance }  from "../../utils/location";
// import { getErrorMessage }    from "../../utils/errorHandler";
// import { useApp }             from "../../context/AppContext";
// import { useAuth }            from "../../context/AuthContext";
// import { colors, spacing, radius, fontSize } from "../../theme";

// export default function MarketplaceScreen() {
//   const { t }                    = useTranslation();
//   const navigation               = useNavigation();
//   const { pushToast, userLocation } = useApp();
//   const { isFarmer, isAuthenticated } = useAuth();

//   const [listings,      setListings]      = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [search,        setSearch]        = useState("");
//   const [sortBy,        setSortBy]        = useState("latest");
//   const [radiusKm,      setRadiusKm]      = useState(20);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showAll,       setShowAll]       = useState(false);

//   // ── Sort helper — identical to web ────────────────────────────────────────
//   function applySorting(data = []) {
//     const sorted = [...data];
//     if (sortBy === "price-low")  sorted.sort((a, b) => (a.expected_price || 0) - (b.expected_price || 0));
//     if (sortBy === "price-high") sorted.sort((a, b) => (b.expected_price || 0) - (a.expected_price || 0));
//     if (sortBy === "oldest")     sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//     if (sortBy === "latest")     sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//     return sorted;
//   }

//   const fetchListings = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = { search };
//       if (isAuthenticated && isFarmer) params.exclude_my_listings = true;

//       const response = isAuthenticated
//         ? await MarketplaceService.getListings(params)
//         : await MarketplaceService.getPublicListings(params);

//       setListings(applySorting(response?.data || []));
//     } catch (error) {
//       pushToast(getErrorMessage(error) || t("marketplace.failedToLoad"), "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [search, sortBy, isAuthenticated, isFarmer]);

//   useEffect(() => { fetchListings(); }, [search, sortBy]);

//   // ── Distance filter — same logic as web ──────────────────────────────────
//   const distanceFiltered = listings
//     .map((listing) => {
//       let distance = null;
//       if (userLocation?.latitude && userLocation?.longitude && listing?.latitude && listing?.longitude) {
//         distance = calculateDistance(userLocation.latitude, userLocation.longitude, listing.latitude, listing.longitude);
//       }
//       return { ...listing, distance };
//     })
//     .filter((l) => l.distance !== null && l.distance <= radiusKm)
//     .sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));

//   const visibleListings = !isAuthenticated && !showAll ? distanceFiltered.slice(0, 8) : distanceFiltered;

//   // ── Navigate to detail — replaces navigate(`/farmer/marketplace/${id}`) ──
//   const handleViewDetails = (listing) => {
//     if (listing?.is_locked) {
//       pushToast(t("authMessages.loginToViewListing"), "error");
//       navigation.navigate("Login");
//       return;
//     }
//     navigation.navigate("ListingDetails", { id: listing.id, from: "marketplace" });
//   };

//   return (
//     <ScreenShell title={t("marketplace.marketplace")} scrollable={false}>
//       <FlatList
//         data={visibleListings}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={s.listContent}
//         renderItem={({ item }) => (
//           // ListingGrid's FlatList is scrollEnabled=false — render cards directly
//           <View />
//         )}
//         ListHeaderComponent={
//           <>
//             {/* Public header */}
//             <View style={s.publicHeader}>
//               <View style={s.publicContent}>
//                 <Text style={s.publicTitle}>{t("marketplace.marketplace")}</Text>
//                 <Text style={s.publicSubtitle}>{t("marketplace.browseListings")}</Text>
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

//             {/* Farmer tabs */}
//             {isAuthenticated && isFarmer && <MarketplaceTabs />}

//             {/* Filters */}
//             <ListingFilters
//               search={search}         onSearchChange={setSearch}
//               sortBy={sortBy}         onSortChange={setSortBy}
//               radius={radiusKm}       onRadiusChange={setRadiusKm}
//               showLocationFilters={false}
//             />

//             {/* Content */}
//             {loading ? (
//               <ListingSkeleton count={4} />
//             ) : !visibleListings.length ? (
//               <ListingEmptyState
//                 title={t("marketplace.noListingsFound")}
//                 subtitle={t("marketplace.trySearchFilters")}
//               />
//             ) : (
//               <>
//                 <ListingGrid
//                   showDistance
//                   listings={visibleListings}
//                   isOwner={false}
//                   onViewDetails={handleViewDetails}
//                   onImageClick={(img) => setSelectedImage(img)}
//                 />
//                 {/* Show all / show less for public */}
//                 {!isAuthenticated && distanceFiltered.length > 8 && (
//                   <TouchableOpacity style={s.viewAllBtn} onPress={() => setShowAll((v) => !v)}>
//                     <Text style={s.viewAllText}>
//                       {showAll ? t("marketplace.showLess") : t("marketplace.viewAll")}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </>
//             )}
//           </>
//         }
//       />

//       <ImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
//     </ScreenShell>
//   );
// }

// const s = StyleSheet.create({
//   listContent:    { padding: spacing[4], paddingBottom: spacing[7], gap: spacing[4] },
//   publicHeader:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[4], flexWrap: "wrap" },
//   publicContent:  { flex: 1 },
//   publicTitle:    { fontSize: 30, fontWeight: "800", color: colors.text },
//   publicSubtitle: { fontSize: 15, fontWeight: "500", color: colors.textMuted, marginTop: 8 },
//   authActions:    { flexDirection: "row", gap: 14 },
//   loginBtn:       { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, borderWidth: 1, borderColor: "#dbe4ee", backgroundColor: "#fff" },
//   loginBtnText:   { fontSize: 14, fontWeight: "700", color: colors.text },
//   signupBtn:      { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, backgroundColor: "#0f8b5f" },
//   signupBtnText:  { fontSize: 14, fontWeight: "700", color: "#fff" },
//   viewAllBtn:     { alignSelf: "center", marginTop: spacing[5], paddingVertical: 16, paddingHorizontal: 28, borderRadius: 18, backgroundColor: colors.primary },
//   viewAllText:    { fontSize: 15, fontWeight: "700", color: "#fff" },
// });


import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenShell       from "../../components/ScreenShell";
import ListingGrid       from "../../components/marketplace/ListingGrid";
import ListingFilters    from "../../components/marketplace/ListingFilters";
import ListingSkeleton   from "../../components/marketplace/ListingSkeleton";
import ListingEmptyState from "../../components/marketplace/ListingEmptyState";
import MarketplaceTabs   from "../../components/marketplace/MarketplaceTabs";
import ImageViewer       from "../../components/ImageViewer";

import { MarketplaceService } from "../../services/marketplaceService";
import { calculateDistance }  from "../../utils/location";
import { getErrorMessage }    from "../../utils/errorHandler";
import { useApp }             from "../../context/AppContext";
import { useAuth }            from "../../context/AuthContext";
import { colors, spacing }    from "../../theme";

export default function MarketplaceScreen() {
  const { t }                         = useTranslation();
  const navigation                    = useNavigation();
  const { pushToast, userLocation }   = useApp();
  const { isFarmer, isAuthenticated } = useAuth();

  const [listings,      setListings]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [sortBy,        setSortBy]        = useState("latest");
  const [radiusKm,      setRadiusKm]      = useState(20);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAll,       setShowAll]       = useState(false);

  function applySorting(data = []) {
    const sorted = [...data];
    if (sortBy === "price-low")  sorted.sort((a, b) => (a.expected_price || 0) - (b.expected_price || 0));
    if (sortBy === "price-high") sorted.sort((a, b) => (b.expected_price || 0) - (a.expected_price || 0));
    if (sortBy === "oldest")     sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === "latest")     sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return sorted;
  }

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = { search };
      if (isAuthenticated && isFarmer) params.exclude_my_listings = true;
      const response = isAuthenticated
        ? await MarketplaceService.getListings(params)
        : await MarketplaceService.getPublicListings(params);
      setListings(applySorting(response?.data || []));
    } catch (error) {
      pushToast(getErrorMessage(error) || t("marketplace.failedToLoad"), "error");
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, isAuthenticated, isFarmer]);

  // ── Refetch on focus (shows new listings after create) ───────────────────
  useFocusEffect(
    useCallback(() => { fetchListings(); }, [search, sortBy])
  );

  const distanceFiltered = listings
    .map((listing) => {
      let distance = null;
      if (userLocation?.latitude && userLocation?.longitude && listing?.latitude && listing?.longitude) {
        distance = calculateDistance(userLocation.latitude, userLocation.longitude, listing.latitude, listing.longitude);
      }
      return { ...listing, distance };
    })
    .filter((l) => l.distance !== null && l.distance <= radiusKm)
    .sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));

  const visibleListings = !isAuthenticated && !showAll ? distanceFiltered.slice(0, 8) : distanceFiltered;

  const handleViewDetails = (listing) => {
    if (listing?.is_locked) {
      pushToast(t("authMessages.loginToViewListing"), "error");
      navigation.navigate("Login");
      return;
    }
    navigation.navigate("ListingDetails", { id: listing.id, from: "marketplace" });
  };

  return (
    <ScreenShell title={t("marketplace.marketplace")} scrollable={true}>
      <View style={s.container}>

        {/* Public header */}
        <View style={s.publicHeader}>
          <View style={s.publicContent}>
            <Text style={s.publicTitle}>{t("marketplace.marketplace")}</Text>
            <Text style={s.publicSubtitle}>{t("marketplace.browseListings")}</Text>
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

        {/* Farmer tabs */}
        {isAuthenticated && isFarmer && <MarketplaceTabs />}

        {/* Filters */}
        <ListingFilters
          search={search}   onSearchChange={setSearch}
          sortBy={sortBy}   onSortChange={setSortBy}
          radius={radiusKm} onRadiusChange={setRadiusKm}
          showLocationFilters={false}
        />

        {/* Content */}
        {loading ? (
          <ListingSkeleton count={4} />
        ) : !visibleListings.length ? (
          <ListingEmptyState
            title={t("marketplace.noListingsFound")}
            subtitle={t("marketplace.trySearchFilters")}
          />
        ) : (
          <>
            <ListingGrid
              showDistance
              listings={visibleListings}
              isOwner={false}
              onViewDetails={handleViewDetails}
              onImageClick={(img) => setSelectedImage(img)}
            />
            {!isAuthenticated && distanceFiltered.length > 8 && (
              <TouchableOpacity style={s.viewAllBtn} onPress={() => setShowAll((v) => !v)}>
                <Text style={s.viewAllText}>
                  {showAll ? t("marketplace.showLess") : t("marketplace.viewAll")}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

      </View>

      <ImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  container:      { paddingBottom: spacing[7], gap: spacing[4] },
  publicHeader:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[4], flexWrap: "wrap" },
  publicContent:  { flex: 1 },
  publicTitle:    { fontSize: 30, fontWeight: "800", color: colors.text },
  publicSubtitle: { fontSize: 15, fontWeight: "500", color: colors.textMuted, marginTop: 8 },
  authActions:    { flexDirection: "row", gap: 14 },
  loginBtn:       { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, borderWidth: 1, borderColor: "#dbe4ee", backgroundColor: "#fff" },
  loginBtnText:   { fontSize: 14, fontWeight: "700", color: colors.text },
  signupBtn:      { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, backgroundColor: "#0f8b5f" },
  signupBtnText:  { fontSize: 14, fontWeight: "700", color: "#fff" },
  viewAllBtn:     { alignSelf: "center", marginTop: spacing[5], paddingVertical: 16, paddingHorizontal: 28, borderRadius: 18, backgroundColor: colors.primary },
  viewAllText:    { fontSize: 15, fontWeight: "700", color: "#fff" },
});