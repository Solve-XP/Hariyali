// ─────────────────────────────────────────────────────────────────────────────
// REPLACES web src/utils/geocoding.js
// Web used: fetch() to Geoapify API with import.meta.env.VITE_GEOAPIFY_KEY
// RN uses:  same Geoapify REST API via fetch() — works fine in React Native
//           env var is now from app.json "extra" or a .env with expo constants
// ─────────────────────────────────────────────────────────────────────────────
import Constants from "expo-constants";

// Set your Geoapify key in app.json under expo.extra.geoapifyKey
// OR hardcode it here temporarily for development
const GEOAPIFY_KEY =
  Constants.expoConfig?.extra?.geoapifyKey || "YOUR_GEOAPIFY_KEY_HERE";

// ── reverseGeocode ────────────────────────────────────────────────────────────
// Identical function signature and return shape as web version
// fetch() works the same in React Native — no change needed here
export async function reverseGeocode(latitude, longitude) {
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_KEY}`
  );
  const data = await response.json();
  const location = data?.features?.[0]?.properties;

  return {
    village:
      location?.village ||
      location?.suburb  ||
      location?.hamlet  ||
      location?.town    ||
      location?.city    ||
      location?.municipality ||
      location?.county  ||
      "",
    taluka:   location?.county         || "",
    district: location?.state_district || "",
    state:    location?.state          || "",
    pincode:  location?.postcode       || "",
  };
}
