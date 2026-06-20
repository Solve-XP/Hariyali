// // ─────────────────────────────────────────────────────────────────────────────
// // COPIED AS-IS from web src/utils/errorHandler.js
// // Pure JS — works identically in React Native, no changes needed
// // ─────────────────────────────────────────────────────────────────────────────

// export function getErrorMessage(error) {
//   return (
//     error?.response?.data?.detail  ||
//     error?.response?.data?.message ||
//     error?.message                 ||
//     "Something went wrong"
//   );
// }



export function getErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (detail) {
    // FastAPI validation errors — array of {type, loc, msg, input}
    if (Array.isArray(detail)) {
      return detail.map(e => e.msg || JSON.stringify(e)).join(", ");
    }
    // Plain string
    if (typeof detail === "string") return detail;
    // Single object
    if (typeof detail === "object") return detail.msg || JSON.stringify(detail);
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
}