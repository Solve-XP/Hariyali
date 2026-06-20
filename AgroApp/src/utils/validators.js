// ─────────────────────────────────────────────────────────────────────────────
// COPIED AS-IS from web src/utils/validators.js
// Pure JS — works identically in React Native, no changes needed
// ─────────────────────────────────────────────────────────────────────────────

export function validateRequired(data, fields) {
  return fields.every((field) => !!data[field]);
}
