// // ─────────────────────────────────────────────────────────────────────────────
// // CONVERTED FROM: src/pages/Login.jsx + Login.css
// //
// // Web → RN changes:
// //   <form onSubmit>          → no form tag; Button onPress calls handler directly
// //   <Link to="/signup">      → navigation.navigate("Signup")
// //   useNavigate()            → useNavigation()
// //   navigate("/farmer/dashboard", { replace: true }) → navigation.reset() to tab root
// //   ForgotPasswordModal div  → RN Modal component
// //   .fp-backdrop position:fixed → Modal transparent + overlay View
// //   .auth-error div          → View + Text with errorBg color
// //   e.target.value           → direct string value from TextInput onChangeText
// // ─────────────────────────────────────────────────────────────────────────────
// import React, { useState } from "react";
// import {
//   View, Text, TouchableOpacity, Modal,
//   ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useTranslation } from "react-i18next";

// import AuthShell from "../../components/AuthShell";
// import Input     from "../../components/Input";
// import Button    from "../../components/Button";

// import { loginUser, forgotPassword } from "../../services/authService";
// import { useAuth } from "../../context/AuthContext";
// import { useApp }  from "../../context/AppContext";
// import { colors, radius, spacing, fontSize, shadows } from "../../theme";

// // ─── Forgot Password Modal ────────────────────────────────────────────────────
// // Web: position:fixed backdrop + div card
// // RN:  Modal transparent + overlay View + card View
// function ForgotPasswordModal({ visible, onClose, pushToast, t }) {
//   const [fpPhone,           setFpPhone]           = useState("");
//   const [fpNewPassword,     setFpNewPassword]     = useState("");
//   const [fpConfirmPassword, setFpConfirmPassword] = useState("");
//   const [fpLoading,         setFpLoading]         = useState(false);

//   const handleSubmit = async () => {
//     // Same validation as web
//     if (!fpPhone || !fpNewPassword || !fpConfirmPassword) {
//       pushToast(t("messages.VALIDATION_ERROR"), "error"); return;
//     }
//     if (!/^[6-9]\d{9}$/.test(fpPhone)) {
//       pushToast(t("messages.INVALID_PHONE", { defaultValue: "Invalid phone number" }), "error"); return;
//     }
//     if (fpNewPassword.length < 8) {
//       pushToast(t("messages.PASSWORD_TOO_SHORT", { defaultValue: "Password must be at least 8 characters" }), "error"); return;
//     }
//     if (fpNewPassword !== fpConfirmPassword) {
//       pushToast(t("messages.PASSWORDS_DO_NOT_MATCH", { defaultValue: "Passwords do not match" }), "error"); return;
//     }

//     setFpLoading(true);
//     try {
//       await forgotPassword({ phone: fpPhone, new_password: fpNewPassword, confirm_password: fpConfirmPassword });
//       pushToast(t("messages.PASSWORD_RESET_SUCCESS", { defaultValue: "Password updated successfully" }), "success");
//       onClose();
//     } catch (err) {
//       const detail = err?.response?.data?.detail;
//       const message = Array.isArray(detail)
//         ? detail.map((d) => d.msg).join(", ")
//         : typeof detail === "string" ? detail : t("messages.GENERIC_ERROR");
//       pushToast(message, "error");
//     } finally {
//       setFpLoading(false);
//     }
//   };

//   return (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//       {/* Backdrop — replaces .fp-backdrop position:fixed */}
//       <KeyboardAvoidingView
//         style={s.fpOverlay}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

//         {/* Card — replaces .fp-modal */}
//         <View style={s.fpCard}>
//           <Text style={s.fpTitle}>{t("auth.forgot_password_title")}</Text>
//           <Text style={s.fpSubtitle}>{t("auth.forgot_password_subtitle")}</Text>

//           <View style={s.fpForm}>
//             <Input
//               label={t("auth.phone")}
//               type="tel"
//               placeholder={t("auth.phone_placeholder")}
//               value={fpPhone}
//               onChangeText={setFpPhone}
//             />
//             <Input
//               label={t("auth.new_password")}
//               type="password"
//               placeholder={t("auth.new_password_placeholder")}
//               value={fpNewPassword}
//               onChangeText={setFpNewPassword}
//             />
//             <Input
//               label={t("auth.confirm_password")}
//               type="password"
//               placeholder={t("auth.confirm_password_placeholder")}
//               value={fpConfirmPassword}
//               onChangeText={setFpConfirmPassword}
//             />

