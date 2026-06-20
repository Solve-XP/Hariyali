// CONVERTED FROM: MapPickerModal.jsx + MapPickerModal.css
//
// Web used: react-leaflet (browser-only, NOT available in RN)
// RN uses:  react-native-maps (MapView) — same visual result, same props interface
//
// NOTE: Install react-native-maps:
//   npx expo install react-native-maps
//
// Key changes:
//   MapContainer + TileLayer   → <MapView provider={PROVIDER_GOOGLE}>
//   Marker draggable           → <Marker draggable onDragEnd>
//   map.flyTo()                → mapRef.current.animateToRegion()
//   fetch Geoapify autocomplete → unchanged (same REST API)
//   window.open                → not needed (no external map link here)
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View, Text, TextInput, TouchableOpacity, FlatList,
//   ActivityIndicator, Modal, StyleSheet, ScrollView,
// } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import Constants from "expo-constants";
// import Button from "./Button";
// import { getCurrentLocation } from "../utils/location";
// import { reverseGeocode } from "../utils/geocoding";
// import { colors, radius, fontSize, spacing, shadows } from "../theme";

// const GEOAPIFY_KEY = Constants.expoConfig?.extra?.geoapifyKey || "";
// const DEFAULT_LAT  = 18.5204;
// const DEFAULT_LNG  = 73.8567;

// export default function MapPickerModal({ open, onClose, latitude, longitude, onConfirm }) {
//   const [region, setRegion] = useState({
//     latitude:       latitude  || DEFAULT_LAT,
//     longitude:      longitude || DEFAULT_LNG,
//     latitudeDelta:  0.02,
//     longitudeDelta: 0.02,
//   });
//   const [markerCoords, setMarkerCoords] = useState({
//     latitude:  latitude  || DEFAULT_LAT,
//     longitude: longitude || DEFAULT_LNG,
//   });
//   const [search,          setSearch]          = useState("");
//   const [results,         setResults]         = useState([]);
//   const [loadingSearch,   setLoadingSearch]   = useState(false);
//   const [loadingLocation, setLoadingLocation] = useState(false);
//   const [error,           setError]           = useState("");
//   const [showResults,     setShowResults]     = useState(false);

//   const mapRef      = useRef(null);
//   const debounceRef = useRef(null);

//   useEffect(() => {
//     setMarkerCoords({ latitude: latitude || DEFAULT_LAT, longitude: longitude || DEFAULT_LNG });
//     setRegion((r) => ({ ...r, latitude: latitude || DEFAULT_LAT, longitude: longitude || DEFAULT_LNG }));
//   }, [latitude, longitude]);

//   useEffect(() => () => clearTimeout(debounceRef.current), []);

//   // ── Search handler ─────────────────────────────────────────────────────────
//   const handleSearchChange = (query) => {
//     setSearch(query);
//     setError("");
//     clearTimeout(debounceRef.current);
//     if (!query || query.trim().length < 3) { setResults([]); setShowResults(false); return; }
//     debounceRef.current = setTimeout(() => fetchResults(query.trim()), 400);
//   };

//   const fetchResults = async (query) => {
//     if (!GEOAPIFY_KEY) { setError("Set geoapifyKey in app.json extra."); return; }
//     try {
//       setLoadingSearch(true); setResults([]);
//       const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_KEY}&filter=countrycode:in&lang=en&limit=7`;
//       const res  = await fetch(url);
//       const data = await res.json();
//       const feats = data?.features ?? [];
//       setResults(feats);
//       setShowResults(true);
//       if (!feats.length) setError("No results found.");
//     } catch { setError("Search failed."); }
//     finally { setLoadingSearch(false); }
//   };

//   const pickResult = (item) => {
//     const [lng, lat] = item.geometry.coordinates;
//     const newCoords  = { latitude: lat, longitude: lng };
//     setMarkerCoords(newCoords);
//     setRegion((r) => ({ ...r, ...newCoords }));
//     mapRef.current?.animateToRegion({ ...newCoords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 800);
//     setSearch(item.properties.formatted);
//     setResults([]); setShowResults(false); setError("");
//   };

