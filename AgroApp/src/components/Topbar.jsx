// CONVERTED FROM: Topbar.jsx + Topbar.css
// Web: sticky header with menu button + lang toggle + page title from pathname
// RN:  fixed-height bar inside SafeAreaView — title passed as prop from each screen
//      Lang toggle kept. Back button shown when showBack=true.
//      useRoute() gets current screen name for title lookup.
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, changeAppLanguage } from "../i18n/i18n";
import { colors, fontSize, layout, spacing } from "../theme";

// ── Screen name → i18n key (mirrors web titleByPath) ─────────────────────────
const TITLE_KEYS = {
  DashboardHome:     "dashboard.title",
  FarmsHome:         "farms.title",
  Crops:             "crops.title",
  Fertilizers:       "fertilizers.title",
  Pesticides:        "pesticides.title",
  IncomesHome:       "incomes.title",
  Expenses:          "expenses.title",
  RentalsHome:       "rental.title",
  MyRentals:         "rental.title",
  MarketplaceHome:   "marketplace.title",
  MyListings:        "marketplace.title",
  AdminDashboardHome:"admin.dashboard_title",
};

export default function AppTopbar({ title, subtitle, showBack = false, right }) {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  return (
    <View style={s.bar}>
      <View style={s.left}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} hitSlop={8}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
        )}
        <View style={s.titleWrap}>
          {title ? <Text style={s.title} numberOfLines={1}>{title}</Text> : null}
          {subtitle ? <Text style={s.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={s.right}>
        {/* Lang toggle — same as web Topbar */}
        <View style={s.langRow}>
          {SUPPORTED_LANGUAGES.map((l) => {
            const active = i18n.language?.startsWith(l.code);
            return (
              <TouchableOpacity
                key={l.code}
                style={[s.langBtn, active && s.langBtnActive]}
                onPress={() => changeAppLanguage(l.code)}
              >
                <Text style={[s.langText, active && s.langTextActive]}>{t(l.labelKey)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {right ? <View style={s.rightExtra}>{right}</View> : null}
      </View>
    </View>
  );
}

// Helper so screens can get translated title by screen name
export function useScreenTitle(screenName) {
  const { t } = useTranslation();
  const key   = TITLE_KEYS[screenName];
  return key ? t(key) : screenName;
}

const s = StyleSheet.create({
  bar: {
    height:          layout.topbarHeight,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "space-between",
    paddingHorizontal: spacing[5],
  },
  left: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing[3],
    flex:          1,
  },
  backBtn:   { padding: 4 },
  backArrow: { fontSize: 20, color: colors.text2 },
  titleWrap: { flex: 1 },
  title: {
    fontSize:   fontSize.lg,
    fontWeight: "600",
    letterSpacing: -0.2,
    color:      colors.text,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color:    colors.textMuted,
    marginTop: 1,
  },
  right: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing[2],
  },
  rightExtra: { marginLeft: spacing[2] },
  // Lang toggle
  langRow: {
    flexDirection:   "row",
    backgroundColor: colors.surface2,
    borderWidth:     1,
    borderColor:     colors.border,
    borderRadius:    999,
    padding:         3,
    gap:             2,
  },
  langBtn: {
    paddingVertical:   6,
    paddingHorizontal: 14,
    borderRadius:      999,
  },
  langBtnActive: {
    backgroundColor: colors.primary900 || colors.primary,
    shadowColor:     "#000",
    shadowOpacity:   0.06,
    shadowRadius:    2,
    elevation:       2,
  },
  langText: {
    fontSize:   fontSize.sm,
    fontWeight: "500",
    color:      colors.textMuted,
  },
  langTextActive: {
    color: colors.textInverse,
  },
});
