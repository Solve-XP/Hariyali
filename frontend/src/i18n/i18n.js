import i18n
from "i18next";

import {
  initReactI18next,
} from "react-i18next";

import LanguageDetector
from "i18next-browser-languagedetector";

import en
from "./en.json";

import mr
from "./mr.json";

import hi
from "./hi.json";

/* ==========================================
   SUPPORTED LANGUAGES
========================================== */

export const
SUPPORTED_LANGUAGES = [

  {
    code: "mr",
    labelKey:
      "topbar.marathi",
  },

  {
    code: "en",
    labelKey:
      "topbar.english",
  },

  {
    code: "hi",
    labelKey:
      "topbar.hindi",
  },

];

/* ==========================================
   I18N CONFIG
========================================== */

i18n

  .use(
    LanguageDetector
  )

  .use(
    initReactI18next
  )

  .init({

    resources: {

      en: {
        translation:
          en,
      },

      mr: {
        translation:
          mr,
      },

      hi: {
        translation:
          hi,
      },

    },

    lng:
      localStorage.getItem(
        "solvexp_lang"
      ) ?? "mr",

    fallbackLng:
      "mr",

    supportedLngs: [
      "en",
      "mr",
      "hi",
    ],

    interpolation: {

      escapeValue:
        false,

    },

    detection: {

      order: [
        "localStorage",
      ],

      caches: [
        "localStorage",
      ],

      lookupLocalStorage:
        "solvexp_lang",

    },

  });

export default
i18n;