//   // ── Current location ───────────────────────────────────────────────────────
//   const handleUseCurrentLocation = async () => {
//     if (loadingLocation) return;
//     try {
//       setLoadingLocation(true);
//       const loc  = await getCurrentLocation();
//       const coords = { latitude: loc.latitude, longitude: loc.longitude };
//       setMarkerCoords(coords);
//       setRegion((r) => ({ ...r, ...coords }));
//       mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 800);
//       setSearch("Current Location");
//       setResults([]); setShowResults(false);
//     } catch { setError("Unable to fetch location."); }
//     finally { setLoadingLocation(false); }
//   };

//   // ── Confirm ────────────────────────────────────────────────────────────────
//   const handleConfirm = async () => {
//     const address = await reverseGeocode(markerCoords.latitude, markerCoords.longitude);
//     onConfirm({ latitude: markerCoords.latitude, longitude: markerCoords.longitude, ...address });
//     onClose();
//   };

//   return (
//     <Modal visible={!!open} animationType="slide" onRequestClose={onClose}>
//       <View style={s.container}>

//         {/* Header */}
//         <View style={s.header}>
//           <Text style={s.headerTitle}>Select Exact Location</Text>
//           <TouchableOpacity style={s.closeBtn} onPress={onClose}>
//             <Text style={s.closeX}>✕</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search */}
//         <View style={s.searchWrap}>
//           <View style={s.searchRow}>
//             <Text style={s.searchIcon}>🔍</Text>
//             <TextInput
//               style={s.searchInput}
//               value={search}
//               onChangeText={handleSearchChange}
//               placeholder="Search village, taluka, district..."
//               placeholderTextColor={colors.textFaint}
//               autoCapitalize="none"
//               autoCorrect={false}
//             />
//             {loadingSearch && <ActivityIndicator size="small" color={colors.primary} />}
//             {search && !loadingSearch && (
//               <TouchableOpacity onPress={() => { setSearch(""); setResults([]); setShowResults(false); }}>
//                 <Text style={s.clearBtn}>✕</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//           {error ? <Text style={s.errorText}>{error}</Text> : null}

//           {showResults && results.length > 0 && (
//             <FlatList
//               data={results}
//               keyExtractor={(item, i) => item.properties.place_id ?? String(i)}
//               style={s.resultsList}
//               keyboardShouldPersistTaps="handled"
//               renderItem={({ item }) => {
//                 const p       = item.properties;
//                 const primary = p.village || p.town || p.city || p.county || p.name || p.formatted;
//                 return (
//                   <TouchableOpacity style={s.resultItem} onPress={() => pickResult(item)}>
//                     <Text>📍</Text>
//                     <View style={s.resultText}>
//                       <Text style={s.resultPrimary}>{primary}</Text>
//                       <Text style={s.resultSecondary} numberOfLines={1}>{p.formatted}</Text>
//                     </View>
//                   </TouchableOpacity>
//                 );
//               }}
//             />
//           )}
//         </View>

//         <Text style={s.hint}>Tap on the map or drag the pin to adjust</Text>

//         {/* Map */}
//         <MapView
//           ref={mapRef}
//           style={s.map}
//           provider={PROVIDER_GOOGLE}
//           initialRegion={region}
//           onPress={(e) => {
//             const { latitude, longitude } = e.nativeEvent.coordinate;
//             setMarkerCoords({ latitude, longitude });
//           }}
//         >
//           <Marker
//             coordinate={markerCoords}
//             draggable
//             onDragEnd={(e) => setMarkerCoords(e.nativeEvent.coordinate)}
//           />
//         </MapView>

