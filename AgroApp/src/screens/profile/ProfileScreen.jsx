// CONVERTED FROM: src/pages/profile/Profile.jsx + Profile.css
//
// Changes:
//   e.target.value → onChangeText direct string
//   <div className="profile-grid"> (2-col CSS) → stacked View (mobile is single col)
//   profile avatar circle → View with gradient-like bg
//   loading div → ActivityIndicator

import React, { useEffect, useState } from "react";
import {
  View, Text, ActivityIndicator, StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";

import ScreenShell from "../../components/ScreenShell";
import Card        from "../../components/Card";
import Input       from "../../components/Input";
import Button      from "../../components/Button";
import PageHeader  from "../../components/PageHeader";

import { UsersService } from "../../services/usersService";
import { useAuth }      from "../../context/AuthContext";
import { useApp }       from "../../context/AppContext";
import { colors, spacing, radius, fontSize } from "../../theme";

export default function ProfileScreen() {
  const { t }             = useTranslation();
  const { pushToast }     = useApp();
  const { updateUser }    = useAuth();

  const [loading,          setLoading]          = useState(true);
  const [profile,          setProfile]          = useState(null);
  const [name,             setName]             = useState("");
  const [phone,            setPhone]            = useState("");
  const [currentPassword,  setCurrentPassword]  = useState("");
  const [newPassword,      setNewPassword]      = useState("");
  const [confirmPassword,  setConfirmPassword]  = useState("");

  // ── Load profile ───────────────────────────────────────────────────────────
  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await UsersService.getMe();
      const data     = response?.data || response;
      setProfile(data);
      setName(data?.name  || "");
      setPhone(data?.phone || "");
    } catch {
      pushToast(t("profile.failed_load"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  // ── Validation — same as web ───────────────────────────────────────────────
  const validateProfile = () => {
    if (name.trim().length < 2) { pushToast(t("profile.name_validation"), "error"); return false; }
    if (!/^[0-9]{10}$/.test(phone)) { pushToast(t("profile.phone_validation"), "error"); return false; }
    return true;
  };

  // ── Update profile ─────────────────────────────────────────────────────────
  const handleUpdateProfile = async () => {
    if (!validateProfile()) return;
    const payload = {};
    if (name.trim()  !== profile?.name)  payload.name  = name.trim();
    if (phone.trim() !== profile?.phone) payload.phone = phone.trim();
    if (Object.keys(payload).length === 0) {
      pushToast(t("profile.no_changes"), "info"); return;
    }
    try {
      const response    = await UsersService.updateMe(payload);
      const updatedUser = response?.data || response;
      updateUser({ ...profile, ...updatedUser, ...payload });
      pushToast(t("profile.updated_success"), "success");
      loadProfile();
    } catch (error) {
      pushToast(error?.response?.data?.detail || t("profile.failed_update"), "error");
    }
  };

  // ── Change password — same validation as web ──────────────────────────────
  const handleChangePassword = async () => {
    if (!currentPassword.trim()) { pushToast(t("profile.current_password_required"), "error"); return; }
    if (newPassword.length < 8)  { pushToast(t("profile.password_validation"),       "error"); return; }
    if (newPassword !== confirmPassword) { pushToast(t("profile.password_mismatch"),  "error"); return; }
    try {
      await UsersService.changePassword({ current_password: currentPassword, new_password: newPassword });
      pushToast(t("profile.password_updated_success"), "success");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (error) {
      pushToast(error?.response?.data?.detail || t("profile.failed_password_update"), "error");
    }
  };

  if (loading) {
    return (
      <ScreenShell title={t("profile.title")}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} size="large" />
      </ScreenShell>
    );
  }

  const initial = profile?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <ScreenShell title={t("profile.title")}>
      <PageHeader title={t("profile.title")} subtitle={t("profile.subtitle")} />

      {/* ── Profile card — replaces .profile-card ──────────────────────── */}
      <Card style={s.profileCard}>
        {/* Avatar — replaces .profile-avatar with CSS gradient */}
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initial}</Text>
        </View>
        <View style={s.profileInfo}>
          <Text style={s.profileName}>{profile?.name}</Text>
          <Text style={s.profilePhone}>{profile?.phone}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleText}>{profile?.role}</Text>
          </View>
        </View>
      </Card>

      {/* ── Forms — replaces .profile-grid grid 2-col → stacked ────────── */}

      {/* Edit profile */}
      <Card>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{t("profile.edit_profile")}</Text>
          <Text style={s.sectionSub}>{t("profile.edit_profile_subtitle")}</Text>
        </View>
        <View style={s.form}>
          <Input
            label={t("profile.name")}
            value={name}
            onChangeText={setName}
            placeholder={t("profile.enter_name")}
          />
          <Input
            label={t("profile.phone")}
            type="tel"
            value={phone}
            onChangeText={setPhone}
            placeholder={t("profile.enter_phone")}
          />
          <Button onPress={handleUpdateProfile}>
            {t("profile.save_changes")}
          </Button>
        </View>
      </Card>

      {/* Change password */}
      <Card>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{t("profile.change_password")}</Text>
          <Text style={s.sectionSub}>{t("profile.change_password_subtitle")}</Text>
        </View>
        <View style={s.form}>
          <Input
            type="password"
            label={t("profile.current_password")}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder={t("profile.enter_current_password")}
          />
          <Input
            type="password"
            label={t("profile.new_password")}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t("profile.enter_new_password")}
          />
          <Input
            type="password"
            label={t("profile.confirm_password")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t("profile.enter_confirm_password")}
          />
          <Button onPress={handleChangePassword}>
            {t("profile.update_password")}
          </Button>
        </View>
      </Card>

    </ScreenShell>
  );
}

const s = StyleSheet.create({
  // Profile card — replaces .profile-card flexDirection row
  profileCard: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing[5],
    padding:       spacing[5],
  },

  // Avatar — replaces .profile-avatar gradient circle
  avatar: {
    width:          80,
    height:         80,
    borderRadius:   40,
    backgroundColor: colors.primary,   // gradient not supported in RN StyleSheet, solid is fine
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
    shadowColor:    "#000",
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.12,
    shadowRadius:   8,
    elevation:      6,
  },
  avatarText: {
    fontSize:   fontSize["2xl"],
    fontWeight: "700",
    color:      colors.textInverse,
  },

  // Profile info
  profileInfo:  { flex: 1, gap: 4 },
  profileName:  { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  profilePhone: { fontSize: fontSize.sm, color: colors.textMuted },

  // Role badge
  roleBadge: {
    alignSelf:         "flex-start",
    marginTop:         4,
    paddingVertical:   4,
    paddingHorizontal: 12,
    borderRadius:      radius.pill,
    backgroundColor:   colors.primary50,
    borderWidth:       1,
    borderColor:       colors.primary100,
  },
  roleText: {
    fontSize:      fontSize.xs,
    fontWeight:    "600",
    color:         colors.primary,
    textTransform: "capitalize",
  },

  // Section cards
  sectionHeader: { gap: 4, marginBottom: spacing[5] },
  sectionTitle:  { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  sectionSub:    { fontSize: fontSize.sm, color: colors.textMuted },

  form: { gap: spacing[4] },
});