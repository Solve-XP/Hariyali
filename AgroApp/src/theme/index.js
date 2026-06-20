// ─────────────────────────────────────────────────────────────────────────────
// CONVERTED FROM: src/styles/global.css + index.css
// All CSS variables → JS constants for StyleSheet.create()
// ─────────────────────────────────────────────────────────────────────────────

// ── Colors (from :root CSS variables) ────────────────────────────────────────
export const colors = {
  // Primary green
  primary:        "#047857",
  primary600:     "#059669",
  primary500:     "#10b981",
  primary50:      "#ecfdf5",
  primary100:     "#d1fae5",
  primary900:     "#064e3b",

  // Accent amber
  accent:         "#f59e0b",
  accent600:      "#d97706",
  accent50:       "#fffbeb",

  // Backgrounds
  bg:             "#f8fafc",
  surface:        "#ffffff",
  surface2:       "#f1f5f9",
  surfaceHover:   "#f8fafc",

  // Borders
  border:         "#e2e8f0",
  borderStrong:   "#cbd5e1",
  divider:        "#eef2f6",

  // Text
  text:           "#0f172a",
  text2:          "#334155",
  textMuted:      "#64748b",
  textFaint:      "#94a3b8",
  textInverse:    "#ffffff",

  // Sidebar
  sidebarBg:          "#0b1220",
  sidebarBg2:         "#111827",
  sidebarBorder:      "#1f2937",
  sidebarText:        "#cbd5e1",
  sidebarTextMuted:   "#64748b",
  sidebarActiveBg:    "rgba(16,185,129,0.12)",
  sidebarActiveBorder:"#10b981",

  // Status
  success:    "#047857",
  successBg:  "#d1fae5",
  error:      "#b91c1c",
  errorBg:    "#fee2e2",
  warning:    "#b45309",
  warningBg:  "#fef3c7",
  info:       "#1d4ed8",
  infoBg:     "#dbeafe",
  cyan:       "#0891b2",
  cyanBg:     "#ecfeff",
  purple:     "#9333ea",
  purpleBg:   "#f3e8ff",
};

// ── Spacing (from --space-1 … --space-8) ─────────────────────────────────────
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
};

// ── Border radius (from --radius-*) ──────────────────────────────────────────
export const radius = {
  xs:   4,
  sm:   6,
  md:   8,
  lg:   12,
  xl:   16,
  pill: 999,
};

// ── Typography (from --fs-* and --font-sans) ──────────────────────────────────
export const fontSize = {
  xs:   12,
  sm:   13,
  base: 14,
  md:   16,
  lg:   18,
  xl:   22,
  "2xl": 28,
  "3xl": 34,
  "4xl": 42,
};

export const typography = {
  h1:      { fontSize: fontSize["2xl"], fontWeight: "700", letterSpacing: -0.5, color: colors.text },
  h2:      { fontSize: fontSize.xl,    fontWeight: "700", letterSpacing: -0.4, color: colors.text },
  h3:      { fontSize: fontSize.lg,    fontWeight: "600", letterSpacing: -0.3, color: colors.text },
  h4:      { fontSize: fontSize.md,    fontWeight: "600", letterSpacing: -0.2, color: colors.text },
  body:    { fontSize: fontSize.base,  fontWeight: "400", color: colors.text },
  bodyLg:  { fontSize: fontSize.md,    fontWeight: "400", color: colors.text },
  small:   { fontSize: fontSize.sm,    fontWeight: "400", color: colors.textMuted },
  xs:      { fontSize: fontSize.xs,    fontWeight: "400", color: colors.textMuted },
  label:   { fontSize: fontSize.sm,    fontWeight: "500", color: colors.text2 },
  muted:   { fontSize: fontSize.base,  fontWeight: "400", color: colors.textMuted },
};

// ── Shadows (from --shadow-*) ─────────────────────────────────────────────────
export const shadows = {
  xs: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 16,
  },
};

// ── Layout constants (from --sidebar-width, --topbar-height) ─────────────────
export const layout = {
  sidebarWidth:    260,
  topbarHeight:    68,
  bottomTabHeight: 64,
  screenPadding:   16,
  pagePaddingLg:   32,
};

export default { colors, spacing, radius, fontSize, typography, shadows, layout };