//         {/* Footer */}
//         <View style={s.footer}>
//           <View style={s.coordsRow}>
//             <View style={s.coordItem}>
//               <Text style={s.coordLabel}>Latitude</Text>
//               <Text style={s.coordValue}>{markerCoords.latitude?.toFixed(6)}</Text>
//             </View>
//             <View style={s.coordDivider} />
//             <View style={s.coordItem}>
//               <Text style={s.coordLabel}>Longitude</Text>
//               <Text style={s.coordValue}>{markerCoords.longitude?.toFixed(6)}</Text>
//             </View>
//           </View>
//           <View style={s.actions}>
//             <Button variant="secondary" onPress={handleUseCurrentLocation} loading={loadingLocation} style={s.actionBtn}>
//               📍 Use Current Location
//             </Button>
//             <Button onPress={handleConfirm} style={s.actionBtn}>
//               Confirm Location
//             </Button>
//           </View>
//         </View>

//       </View>
//     </Modal>
//   );
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.surface },
//   header: {
//     flexDirection: "row", alignItems: "center", justifyContent: "space-between",
//     padding: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.border,
//   },
//   headerTitle: { fontSize: 17, fontWeight: "600", color: colors.text },
//   closeBtn:    { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
//   closeX:      { fontSize: 13, color: colors.textMuted },
//   searchWrap:  { padding: spacing[3], paddingBottom: 0, zIndex: 100 },
//   searchRow: {
//     flexDirection: "row", alignItems: "center", gap: spacing[2],
//     backgroundColor: colors.surface2, borderWidth: 1.5, borderColor: colors.border,
//     borderRadius: radius.lg, paddingHorizontal: spacing[3],
//   },
//   searchIcon:  { fontSize: 15, opacity: 0.4 },
//   searchInput: { flex: 1, paddingVertical: 11, fontSize: fontSize.sm, color: colors.text },
//   clearBtn:    { fontSize: 13, color: colors.textMuted, padding: 4 },
//   errorText:   { fontSize: 13, color: colors.error, marginTop: spacing[2] },
//   resultsList: { borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, marginTop: spacing[2], maxHeight: 200, backgroundColor: colors.surface, ...shadows.md },
//   resultItem:  { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.divider },
//   resultText:  { flex: 1, gap: 2 },
//   resultPrimary:   { fontSize: fontSize.sm, fontWeight: "500", color: colors.text },
//   resultSecondary: { fontSize: 12, color: colors.textMuted },
//   hint: { fontSize: 12, color: colors.textFaint, paddingHorizontal: spacing[5], paddingVertical: 7, backgroundColor: colors.surface2, borderTopWidth: 1, borderTopColor: colors.border },
//   map:  { flex: 1 },
//   footer: {
//     borderTopWidth: 1, borderTopColor: colors.border,
//     backgroundColor: colors.surface2, padding: spacing[4], gap: spacing[3],
//   },
//   coordsRow:    { flexDirection: "row", alignItems: "center", gap: spacing[4] },
//   coordItem:    { gap: 2 },
//   coordLabel:   { fontSize: 11, fontWeight: "600", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.4 },
//   coordValue:   { fontSize: 13, fontWeight: "500", color: colors.text },
//   coordDivider: { width: 1, height: 28, backgroundColor: colors.border },
//   actions:      { flexDirection: "row", gap: spacing[2] },
//   actionBtn:    { flex: 1 },
// });




// src/components/MapPickerModal.jsx
// FIXES:
// 1. Removed PROVIDER_GOOGLE → uses default OSM provider (no API key needed, no black screen)
// 2. Fixed reverseGeocode onConfirm → all address fields auto-fill correctly
// 3. SafeAreaView replaced with StatusBar.currentHeight

// FIXED: MapPickerModal.jsx
// - Removed SafeAreaView (deprecated) → use View with paddingTop
// - Fixed onConfirm to properly pass address fields back
// - Added PROVIDER_GOOGLE explicitly
// - Fixed map initialRegion update when props change

// import React, { useState, useEffect, useRef } from "react";

// import { WebView } from "react-native-webview";

// import {
//   View, Text, TextInput, TouchableOpacity, FlatList,
//   ActivityIndicator, Modal, StyleSheet, StatusBar,
// } from "react-native";

// import MapView, { Marker, UrlTile } from "react-native-maps";

// import Constants from "expo-constants";
// import Button from "./Button";
// import { getCurrentLocation } from "../utils/location";
// import { reverseGeocode }     from "../utils/geocoding";
// import { colors, radius, fontSize, spacing, shadows } from "../theme";