//             {/* Actions row — replaces .fp-actions display:flex gap */}
//             <View style={s.fpActions}>
//               <Button variant="secondary" onPress={onClose} disabled={fpLoading} style={s.fpBtn}>
//                 {t("common.cancel", { defaultValue: "Cancel" })}
//               </Button>
//               <Button variant="primary" onPress={handleSubmit} loading={fpLoading} disabled={fpLoading} style={s.fpBtn}>
//                 {t("auth.reset_password_button")}
//               </Button>
//             </View>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// }

// // ─── Login Screen ─────────────────────────────────────────────────────────────
// export default function LoginScreen() {
//   const { t }         = useTranslation();
//   const navigation    = useNavigation();
//   const { saveAuth }  = useAuth();
//   const { pushToast } = useApp();

//   const [phone,    setPhone]    = useState("");
//   const [password, setPassword] = useState("");
//   const [error,    setError]    = useState("");
//   const [loading,  setLoading]  = useState(false);
//   const [showForgot, setShowForgot] = useState(false);

//   const handleSubmit = async () => {
//     setError("");

//     if (!phone || !password) {
//       setError(t("messages.VALIDATION_ERROR")); return;
//     }

//     setLoading(true);
//     try {
//       const res = await loginUser({ phone, password });

//       // saveAuth is async in RN (writes to SecureStore)
//       await saveAuth(res.access_token, res.user);

//       pushToast(t("messages.AUTH_LOGIN_SUCCESS"), "success");

//       // Role-based redirect — replaces navigate("/farmer/dashboard", { replace: true })
//       // navigation.reset() fully replaces the stack so back button can't go back to login
//       const role = res.user.role;
//       // AppNavigator re-renders automatically when saveAuth sets isAuthenticated=true
//       // No manual navigation needed — the navigator switches to the role navigator
//     } catch (err) {
//       const code = err?.response?.data?.message || err?.message || "GENERIC_ERROR";
//       setError(t(`messages.${code}`, { defaultValue: t("messages.GENERIC_ERROR") }));
//       pushToast(t("messages.GENERIC_ERROR"), "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Footer: "No account? Sign up" — replaces <Link to="/signup">
//   const footer = (
//     <View style={s.footerRow}>
//       <Text style={s.footerText}>{t("auth.no_account")} </Text>
//       <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
//         <Text style={s.footerLink}>{t("auth.signup_link")}</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <>
//       <AuthShell
//         title={t("auth.login_title")}
//         subtitle={t("auth.login_subtitle")}
//         footer={footer}
//       >
//         {/* Error banner — replaces .auth-error div */}
//         {!!error && (
//           <View style={s.errorBox}>
//             <Text style={s.errorText}>{error}</Text>
//           </View>
//         )}

//         {/* Phone */}
//         <Input
//           label={t("auth.phone")}
//           type="tel"
//           placeholder={t("auth.phone_placeholder")}
//           value={phone}
//           onChangeText={setPhone}
//         />

//         {/* Password */}
//         <Input
//           label={t("auth.password")}
//           type="password"
//           placeholder={t("auth.password_placeholder")}
//           value={password}
//           onChangeText={setPassword}
//         />

//         {/* Forgot password link — replaces .fp-link button */}
//         <TouchableOpacity
//           style={s.fpLinkWrap}
//           onPress={() => setShowForgot(true)}
//         >
//           <Text style={s.fpLinkText}>{t("auth.forgot_password")}</Text>
//         </TouchableOpacity>

//         {/* Login Button */}
//         <Button
//           variant="primary"
//           block
//           loading={loading}
//           disabled={loading}
//           onPress={handleSubmit}
//         >
//           {t("auth.login_button")}
//         </Button>
//       </AuthShell>

//       {/* Forgot Password Modal */}
//       <ForgotPasswordModal
//         visible={showForgot}
//         onClose={() => setShowForgot(false)}
//         pushToast={pushToast}
//         t={t}
//       />
//     </>
//   );
// }

// const s = StyleSheet.create({
//   // ── Error banner ─────────────────────────────────────────────────────────
//   errorBox: {
//     backgroundColor: colors.errorBg,
//     borderWidth:     1,
//     borderColor:     "rgba(185,28,28,0.12)",
//     borderRadius:    radius.md,
//     padding:         spacing[3],
//   },
//   errorText: {
//     fontSize: fontSize.sm,
//     color:    colors.error,
//   },

//   // ── Forgot link ───────────────────────────────────────────────────────────
//   fpLinkWrap: {
//     alignSelf:  "flex-end",
//     marginTop:  -spacing[2],
//   },
//   fpLinkText: {
//     fontSize:          fontSize.xs,
//     color:             colors.primary,
//     textDecorationLine:"underline",
//   },

//   // ── Footer row ────────────────────────────────────────────────────────────
//   footerRow: {
//     flexDirection:  "row",
//     justifyContent: "center",
//     flexWrap:       "wrap",
//   },
//   footerText: {
//     fontSize: fontSize.sm,
//     color:    "rgba(26,25,25,0.9)",
//   },
//   footerLink: {
//     fontSize:   fontSize.sm,
//     color:      colors.primary900 || colors.primary,
//     fontWeight: "600",
//   },

