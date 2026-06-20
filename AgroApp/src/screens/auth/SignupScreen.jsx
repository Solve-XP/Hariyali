// ─────────────────────────────────────────────────────────────────────────────
// CONVERTED FROM: src/pages/Signup.jsx + Signup.css
//
// Web → RN changes:
//   <form onSubmit>          → Button onPress calls handleSubmit directly
//   <Link to="/login">       → navigation.navigate("Login")
//   e.target.value           → direct string from onChangeText
//   <input type="radio">     → TouchableOpacity role selector (no radio in RN)
//   grid-template-columns 1fr 1fr → flexDirection:"row" with flex:1 on each
//   set(field)(e) handler    → setForm inline with field name
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import AuthShell from "../../components/AuthShell";
import Input     from "../../components/Input";
import Button    from "../../components/Button";

import { signupUser } from "../../services/authService";
import { useAuth }    from "../../context/AuthContext";
import { useApp }     from "../../context/AppContext";
import { colors, radius, spacing, fontSize } from "../../theme";

export default function SignupScreen() {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const { saveAuth }  = useAuth();
  const { pushToast } = useApp();

  const [form, setForm] = useState({
    name:     "",
    phone:    "",
    password: "",
    confirm:  "",
    role:     "farmer",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // ── Field setter — replaces web set(field)(e) => e.target.value ─────────────
  const set = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  // ── Submit — identical validation logic as web ───────────────────────────────
  const handleSubmit = async () => {
    setError("");
    const { name, phone, password, confirm, role } = form;

    if (!name || !phone || !password || !confirm) {
      setError("All fields are required"); return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits"); return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters"); return;
    }
    if (password !== confirm) {
      setError("Passwords do not match"); return;
    }

    setLoading(true);
    try {
      const res = await signupUser({
        name:     name.trim(),
        phone:    phone.trim(),
        password,
        role:     role.toLowerCase(),
      });

      await saveAuth(res.access_token, res.user);
      pushToast("Signup successful", "success");
      // AppNavigator re-renders automatically on isAuthenticated change
      // No manual navigation needed

    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
      pushToast("Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Footer: "Have an account? Login" ────────────────────────────────────────
  const footer = (
    <View style={s.footerRow}>
      <Text style={s.footerText}>{t("auth.have_account")} </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={s.footerLink}>{t("auth.login_button")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AuthShell
      title={t("signup.title")}
      subtitle={t("signup.subtitle")}
      footer={footer}
    >
      {/* Error banner */}
      {!!error && (
        <View style={s.errorBox}>
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      {/* Name */}
      <Input
        label={t("signup.full_name")}
        type="text"
        value={form.name}
        onChangeText={set("name")}
        placeholder={t("signup.full_name")}
      />

      {/* Phone */}
      <Input
        label={t("signup.phone")}
        type="tel"
        value={form.phone}
        onChangeText={set("phone")}
        placeholder="10-digit mobile number"
      />

      {/* Role selector — replaces <input type="radio"> which doesn't exist in RN */}
      <View style={s.roleGroup}>
        <Text style={s.roleLabel}>{t("signup.role")} *</Text>
        <View style={s.roleOptions}>
          {["farmer", "merchant"].map((r) => {
            const active = form.role === r;
            return (
              <TouchableOpacity
                key={r}
                style={[s.roleOption, active && s.roleOptionActive]}
                onPress={() => set("role")(r)}
                activeOpacity={0.8}
              >
                {/* Radio circle — replaces <input type="radio"> */}
                <View style={[s.radioOuter, active && s.radioOuterActive]}>
                  {active && <View style={s.radioInner} />}
                </View>
                <Text style={[s.roleText, active && s.roleTextActive]}>
                  {t(`signup.${r}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Password row — replaces grid-template-columns: 1fr 1fr */}
      <View style={s.passwordRow}>
        <View style={s.passwordCol}>
          <Input
            label={t("signup.password")}
            type="password"
            value={form.password}
            onChangeText={set("password")}
            placeholder="Min 8 characters"
          />
        </View>
        <View style={s.passwordCol}>
          <Input
            label={t("signup.confirm_password")}
            type="password"
            value={form.confirm}
            onChangeText={set("confirm")}
            placeholder="Repeat password"
          />
        </View>
      </View>

      {/* Submit */}
      <Button
        variant="primary"
        block
        loading={loading}
        disabled={loading}
        onPress={handleSubmit}
      >
        {t("signup.signup_button")}
      </Button>
    </AuthShell>
  );
}

const s = StyleSheet.create({
  // ── Error ──────────────────────────────────────────────────────────────────
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

  // ── Role selector ──────────────────────────────────────────────────────────
  roleGroup: { gap: 10 },
  roleLabel: {
    fontSize:   14,
    fontWeight: "600",
    color:      "#1f2937",
  },
  roleOptions: {
    flexDirection: "row",
    gap:           20,
  },
  roleOption: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    paddingVertical:  6,
    paddingHorizontal:12,
    borderRadius:  radius.md,
    borderWidth:   1,
    borderColor:   colors.border,
    backgroundColor: colors.surface,
  },
  roleOptionActive: {
    borderColor:     colors.primary,
    backgroundColor: colors.primary50,
  },
  // Radio circle — CSS <input type="radio"> visual
  radioOuter: {
    width:        18,
    height:       18,
    borderRadius: 9,
    borderWidth:  2,
    borderColor:  colors.border,
    alignItems:   "center",
    justifyContent:"center",
  },
  radioOuterActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: colors.primary,
  },
  roleText: {
    fontSize:   15,
    color:      colors.text2,
  },
  roleTextActive: {
    color:      colors.primary,
    fontWeight: "600",
  },

  // ── Password row — replaces grid-template-columns: 1fr 1fr ───────────────
  passwordRow: {
    flexDirection: "row",
    gap:           spacing[3],
  },
  passwordCol: { flex: 1 },

  // ── Footer ────────────────────────────────────────────────────────────────
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
});
