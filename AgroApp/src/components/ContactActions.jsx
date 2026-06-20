// // CONVERTED FROM: ContactActions.jsx + ContactActions.css
// // Web: window.open("tel:...") / window.open("https://wa.me/...")
// // RN:  Linking.openURL() — same result, works on Android
// import React from "react";
// import { View, StyleSheet, Linking } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useTranslation } from "react-i18next";
// import Button from "./Button";
// import { useAuth } from "../context/AuthContext";
// import { useApp } from "../context/AppContext";
// import { spacing } from "../theme";

// export default function ContactActions({
//   phone,
//   latitude,
//   longitude,
//   isLocked = false,
// }) {
//   const { t }             = useTranslation();
//   const navigation        = useNavigation();
//   const { pushToast }     = useApp();
//   const { isAuthenticated } = useAuth();

//   // ── Auth guard — same logic as web ──────────────────────────────────────────
//   const handleProtectedAction = (actionType = "details") => {
//     if (!isAuthenticated || isLocked) {
//       const msgs = {
//         call:       t("authMessages.loginToCall"),
//         whatsapp:   t("authMessages.loginToWhatsapp"),
//         directions: t("authMessages.loginToDirections"),
//         details:    t("authMessages.loginToViewDetails"),
//       };
//       pushToast(msgs[actionType] || "Login required", "error");
//       navigation.navigate("Login");
//       return false;
//     }
//     return true;
//   };

//   // ── Call — replaces window.open("tel:...", "_self") ────────────────────────
//   const handleCall = () => {
//     if (!handleProtectedAction("call")) return;
//     Linking.openURL(`tel:${phone}`);
//   };

//   // ── WhatsApp — replaces window.open("https://wa.me/91...") ─────────────────
//   const handleWhatsApp = () => {
//     if (!handleProtectedAction("whatsapp")) return;
//     const clean = String(phone).replace(/\D/g, "");
//     Linking.openURL(`https://wa.me/91${clean}`);
//   };

//   // ── Directions — replaces window.open(maps url, "_blank") ──────────────────
//   const handleDirections = () => {
//     if (!handleProtectedAction("directions")) return;
//     if (!latitude || !longitude) {
//       pushToast(t("contact.locationUnavailable"), "error");
//       return;
//     }
//     const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
//     Linking.openURL(url);
//   };

//   return (
//     <View style={s.row}>
//       <Button variant="secondary" onPress={handleCall}       style={s.btn}>{t("contact.call")}</Button>
//       <Button variant="accent"    onPress={handleDirections} style={s.btn}>{t("contact.directions")}</Button>
//       <Button variant="success"   onPress={handleWhatsApp}   style={s.btn}>{t("contact.whatsapp")}</Button>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   row: {
//     flexDirection: "row",
//     alignItems:    "center",
//     gap:           spacing[2],
//     width:         "100%",
//   },
//   btn: { flex: 1 },
// });
// CONVERTED FROM: ContactActions.jsx + ContactActions.css
// Web: window.open("tel:...") / window.open("https://wa.me/...")
// RN:  Linking.openURL() — same result, works on Android

// CONVERTED FROM: ContactActions.jsx + ContactActions.css
// Web: window.open("tel:...") / window.open("https://wa.me/...")
// RN:  Linking.openURL() — same result, works on Android
import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { spacing } from "../theme";

export default function ContactActions({
  phone,
  latitude,
  longitude,
  isLocked = false,
}) {
  const { t }               = useTranslation();
  const navigation          = useNavigation();
  const { pushToast }       = useApp();
  const { isAuthenticated } = useAuth();

  // ── Auth guard ──────────────────────────────────────────────────────────────
  const handleProtectedAction = (actionType = "details") => {
    if (!isAuthenticated || isLocked) {
      const msgs = {
        call:       t("authMessages.loginToCall"),
        whatsapp:   t("authMessages.loginToWhatsapp"),
        directions: t("authMessages.loginToDirections"),
        details:    t("authMessages.loginToViewDetails"),
      };
      // ✅ Single navigate call only — push was causing double navigation
      navigation.navigate("Login", { toastMessage: msgs[actionType] });
      return false;
    }
    return true;
  };

  // ── Call — replaces window.open("tel:...", "_self") ────────────────────────
  const handleCall = () => {
    if (!handleProtectedAction("call")) return;
    Linking.openURL(`tel:${phone}`);
  };

  // ── WhatsApp — replaces window.open("https://wa.me/91...") ─────────────────
  const handleWhatsApp = () => {
    if (!handleProtectedAction("whatsapp")) return;
    const clean = String(phone).replace(/\D/g, "");
    Linking.openURL(`https://wa.me/91${clean}`);
  };

  // ── Directions — replaces window.open(maps url, "_blank") ──────────────────
  const handleDirections = () => {
    if (!handleProtectedAction("directions")) return;
    if (!latitude || !longitude) {
      pushToast(t("contact.locationUnavailable"), "error");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={s.row}>
      <Button variant="secondary" onPress={handleCall}       style={s.btn}>{t("contact.call")}</Button>
      <Button variant="accent"    onPress={handleDirections} style={s.btn}>{t("contact.directions")}</Button>
      <Button variant="success"   onPress={handleWhatsApp}   style={s.btn}>{t("contact.whatsapp")}</Button>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing[2],
    width:         "100%",
  },
  btn: { flex: 1 },
});