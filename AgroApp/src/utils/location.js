import * as ExpoLocation from "expo-location";

// ─────────────────────────────────────────────────────────────────────────────
// REPLACES web src/utils/location.js
// navigator.geolocation  →  expo-location
// All function signatures are identical so nothing else in the app needs changes
// ─────────────────────────────────────────────────────────────────────────────

// ── getCurrentLocation ────────────────────────────────────────────────────────
// Web: navigator.geolocation.getCurrentPosition(resolve, reject, options)
// RN:  ExpoLocation.requestForegroundPermissionsAsync() + getCurrentPositionAsync()
export async function getCurrentLocation() {
  const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Location permission denied");
  }
  const position = await ExpoLocation.getCurrentPositionAsync({
    accuracy: ExpoLocation.Accuracy.High,     // same as enableHighAccuracy: true
    maximumAge: 0,                             // same as web
    timeout: 10000,
  });
  return {
    latitude:  position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

// ── calculateDistance ─────────────────────────────────────────────────────────
// Pure math — copied exactly from web, no changes needed
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}