// const GEOAPIFY_KEY = Constants.expoConfig?.extra?.geoapifyKey || "";
// const DEFAULT_LAT  = 18.5204;
// const DEFAULT_LNG  = 73.8567;

// export default function MapPickerModal({ open, onClose, latitude, longitude, onConfirm }) {
//   const [region, setRegion] = useState({
//     latitude:       latitude  || DEFAULT_LAT,
//     longitude:      longitude || DEFAULT_LNG,
//     latitudeDelta:  0.02,
//     longitudeDelta: 0.02,
//   });
//   const [markerCoords, setMarkerCoords] = useState({
//     latitude:  latitude  || DEFAULT_LAT,
//     longitude: longitude || DEFAULT_LNG,
//   });
//   const [search,          setSearch]          = useState("");
//   const [results,         setResults]         = useState([]);
//   const [loadingSearch,   setLoadingSearch]   = useState(false);
//   const [loadingLocation, setLoadingLocation] = useState(false);
//   const [error,           setError]           = useState("");
//   const [showResults,     setShowResults]     = useState(false);

//   const mapRef      = useRef(null);
//   const debounceRef = useRef(null);

//   // Update marker when props change
//   useEffect(() => {
//     if (latitude && longitude) {
//       setMarkerCoords({ latitude, longitude });
//       setRegion((r) => ({ ...r, latitude, longitude }));
//     }
//   }, [latitude, longitude]);

//   useEffect(() => () => clearTimeout(debounceRef.current), []);

//   // Search
//   const handleSearchChange = (query) => {
//     setSearch(query);
//     setError("");
//     clearTimeout(debounceRef.current);
//     if (!query || query.trim().length < 3) { setResults([]); setShowResults(false); return; }
//     debounceRef.current = setTimeout(() => fetchResults(query.trim()), 400);
//   };

//   const fetchResults = async (query) => {
//     if (!GEOAPIFY_KEY) { setError("Set geoapifyKey in app.json extra."); return; }
//     try {
//       setLoadingSearch(true); setResults([]);
//       const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_KEY}&filter=countrycode:in&lang=en&limit=7`;
//       const res  = await fetch(url);
//       const data = await res.json();
//       const feats = data?.features ?? [];
//       setResults(feats);
//       setShowResults(true);
//       if (!feats.length) setError("No results found.");
//     } catch { setError("Search failed."); }
//     finally { setLoadingSearch(false); }
//   };

//   const pickResult = (item) => {
//     const [lng, lat] = item.geometry.coordinates;
//     const newCoords  = { latitude: lat, longitude: lng };
//     setMarkerCoords(newCoords);
//     const newRegion = { ...newCoords, latitudeDelta: 0.01, longitudeDelta: 0.01 };
//     setRegion(newRegion);
//     mapRef.current?.animateToRegion(newRegion, 800);
//     setSearch(item.properties.formatted);
//     setResults([]); setShowResults(false); setError("");
//   };

//   // Current location
//   const handleUseCurrentLocation = async () => {
//     if (loadingLocation) return;
//     try {
//       setLoadingLocation(true);
//       const loc    = await getCurrentLocation();
//       const coords = { latitude: loc.latitude, longitude: loc.longitude };
//       setMarkerCoords(coords);
//       const newRegion = { ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 };
//       setRegion(newRegion);
//       mapRef.current?.animateToRegion(newRegion, 800);
//       setSearch("Current Location");
//       setResults([]); setShowResults(false);
//     } catch { setError("Unable to fetch location."); }
//     finally { setLoadingLocation(false); }
//   };

//   // Confirm — calls reverseGeocode and passes ALL address fields back
//   const handleConfirm = async () => {
//     try {
//       const address = await reverseGeocode(markerCoords.latitude, markerCoords.longitude);
//       onConfirm({
//         latitude:  markerCoords.latitude,
//         longitude: markerCoords.longitude,
//         village:   address.village  || "",
//         taluka:    address.taluka   || "",
//         district:  address.district || "",
//         state:     address.state    || "",
//         pincode:   address.pincode  || "",
//       });
//       onClose();
//     } catch {
//       // Still confirm with just coords if reverse geocode fails
//       onConfirm({
//         latitude:  markerCoords.latitude,
//         longitude: markerCoords.longitude,
//         village: "", taluka: "", district: "", state: "", pincode: "",
//       });
//       onClose();
//     }
//   };

