// CONVERTED FROM: Icons.jsx
// Web: raw <svg> components using lucide-style SVG paths
// RN:  react-native-svg Svg + Path (same SVG paths, zero changes to paths)
//
// Usage is identical: <IconDashboard size={18} color="#fff" />
// All components accept size and color props just like the web version.
import React from "react";
import Svg, { Circle, Rect, Path, Line, Polyline } from "react-native-svg";

// ─── Base props helper (mirrors web bp()) ─────────────────────────────────────
const bp = (size, color = "currentColor", rest = {}) => ({
  width: size, height: size, viewBox: "0 0 24 24",
  fill: "none", stroke: color, strokeWidth: 2,
  strokeLinecap: "round", strokeLinejoin: "round",
  ...rest,
});

export const IconDashboard = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Rect x="3" y="3" width="7" height="9"/><Rect x="14" y="3" width="7" height="5"/><Rect x="14" y="12" width="7" height="9"/><Rect x="3" y="16" width="7" height="5"/></Svg>
);
export const IconFarm = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Circle cx="18" cy="6" r="2"/><Path d="M3 14l4-4 3 3 4-5 7 8"/><Path d="M3 18c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><Path d="M3 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/></Svg>
);
export const IconCrop = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)} strokeWidth="1.8"><Path d="M12 20V10"/><Path d="M12 14C9 14 7 12 7 9C10 9 12 11 12 14Z"/><Path d="M12 11C15 11 17 9 17 6C14 6 12 8 12 11Z"/><Path d="M5 20H19"/></Svg>
);
export const IconFarmYear = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)} strokeWidth="1.8"><Rect x="4" y="5" width="16" height="15" rx="2"/><Path d="M8 3V7"/><Path d="M16 3V7"/><Path d="M4 9H20"/><Path d="M12 17V12"/><Path d="M12 15C10 15 8.5 13.5 8.5 11.5C10.5 11.5 12 13 12 15Z"/><Path d="M12 13.5C14 13.5 15.5 12 15.5 10C13.5 10 12 11.5 12 13.5Z"/><Path d="M17 17.5A6 6 0 0 1 7 18"/><Path d="M7 18V15.8"/><Path d="M7 18H9.2"/></Svg>
);
export const IconSeason = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)} strokeWidth="1.8"><Path d="M6 9.5C6 7.6 7.6 6 9.5 6C10.7 6 11.8 6.6 12.4 7.5C12.8 7.2 13.4 7 14 7C15.7 7 17 8.3 17 10C18.2 10 19 10.8 19 12C19 13.2 18.2 14 17 14H7.5C6.1 14 5 12.9 5 11.5C5 10.5 5.4 9.8 6 9.5Z"/><Path d="M8 16L7.5 17"/><Path d="M11 16L10.5 17"/><Path d="M14 16L13.5 17"/><Path d="M18 20V15"/><Path d="M18 15C17 15 16 14 16 13C17 13 18 14 18 15Z"/><Path d="M18 17C19 17 20 16 20 15C19 15 18 16 18 17Z"/><Path d="M4 20H20"/></Svg>
);
export const IconRental = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Circle cx="6.5" cy="17.5" r="2.5"/><Circle cx="17.5" cy="17.5" r="2.5"/><Path d="M3 17.5h2M9 17.5h6M20 17.5h1"/><Path d="M5 12V7h6l3 4h5v6"/></Svg>
);
export const IconUsers = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><Circle cx="9" cy="7" r="4"/><Path d="M23 21v-2a4 4 0 0 0-3-3.87"/><Path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>
);
export const IconAdmin = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Svg>
);
export const IconPlus = ({ size = 16, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Line x1="12" y1="5" x2="12" y2="19"/><Line x1="5" y1="12" x2="19" y2="12"/></Svg>
);
export const IconTrash = ({ size = 16, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Polyline points="3 6 5 6 21 6"/><Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><Path d="M10 11v6M14 11v6"/></Svg>
);
export const IconPhone = ({ size = 14, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M22 16.92V21a1 1 0 0 1-1.11 1A19 19 0 0 1 2 4.11 1 1 0 0 1 3 3h4.09a1 1 0 0 1 1 .75c.18.7.42 1.38.72 2.04a1 1 0 0 1-.23 1.06L7.21 8.21a16 16 0 0 0 8.58 8.58l1.36-1.36a1 1 0 0 1 1.06-.23c.66.3 1.34.54 2.04.72a1 1 0 0 1 .75 1z"/></Svg>
);
export const IconMessage = ({ size = 14, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Svg>
);
export const IconLocation = ({ size = 14, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><Circle cx="12" cy="10" r="3"/></Svg>
);
export const IconLogout = ({ size = 16, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><Polyline points="16 17 21 12 16 7"/><Line x1="21" y1="12" x2="9" y2="12"/></Svg>
);
export const IconMenu = ({ size = 22, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Line x1="3" y1="6" x2="21" y2="6"/><Line x1="3" y1="12" x2="21" y2="12"/><Line x1="3" y1="18" x2="21" y2="18"/></Svg>
);
export const IconEye = ({ size = 16, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><Circle cx="12" cy="12" r="3"/></Svg>
);
export const IconEyeOff = ({ size = 16, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><Line x1="1" y1="1" x2="23" y2="23"/></Svg>
);
export const IconFertilizer = ({ size = 16, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M7 8h10l1 12H6L7 8z"/><Path d="M9 4h6l1 4H8l1-4z"/><Path d="M12 12c1.5-2 4-2 4-2s0 2.5-2 4-4 2-4 2 0-2 2-4z"/><Path d="M12 12c-1.5-2-4-2-4-2s0 2.5 2 4 4 2 4 2"/></Svg>
);
export const IconIncome = ({ size = 16, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Circle cx="12" cy="12" r="9"/><Path d="M9 8h6"/><Path d="M9 11h5"/><Path d="M10 16l5-5"/><Path d="M15 11v5h-5"/></Svg>
);
export const IconEdit = ({ size = 16, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M12 20h9"/><Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></Svg>
);
export const IconExpense = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Circle cx="12" cy="12" r="9"/><Path d="M9 8h6"/><Path d="M9 11h5"/><Path d="M14 13l-5 5"/><Path d="M9 18v-5h5"/></Svg>
);
export const IconSearch = ({ size = 16, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Circle cx="11" cy="11" r="8"/><Line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>
);
export const IconField = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M3 20h18"/><Path d="M5 16h14"/><Path d="M7 12h10"/><Path d="M9 8h6"/></Svg>
);
export const IconPlant = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M12 22V11"/><Path d="M8 7c0-2 2-4 4-4"/><Path d="M16 7c0-2-2-4-4-4"/><Path d="M7 13c0-2 2-4 5-4"/><Path d="M17 13c0-2-2-4-5-4"/></Svg>
);
export const IconSoil = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M4 20c2-2 4-2 6 0s4 2 6 0 4-2 4-2"/><Path d="M7 14c1.5-1.5 3-1.5 4.5 0S14.5 15.5 16 14"/><Path d="M12 11V4"/><Path d="M9 7c0-2 1.5-3 3-3"/><Path d="M15 7c0-2-1.5-3-3-3"/></Svg>
);
export const IconFinancialYear = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Rect x="3" y="4" width="18" height="17" rx="2"/><Path d="M16 2v4"/><Path d="M8 2v4"/><Path d="M3 10h18"/><Path d="M8 14h3"/><Path d="M13 14h3"/><Path d="M8 18h3"/></Svg>
);
export const IconTotalQuantity = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M6 20h12"/><Path d="M9 20V8h6v12"/><Path d="M8 8h8"/><Path d="M10 4h4v4h-4z"/></Svg>
);
export const IconTotalRecords = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Rect x="4" y="3" width="16" height="18" rx="2"/><Path d="M8 7h8"/><Path d="M8 11h8"/><Path d="M8 15h5"/></Svg>
);
export const IconLatestApplication = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Circle cx="12" cy="13" r="8"/><Path d="M12 9v5l3 2"/><Path d="M9 2h6"/></Svg>
);
export const IconPesticide = ({ size = 18, color = "#64748b" }) => (
  <Svg {...bp(size, color)}><Path d="M8 3h8l2 5v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8l2-5z"/><Path d="M9 8h6"/><Path d="M12 11v5"/><Path d="M10 13h4"/></Svg>
);
