// ─────────────────────────────────────────────────────────────────────────────
// CONVERTED FROM: AuthShell.jsx + AuthShell.css
//
// Web layout:                          RN layout:
//   Desktop: bg image + hero left      → Full-screen bg image always
//   Mobile: bg image + bottom sheet   → ImageBackground + bottom sheet card
//   CSS backdrop-filter blur           → BlurView (expo-blur)
//   useNavigate("/marketplace")        → navigation.navigate("PublicMarketplace")
//   lucide-react icons                 → @expo/vector-icons Ionicons
//   i18n.changeLanguage()              → changeAppLanguage() from i18n.js
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  ImageBackground, StyleSheet, Dimensions, KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { SUPPORTED_LANGUAGES, changeAppLanguage } from "../i18n/i18n";
import { colors, spacing, radius, fontSize } from "../theme";

const farmerMobileBg = require("../assets/farmer-mobile.png");

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function AuthShell({ title, subtitle, children, footer }) {
  const { t, i18n } = useTranslation();
  const navigation  = useNavigation();

  // ── Language toggle ────────────────────────────────────────────────────────
  const LangToggle = () => (
    <View style={s.langRow}>
      {SUPPORTED_LANGUAGES.map((l) => {
        const active = i18n.language?.startsWith(l.code);
        return (
          <TouchableOpacity
            key={l.code}
            style={[s.langBtn, active && s.langBtnActive]}
            onPress={() => changeAppLanguage(l.code)}
          >
            <Text style={[s.langBtnText, active && s.langBtnTextActive]}>
              {t(l.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // return (
  //   <ImageBackground source={farmerMobileBg} style={s.shell} resizeMode="cover">

  //     {/* Dark overlay — replaces .auth-shell__overlay rgba(0,0,0,0.22) */}
  //     <View style={s.overlay} />

  //     <SafeAreaView style={s.safeArea} edges={["top"]}>

  //       {/* ── Top bar: logo + name + lang toggle ────────────────────────────── */}
  //       <View style={s.topBar}>
  //         <View style={s.brandRow}>
  //           {/* Logo box */}
  //           <View style={s.logo}>
  //             <Text style={s.logoText}>HY</Text>
  //           </View>
  //           <View style={s.brandText}>
  //             <Text style={s.brandName}>{t("app.name")}</Text>
  //             <Text style={s.brandTagline}>{t("app.tagline")}</Text>
  //           </View>
  //         </View>
  //         <LangToggle />
  //       </View>

  //       {/* ── CTA buttons (Marketplace / Rentals) ─────────────────────────── */}
  //       <View style={s.ctaRow}>
  //         <TouchableOpacity
  //           style={s.ctaBtn}
  //           onPress={() => navigation.navigate("PublicMarketplace")}
  //         >
  //           <Ionicons name="storefront-outline" size={16} color={colors.text} />
  //           <Text style={s.ctaBtnText}>{t("hero.marketplace")}</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={s.ctaBtn}
  //           onPress={() => navigation.navigate("PublicRentals")}
  //         >
  //           <Ionicons name="construct-outline" size={16} color={colors.text} />
  //           <Text style={s.ctaBtnText}>{t("hero.rentals")}</Text>
  //         </TouchableOpacity>
  //       </View>

  //     </SafeAreaView>

  //     {/* ── Bottom sheet card — replaces .auth-card-wrapper (mobile CSS) ──── */}
  //     <View style={s.cardWrapper}>
  //       {/* Drag pill — replaces .auth-card::before CSS pseudo-element */}
  //       <View style={s.dragPill} />

  //       {/* <ScrollView
  //         style={s.cardScroll}
  //         contentContainerStyle={s.cardScrollContent}
  //         keyboardShouldPersistTaps="handled"
  //         showsVerticalScrollIndicator={false}
  //       >
  //         <Text style={s.cardTitle}>{title}</Text>
  //         {subtitle ? <Text style={s.cardSubtitle}>{subtitle}</Text> : null}

  //         <View style={s.cardBody}>{children}</View>

  //         {footer ? <View style={s.cardFooter}>{footer}</View> : null}
  //       </ScrollView> */}
  //       <KeyboardAvoidingView
  //         behavior={Platform.OS === "ios" ? "padding" : "height"}
  //         style={{ flex: 1 }}
  //       >
  //         <ScrollView
  //           style={s.cardScroll}
  //           contentContainerStyle={[s.cardScrollContent, { flexGrow: 1 }]}
  //           keyboardShouldPersistTaps="handled"
  //           showsVerticalScrollIndicator={false}
  //           bounces={false}
  //         >
  //           <Text style={s.cardTitle}>{title}</Text>
  //           {subtitle ? <Text style={s.cardSubtitle}>{subtitle}</Text> : null}
  //           <View style={s.cardBody}>{children}</View>
  //           {footer ? <View style={s.cardFooter}>{footer}</View> : null}
  //         </ScrollView>
  //       </KeyboardAvoidingView>
  //     </View>

  //   </ImageBackground>
  // );
  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ImageBackground source={farmerMobileBg} style={s.shell} resizeMode="cover">

      <View style={s.overlay} />

      <SafeAreaView style={s.safeArea} edges={["top"]}>
        <View style={s.topBar}>
          <View style={s.brandRow}>
            <View style={s.logo}>
              <Text style={s.logoText}>HY</Text>
            </View>
            <View style={s.brandText}>
              <Text style={s.brandName}>{t("app.name")}</Text>
              <Text style={s.brandTagline}>{t("app.tagline")}</Text>
            </View>
          </View>
          <LangToggle />
        </View>

        <View style={s.ctaRow}>
          <TouchableOpacity style={s.ctaBtn} onPress={() => navigation.navigate("PublicMarketplace")}>
            <Ionicons name="storefront-outline" size={16} color={colors.text} />
            <Text style={s.ctaBtnText}>{t("hero.marketplace")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.ctaBtn} onPress={() => navigation.navigate("PublicRentals")}>
            <Ionicons name="construct-outline" size={16} color={colors.text} />
            <Text style={s.ctaBtnText}>{t("hero.rentals")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Card — no longer position:absolute, sits at bottom naturally */}
      <View style={s.cardWrapper}>
        <View style={s.dragPill} />
        <ScrollView
          style={s.cardScroll}
          contentContainerStyle={s.cardScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={s.cardTitle}>{title}</Text>
          {subtitle ? <Text style={s.cardSubtitle}>{subtitle}</Text> : null}
          <View style={s.cardBody}>{children}</View>
          {footer ? <View style={s.cardFooter}>{footer}</View> : null}
        </ScrollView>
      </View>

    </ImageBackground>
  </KeyboardAvoidingView>
);
}

const CARD_MAX_HEIGHT = SCREEN_HEIGHT * 0.78;

const s = StyleSheet.create({
  shell: {
    flex:            1,
    backgroundColor: colors.bg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  safeArea: {
    paddingHorizontal: spacing[4],
    paddingTop:        spacing[2],
  },

  // ── Top bar ────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    marginBottom:   spacing[3],
  },
  brandRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing[3],
    flex:          1,
  },
  logo: {
    width:           46,
    height:          46,
    borderRadius:    13,
    backgroundColor: colors.primary,
    alignItems:      "center",
    justifyContent:  "center",
  },
  logoText: {
    fontSize:   fontSize.lg,
    fontWeight: "700",
    color:      colors.textInverse,
  },
  brandText: { flex: 1 },
  brandName: {
    fontSize:   15,
    fontWeight: "700",
    color:      "#000",
  },
  brandTagline: {
    fontSize: 11,
    color:    "rgba(28,26,26,0.65)",
  },

  // ── Lang toggle ────────────────────────────────────────────────────────────
  langRow: {
    flexDirection:   "row",
    backgroundColor: "rgba(73,68,68,0.2)",
    borderRadius:    radius.pill,
    borderWidth:     1,
    borderColor:     "rgba(255,255,255,0.3)",
    padding:         3,
    gap:             2,
  },
  langBtn: {
    paddingVertical:   5,
    paddingHorizontal: 8,
    borderRadius:      radius.pill,
  },
  langBtnActive: {
    backgroundColor: colors.primary,
  },
  langBtnText: {
    fontSize:   11,
    fontWeight: "600",
    color:      "#fff",
  },
  langBtnTextActive: {
    color: "#fff",
  },

  // ── CTA row ────────────────────────────────────────────────────────────────
  ctaRow: {
    flexDirection: "row",
    gap:           spacing[3],
    marginTop:     spacing[2],
  },
  ctaBtn: {
    flex:            1,
    height:          46,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             spacing[2],
    borderRadius:    radius.xl,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth:     1,
    borderColor:     "rgba(255,255,255,0.32)",
  },
  ctaBtnText: {
    fontSize:   fontSize.xs,
    fontWeight: "600",
    color:      "#000",
  },

  // ── Bottom card ────────────────────────────────────────────────────────────
  cardWrapper: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    maxHeight:       CARD_MAX_HEIGHT,
    backgroundColor: colors.surface,
    borderTopLeftRadius:  28,
    borderTopRightRadius: 28,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: -8 },
    shadowOpacity:   0.15,
    shadowRadius:    16,
    elevation:       16,
  },
  dragPill: {
    width:           38,
    height:          4,
    borderRadius:    radius.pill,
    backgroundColor: colors.borderStrong,
    alignSelf:       "center",
    marginTop:       10,
    marginBottom:    18,
  },
  cardScroll: {
    flex: 1,
  },
  cardScrollContent: {
    paddingHorizontal: spacing[5],
    paddingBottom:     36,
  },
  cardTitle: {
    fontSize:     24,
    fontWeight:   "700",
    color:        colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize:     fontSize.sm,
    color:        colors.textMuted,
    marginBottom: spacing[4],
  },
  cardBody: {
    gap: spacing[4],
  },
  cardFooter: {
    marginTop:  spacing[4],
    alignItems: "center",
  },
});