//   return (
//     <Modal visible={!!open} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
//       <View style={s.container}>

//         {/* Header — replaced SafeAreaView with paddingTop */}
//         <View style={s.header}>
//           <Text style={s.headerTitle}>Select Exact Location</Text>
//           <TouchableOpacity style={s.closeBtn} onPress={onClose}>
//             <Text style={s.closeX}>✕</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search */}
//         <View style={s.searchWrap}>
//           <View style={s.searchRow}>
//             <Text style={s.searchIcon}>🔍</Text>
//             <TextInput
//               style={s.searchInput}
//               value={search}
//               onChangeText={handleSearchChange}
//               placeholder="Search village, taluka, district..."
//               placeholderTextColor={colors.textFaint}
//               autoCapitalize="none"
//               autoCorrect={false}
//             />
//             {loadingSearch && <ActivityIndicator size="small" color={colors.primary} />}
//             {!!search && !loadingSearch && (
//               <TouchableOpacity onPress={() => { setSearch(""); setResults([]); setShowResults(false); }}>
//                 <Text style={s.clearBtn}>✕</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//           {!!error && <Text style={s.errorText}>{error}</Text>}
//           {showResults && results.length > 0 && (
//             <FlatList
//               data={results}
//               keyExtractor={(item, i) => item.properties.place_id ?? String(i)}
//               style={s.resultsList}
//               keyboardShouldPersistTaps="handled"
//               renderItem={({ item }) => {
//                 const p       = item.properties;
//                 const primary = p.village || p.town || p.city || p.county || p.name || p.formatted;
//                 return (
//                   <TouchableOpacity style={s.resultItem} onPress={() => pickResult(item)}>
//                     <Text>📍</Text>
//                     <View style={s.resultText}>
//                       <Text style={s.resultPrimary}>{primary}</Text>
//                       <Text style={s.resultSecondary} numberOfLines={1}>{p.formatted}</Text>
//                     </View>
//                   </TouchableOpacity>
//                 );
//               }}
//             />
//           )}
//         </View>

//         <Text style={s.hint}>Tap on the map or drag the pin to adjust</Text>

//         {/* Map — PROVIDER_GOOGLE required for Android */}
//         <MapView
//           ref={mapRef}
//           style={s.map}
//           // ← Remove provider={PROVIDER_GOOGLE}
//           initialRegion={region}
//           onRegionChangeComplete={(r) => setRegion(r)}
//           onPress={(e) => {
//             const { latitude, longitude } = e.nativeEvent.coordinate;
//             setMarkerCoords({ latitude, longitude });
//           }}
//         >
//           {/* Free OpenStreetMap tiles */}
//           <UrlTile
//             urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
//             maximumZ={19}
//             flipY={false}
//           />
//           <Marker
//             coordinate={markerCoords}
//             draggable
//             onDragEnd={(e) => setMarkerCoords(e.nativeEvent.coordinate)}
//           />
//         </MapView>

//         {/* Footer */}
//         <View style={s.footer}>
//           <View style={s.coordsRow}>
//             <View style={s.coordItem}>
//               <Text style={s.coordLabel}>Latitude</Text>
//               <Text style={s.coordValue}>{markerCoords.latitude?.toFixed(6)}</Text>
//             </View>
//             <View style={s.coordDivider} />
//             <View style={s.coordItem}>
//               <Text style={s.coordLabel}>Longitude</Text>
//               <Text style={s.coordValue}>{markerCoords.longitude?.toFixed(6)}</Text>
//             </View>
//           </View>
//           <View style={s.actions}>
//             <Button variant="secondary" onPress={handleUseCurrentLocation} loading={loadingLocation} style={s.actionBtn}>
//               📍 Use Current Location
//             </Button>
//             <Button onPress={handleConfirm} style={s.actionBtn}>
//               Confirm Location
//             </Button>
//           </View>
//         </View>

