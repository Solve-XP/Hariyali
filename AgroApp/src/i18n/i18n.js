import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./en.json";
import mr from "./mr.json";
import hi from "./hi.json";

// ─── SUPPORTED LANGUAGES ──────────────────────────────────────────────────────
// Same list as web — same labelKeys so your Topbar/language switcher works
export const SUPPORTED_LANGUAGES = [
  { code: "mr", labelKey: "topbar.marathi" },
  { code: "en", labelKey: "topbar.english" },
  { code: "hi", labelKey: "topbar.hindi"   },
];

const LANG_KEY = "solvexp_lang"; // same key as web so it feels consistent

// ─── I18N CONFIG ──────────────────────────────────────────────────────────────
// Web used i18next-browser-languagedetector with localStorage.
// RN has no browser — we read AsyncStorage manually then init i18n.
async function initI18n() {
  let savedLang = "mr"; // same default as web
  try {
    const stored = await AsyncStorage.getItem(LANG_KEY);
    if (stored) savedLang = stored;
  } catch {
    // ignore, use default
  }

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        mr: { translation: mr },
        hi: { translation: hi },
      },
      lng: savedLang,
      fallbackLng: "mr",
      supportedLngs: ["en", "mr", "hi"],
      interpolation: { escapeValue: false },
      compatibilityJSON: "v3",
    });
}

initI18n();

// ─── CHANGE LANGUAGE HELPER ───────────────────────────────────────────────────
// Call this from your language switcher instead of i18n.changeLanguage directly
// Replaces: localStorage.setItem("solvexp_lang", lang)
export async function changeAppLanguage(lang) {
  await i18n.changeLanguage(lang);
  try {
    await AsyncStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore
  }
}

export default i18n;