//   // ── Forgot Password Modal ─────────────────────────────────────────────────
//   fpOverlay: {
//     flex:            1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     alignItems:      "center",
//     justifyContent:  "center",
//     padding:         spacing[4],
//   },
//   fpCard: {
//     width:           "100%",
//     maxWidth:        420,
//     backgroundColor: colors.surface,
//     borderRadius:    radius.lg,
//     padding:         spacing[6],
//     ...shadows.lg,
//   },
//   fpTitle: {
//     fontSize:     fontSize.lg,
//     fontWeight:   "700",
//     color:        colors.text,
//     marginBottom: 4,
//   },
//   fpSubtitle: {
//     fontSize:     fontSize.sm,
//     color:        colors.textMuted,
//     marginBottom: spacing[5],
//   },
//   fpForm: { gap: spacing[4] },
//   fpActions: {
//     flexDirection: "row",
//     gap:           spacing[3],
//     marginTop:     spacing[2],
//   },
//   fpBtn: { flex: 1 },
// });


// ─────────────────────────────────────────────────────────────────────────────
// CONVERTED FROM: src/pages/Login.jsx + Login.css
//
// Web → RN changes:
//   <form onSubmit>          → no form tag; Button onPress calls handler directly
//   <Link to="/signup">      → navigation.navigate("Signup")
//   useNavigate()            → useNavigation()
//   navigate("/farmer/dashboard", { replace: true }) → navigation.reset() to tab root
//   ForgotPasswordModal div  → RN Modal component
//   .fp-backdrop position:fixed → Modal transparent + overlay View
//   .auth-error div          → View + Text with errorBg color
//   e.target.value           → direct string value from TextInput onChangeText
//
// Toast fix:
//   route.params?.toastMessage → read nav param on mount and show toast here,
//   so auth-guard toasts from ContactActions appear on Login, not on the
//   marketplace/rental screen that navigated away.
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// CONVERTED FROM: src/pages/Login.jsx + Login.css
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Modal,
  ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import AuthShell from "../../components/AuthShell";
import Input     from "../../components/Input";
import Button    from "../../components/Button";

import { loginUser, forgotPassword } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useApp }  from "../../context/AppContext";
import { colors, radius, spacing, fontSize, shadows } from "../../theme";