//       </View>
//     </Modal>
//   );
// }

// const s = StyleSheet.create({
//   container: {
//     flex:            1,
//     backgroundColor: colors.surface,
//     paddingTop:      StatusBar.currentHeight || 0,  // replaces SafeAreaView
//   },
//   header: {
//     flexDirection: "row", alignItems: "center", justifyContent: "space-between",
//     padding: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.border,
//   },
//   headerTitle: { fontSize: 17, fontWeight: "600", color: colors.text },
//   closeBtn:    { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
//   closeX:      { fontSize: 13, color: colors.textMuted },
//   searchWrap:  { padding: spacing[3], paddingBottom: 0, zIndex: 100, backgroundColor: colors.surface },
//   searchRow: {
//     flexDirection: "row", alignItems: "center", gap: spacing[2],
//     backgroundColor: colors.surface2, borderWidth: 1.5, borderColor: colors.border,
//     borderRadius: radius.lg, paddingHorizontal: spacing[3],
//   },
//   searchIcon:  { fontSize: 15, opacity: 0.4 },
//   searchInput: { flex: 1, paddingVertical: 11, fontSize: fontSize.sm, color: colors.text },
//   clearBtn:    { fontSize: 13, color: colors.textMuted, padding: 4 },
//   errorText:   { fontSize: 13, color: colors.error, marginTop: spacing[2] },
//   resultsList: {
//     maxHeight: 200, marginTop: spacing[2],
//     borderWidth: 1, borderColor: colors.border,
//     borderRadius: radius.lg, backgroundColor: colors.surface,
//     ...shadows.md,
//   },
//   resultItem:     { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.divider },
//   resultText:     { flex: 1, gap: 2 },
//   resultPrimary:  { fontSize: fontSize.sm, fontWeight: "500", color: colors.text },
//   resultSecondary:{ fontSize: 12, color: colors.textMuted },
//   hint: { fontSize: 12, color: colors.textFaint, paddingHorizontal: spacing[5], paddingVertical: 7, backgroundColor: colors.surface2, borderTopWidth: 1, borderTopColor: colors.border },
//   map:  { flex: 1 },
//   footer: {
//     borderTopWidth: 1, borderTopColor: colors.border,
//     backgroundColor: colors.surface, padding: spacing[4], gap: spacing[3],
//   },
//   coordsRow:    { flexDirection: "row", alignItems: "center", gap: spacing[4] },
//   coordItem:    { gap: 2 },
//   coordLabel:   { fontSize: 11, fontWeight: "600", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.4 },
//   coordValue:   { fontSize: 13, fontWeight: "500", color: colors.text },
//   coordDivider: { width: 1, height: 28, backgroundColor: colors.border },
//   actions:      { flexDirection: "row", gap: spacing[2] },
//   actionBtn:    { flex: 1 },
// });

import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  ActivityIndicator, Modal, StyleSheet, StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import Button from "./Button";
import { getCurrentLocation } from "../utils/location";
import { reverseGeocode } from "../utils/geocoding";
import { colors, radius, fontSize, spacing, shadows } from "../theme";

const GEOAPIFY_KEY = Constants.expoConfig?.extra?.geoapifyKey || "";
const DEFAULT_LAT  = 18.5204;
const DEFAULT_LNG  = 73.8567;

// ── Leaflet HTML (injected into WebView) ─────────────────────────────────────
function getLeafletHTML(lat, lng) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true }).setView([${lat}, ${lng}], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    var marker = L.marker([${lat}, ${lng}], { draggable: true }).addTo(map);

    function sendCoords(lat, lng) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng }));
    }

    marker.on('dragend', function() {
      var pos = marker.getLatLng();
      sendCoords(pos.lat, pos.lng);
    });

    map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      sendCoords(e.latlng.lat, e.latlng.lng);
    });

    // Listen for flyTo commands from React Native
    document.addEventListener('message', function(e) {
      var data = JSON.parse(e.data);
      if (data.type === 'flyTo') {
        map.flyTo([data.lat, data.lng], 15, { animate: true, duration: 0.8 });
        marker.setLatLng([data.lat, data.lng]);
      }
    });
    window.addEventListener('message', function(e) {
      var data = JSON.parse(e.data);
      if (data.type === 'flyTo') {
        map.flyTo([data.lat, data.lng], 15, { animate: true, duration: 0.8 });
        marker.setLatLng([data.lat, data.lng]);
      }
    });
  </script>
</body>
</html>
`;
}

export default function MapPickerModal({ open, onClose, latitude, longitude, onConfirm }) {
  const [markerCoords, setMarkerCoords] = useState({
    latitude:  latitude  || DEFAULT_LAT,
    longitude: longitude || DEFAULT_LNG,
  });
  const [search,          setSearch]          = useState("");
  const [results,         setResults]         = useState([]);
  const [loadingSearch,   setLoadingSearch]   = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error,           setError]           = useState("");
  const [showResults,     setShowResults]     = useState(false);

  const webViewRef  = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (latitude && longitude) {
      setMarkerCoords({ latitude, longitude });
      flyTo(latitude, longitude);
    }
  }, [latitude, longitude]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // Send flyTo command to Leaflet inside WebView
  const flyTo = (lat, lng) => {
    webViewRef.current?.postMessage(JSON.stringify({ type: "flyTo", lat, lng }));
  };

  // Search
  const handleSearchChange = (query) => {
    setSearch(query);
    setError("");
    clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 3) { setResults([]); setShowResults(false); return; }
    debounceRef.current = setTimeout(() => fetchResults(query.trim()), 400);
  };

  const fetchResults = async (query) => {
    if (!GEOAPIFY_KEY) { setError("Set geoapifyKey in app.json extra."); return; }
    try {
      setLoadingSearch(true); setResults([]);
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_KEY}&filter=countrycode:in&lang=en&limit=7`;
      const res  = await fetch(url);
      const data = await res.json();
      const feats = data?.features ?? [];
      setResults(feats);
      setShowResults(true);
      if (!feats.length) setError("No results found.");
    } catch { setError("Search failed."); }
    finally { setLoadingSearch(false); }
  };

  const pickResult = (item) => {
    const [lng, lat] = item.geometry.coordinates;
    setMarkerCoords({ latitude: lat, longitude: lng });
    flyTo(lat, lng);
    setSearch(item.properties.formatted);
    setResults([]); setShowResults(false); setError("");
  };

  // Current location
  const handleUseCurrentLocation = async () => {
    if (loadingLocation) return;
    try {
      setLoadingLocation(true);
      const loc = await getCurrentLocation();
      setMarkerCoords({ latitude: loc.latitude, longitude: loc.longitude });
      flyTo(loc.latitude, loc.longitude);
      setSearch("Current Location");
      setResults([]); setShowResults(false);
    } catch { setError("Unable to fetch location."); }
    finally { setLoadingLocation(false); }
  };

  // Confirm
  const handleConfirm = async () => {
    try {
      const address = await reverseGeocode(markerCoords.latitude, markerCoords.longitude);
      onConfirm({
        latitude:  markerCoords.latitude,
        longitude: markerCoords.longitude,
        village:   address.village  || "",
        taluka:    address.taluka   || "",
        district:  address.district || "",
        state:     address.state    || "",
        pincode:   address.pincode  || "",
      });
      onClose();
    } catch {
      onConfirm({ latitude: markerCoords.latitude, longitude: markerCoords.longitude, village: "", taluka: "", district: "", state: "", pincode: "" });
      onClose();
    }
  };

  return (
    <Modal visible={!!open} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={s.container}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Select Exact Location</Text>
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Text style={s.closeX}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={s.searchWrap}>
          <View style={s.searchRow}>
            <Text style={s.searchIcon}>🔍</Text>
            <TextInput
              style={s.searchInput}
              value={search}
              onChangeText={handleSearchChange}
              placeholder="Search village, taluka, district..."
              placeholderTextColor={colors.textFaint}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {loadingSearch && <ActivityIndicator size="small" color={colors.primary} />}
            {!!search && !loadingSearch && (
              <TouchableOpacity onPress={() => { setSearch(""); setResults([]); setShowResults(false); }}>
                <Text style={s.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          {!!error && <Text style={s.errorText}>{error}</Text>}
          {showResults && results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item, i) => item.properties.place_id ?? String(i)}
              style={s.resultsList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const p       = item.properties;
                const primary = p.village || p.town || p.city || p.county || p.name || p.formatted;
                return (
                  <TouchableOpacity style={s.resultItem} onPress={() => pickResult(item)}>
                    <Text>📍</Text>
                    <View style={s.resultText}>
                      <Text style={s.resultPrimary}>{primary}</Text>
                      <Text style={s.resultSecondary} numberOfLines={1}>{p.formatted}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        <Text style={s.hint}>Tap on the map or drag the pin to adjust</Text>

        {/* Leaflet Map in WebView */}
        <WebView
          ref={webViewRef}
          style={s.map}
          source={{ html: getLeafletHTML(markerCoords.latitude, markerCoords.longitude) }}
          onMessage={(e) => {
            const coords = JSON.parse(e.nativeEvent.data);
            setMarkerCoords(coords);
          }}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={["*"]}
        />

        {/* Footer */}
        <View style={s.footer}>
          <View style={s.coordsRow}>
            <View style={s.coordItem}>
              <Text style={s.coordLabel}>Latitude</Text>
              <Text style={s.coordValue}>{markerCoords.latitude?.toFixed(6)}</Text>
            </View>
            <View style={s.coordDivider} />
            <View style={s.coordItem}>
              <Text style={s.coordLabel}>Longitude</Text>
              <Text style={s.coordValue}>{markerCoords.longitude?.toFixed(6)}</Text>
            </View>
          </View>
          <View style={s.actions}>
            <Button variant="secondary" onPress={handleUseCurrentLocation} loading={loadingLocation} style={s.actionBtn}>
              📍 Use Current Location
            </Button>
            <Button onPress={handleConfirm} style={s.actionBtn}>
              Confirm Location
            </Button>
          </View>
        </View>

      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.surface, paddingTop: StatusBar.currentHeight || 0 },
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 17, fontWeight: "600", color: colors.text },
  closeBtn:    { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  closeX:      { fontSize: 13, color: colors.textMuted },
  searchWrap:  { padding: spacing[3], paddingBottom: 0, zIndex: 100, backgroundColor: colors.surface },
  searchRow:   { flexDirection: "row", alignItems: "center", gap: spacing[2], backgroundColor: colors.surface2, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing[3] },
  searchIcon:  { fontSize: 15, opacity: 0.4 },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: fontSize.sm, color: colors.text },
  clearBtn:    { fontSize: 13, color: colors.textMuted, padding: 4 },
  errorText:   { fontSize: 13, color: colors.error, marginTop: spacing[2] },
  resultsList: { maxHeight: 200, marginTop: spacing[2], borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadows.md },
  resultItem:  { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.divider },
  resultText:  { flex: 1, gap: 2 },
  resultPrimary:   { fontSize: fontSize.sm, fontWeight: "500", color: colors.text },
  resultSecondary: { fontSize: 12, color: colors.textMuted },
  hint:   { fontSize: 12, color: colors.textFaint, paddingHorizontal: spacing[5], paddingVertical: 7, backgroundColor: colors.surface2, borderTopWidth: 1, borderTopColor: colors.border },
  map:    { flex: 1 },
  footer: { borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, padding: spacing[4], gap: spacing[3] },
  coordsRow:    { flexDirection: "row", alignItems: "center", gap: spacing[4] },
  coordItem:    { gap: 2 },
  coordLabel:   { fontSize: 11, fontWeight: "600", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.4 },
  coordValue:   { fontSize: 13, fontWeight: "500", color: colors.text },
  coordDivider: { width: 1, height: 28, backgroundColor: colors.border },
  actions:      { flexDirection: "row", gap: spacing[2] },
  actionBtn:    { flex: 1 },
});