// ─── Forgot Password Modal ────────────────────────────────────────────────────
function ForgotPasswordModal({ visible, onClose, pushToast, t }) {
  const [fpPhone,           setFpPhone]           = useState("");
  const [fpNewPassword,     setFpNewPassword]     = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpLoading,         setFpLoading]         = useState(false);

  const handleSubmit = async () => {
    if (!fpPhone || !fpNewPassword || !fpConfirmPassword) {
      pushToast(t("messages.VALIDATION_ERROR"), "error"); return;
    }
    if (!/^[6-9]\d{9}$/.test(fpPhone)) {
      pushToast(t("messages.INVALID_PHONE", { defaultValue: "Invalid phone number" }), "error"); return;
    }
    if (fpNewPassword.length < 8) {
      pushToast(t("messages.PASSWORD_TOO_SHORT", { defaultValue: "Password must be at least 8 characters" }), "error"); return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      pushToast(t("messages.PASSWORDS_DO_NOT_MATCH", { defaultValue: "Passwords do not match" }), "error"); return;
    }

    setFpLoading(true);
    try {
      await forgotPassword({ phone: fpPhone, new_password: fpNewPassword, confirm_password: fpConfirmPassword });
      pushToast(t("messages.PASSWORD_RESET_SUCCESS", { defaultValue: "Password updated successfully" }), "success");
      onClose();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : typeof detail === "string" ? detail : t("messages.GENERIC_ERROR");
      pushToast(message, "error");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={s.fpOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={s.fpCard}>
          <Text style={s.fpTitle}>{t("auth.forgot_password_title")}</Text>
          <Text style={s.fpSubtitle}>{t("auth.forgot_password_subtitle")}</Text>
          <View style={s.fpForm}>
            <Input
              label={t("auth.phone")}
              type="tel"
              placeholder={t("auth.phone_placeholder")}
              value={fpPhone}
              onChangeText={setFpPhone}
            />
            <Input
              label={t("auth.new_password")}
              type="password"
              placeholder={t("auth.new_password_placeholder")}
              value={fpNewPassword}
              onChangeText={setFpNewPassword}
            />
            <Input
              label={t("auth.confirm_password")}
              type="password"
              placeholder={t("auth.confirm_password_placeholder")}
              value={fpConfirmPassword}
              onChangeText={setFpConfirmPassword}
            />
            <View style={s.fpActions}>
              <Button variant="secondary" onPress={onClose} disabled={fpLoading} style={s.fpBtn}>
                {t("common.cancel", { defaultValue: "Cancel" })}
              </Button>
              <Button variant="primary" onPress={handleSubmit} loading={fpLoading} disabled={fpLoading} style={s.fpBtn}>
                {t("auth.reset_password_button")}
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const route         = useRoute();
  const { saveAuth }  = useAuth();
  const { pushToast } = useApp();

  const [phone,      setPhone]      = useState("");
  const [password,   setPassword]   = useState("");
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // ✅ Watch the param directly — fires whenever ContactActions navigates here
  // with a toastMessage. Clear it immediately so it never fires twice.
  useEffect(() => {
    const msg = route.params?.toastMessage;
    if (msg) {
      navigation.setParams({ toastMessage: undefined });
      pushToast(msg, "error");
    }
  }, [route.params?.toastMessage]);

  const handleSubmit = async () => {
    setError("");
    if (!phone || !password) {
      setError(t("messages.VALIDATION_ERROR")); return;
    }
    setLoading(true);
    try {
      const res = await loginUser({ phone, password });
      await saveAuth(res.access_token, res.user);
      pushToast(t("messages.AUTH_LOGIN_SUCCESS"), "success");
      const role = res.user.role;
      // AppNavigator re-renders automatically when saveAuth sets isAuthenticated=true
    } catch (err) {
      const code = err?.response?.data?.message || err?.message || "GENERIC_ERROR";
      setError(t(`messages.${code}`, { defaultValue: t("messages.GENERIC_ERROR") }));
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <View style={s.footerRow}>
      <Text style={s.footerText}>{t("auth.no_account")} </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={s.footerLink}>{t("auth.signup_link")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <AuthShell
        title={t("auth.login_title")}
        subtitle={t("auth.login_subtitle")}
        footer={footer}
      >
        {!!error && (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{error}</Text>
          </View>
        )}

        <Input
          label={t("auth.phone")}
          type="tel"
          placeholder={t("auth.phone_placeholder")}
          value={phone}
          onChangeText={setPhone}
        />

        <Input
          label={t("auth.password")}
          type="password"
          placeholder={t("auth.password_placeholder")}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={s.fpLinkWrap}
          onPress={() => setShowForgot(true)}
        >
          <Text style={s.fpLinkText}>{t("auth.forgot_password")}</Text>
        </TouchableOpacity>

        <Button
          variant="primary"
          block
          loading={loading}
          disabled={loading}
          onPress={handleSubmit}
        >
          {t("auth.login_button")}
        </Button>
      </AuthShell>

      <ForgotPasswordModal
        visible={showForgot}
        onClose={() => setShowForgot(false)}
        pushToast={pushToast}
        t={t}
      />
    </>
  );
}

const s = StyleSheet.create({
  errorBox: {
    backgroundColor: colors.errorBg,
    borderWidth:     1,
    borderColor:     "rgba(185,28,28,0.12)",
    borderRadius:    radius.md,
    padding:         spacing[3],
  },
  errorText: {
    fontSize: fontSize.sm,
    color:    colors.error,
  },
  fpLinkWrap: {
    alignSelf: "flex-end",
    marginTop: -spacing[2],
  },
  fpLinkText: {
    fontSize:           fontSize.xs,
    color:              colors.primary,
    textDecorationLine: "underline",
  },
  footerRow: {
    flexDirection:  "row",
    justifyContent: "center",
    flexWrap:       "wrap",
  },
  footerText: {
    fontSize: fontSize.sm,
    color:    "rgba(26,25,25,0.9)",
  },
  footerLink: {
    fontSize:   fontSize.sm,
    color:      colors.primary900 || colors.primary,
    fontWeight: "600",
  },
  fpOverlay: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems:      "center",
    justifyContent:  "center",
    padding:         spacing[4],
  },
  fpCard: {
    width:           "100%",
    maxWidth:        420,
    backgroundColor: colors.surface,
    borderRadius:    radius.lg,
    padding:         spacing[6],
    ...shadows.lg,
  },
  fpTitle: {
    fontSize:     fontSize.lg,
    fontWeight:   "700",
    color:        colors.text,
    marginBottom: 4,
  },
  fpSubtitle: {
    fontSize:     fontSize.sm,
    color:        colors.textMuted,
    marginBottom: spacing[5],
  },
  fpForm:    { gap: spacing[4] },
  fpActions: {
    flexDirection: "row",
    gap:           spacing[3],
    marginTop:     spacing[2],
  },
  fpBtn: { flex: 1 },
});