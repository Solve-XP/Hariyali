// src/pages/profile/Profile.jsx

import "./Profile.css";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

import { UsersService } from "../../services/usersService";

import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";

export default function Profile() {

  const { t } =
    useTranslation();

  const { pushToast } =
    useApp();

  const {
    updateUser,
  } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [profile, setProfile] =
    useState(null);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  /* =========================================
     LOAD PROFILE
  ========================================= */

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile = async () => {

    try {

      setLoading(true);

      const response =
        await UsersService.getMe();

      const data =
        response?.data || response;

      setProfile(data);

      setName(
        data?.name || ""
      );

      setPhone(
        data?.phone || ""
      );

    } catch (error) {

      console.error(error);

      pushToast(
        t("profile.failed_load"),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================================
     VALIDATION
  ========================================= */

  const validateProfile =
    () => {

      if (
        name.trim().length < 2
      ) {

        pushToast(
          t("profile.name_validation"),
          "error"
        );

        return false;
      }

      if (
        !/^[0-9]{10}$/.test(
          phone
        )
      ) {

        pushToast(
          t("profile.phone_validation"),
          "error"
        );

        return false;
      }

      return true;
    };

  /* =========================================
     UPDATE PROFILE
  ========================================= */

  const handleUpdateProfile =
    async () => {

      try {

        if (
          !validateProfile()
        ) {
          return;
        }

        const payload = {};

        if (
          name.trim() !==
          profile?.name
        ) {

          payload.name =
            name.trim();
        }

        if (
          phone.trim() !==
          profile?.phone
        ) {

          payload.phone =
            phone.trim();
        }

        if (
          Object.keys(payload)
            .length === 0
        ) {

          pushToast(
            t("profile.no_changes"),
            "info"
          );

          return;
        }

        const response =
          await UsersService.updateMe(
            payload
          );

        const updatedUser =
          response?.data ||
          response;

        updateUser({
          ...profile,
          ...updatedUser,
          ...payload,
        });

        pushToast(
          t("profile.updated_success"),
          "success"
        );

        loadProfile();

      } catch (error) {

        console.error(error);

        pushToast(
          error?.response?.data
            ?.detail ||
            t("profile.failed_update"),
          "error"
        );
      }
    };

  /* =========================================
     CHANGE PASSWORD
  ========================================= */

  const handleChangePassword =
    async () => {

      try {

        if (
          currentPassword.trim()
            .length === 0
        ) {

          pushToast(
            t("profile.current_password_required"),
            "error"
          );

          return;
        }

        if (
          newPassword.length < 8
        ) {

          pushToast(
            t("profile.password_validation"),
            "error"
          );

          return;
        }

        if (
          newPassword !==
          confirmPassword
        ) {

          pushToast(
            t("profile.password_mismatch"),
            "error"
          );

          return;
        }

        await UsersService.changePassword({

          current_password:
            currentPassword,

          new_password:
            newPassword,
        });

        pushToast(
          t("profile.password_updated_success"),
          "success"
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

      } catch (error) {

        console.error(error);

        pushToast(
          error?.response?.data
            ?.detail ||
            t("profile.failed_password_update"),
          "error"
        );
      }
    };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <div className="profile-loading">

        {t("profile.loading")}

      </div>
    );
  }

  return (

    <div className="page profile-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <PageHeader
        title={t("profile.title")}
        subtitle={t("profile.subtitle")}
      />

      {/* =====================================
          PROFILE CARD
      ===================================== */}

      <Card className="profile-card">

        <div className="profile-card-content">

          <div className="profile-avatar">

            {profile?.name
              ?.charAt(0)
              ?.toUpperCase()}

          </div>

          <div className="profile-info">

            <h2>
              {profile?.name}
            </h2>

            <p>
              {profile?.phone}
            </p>

            <span className="profile-role">

              {profile?.role}

            </span>

          </div>

        </div>

      </Card>

      {/* =====================================
          FORMS GRID
      ===================================== */}

      <div className="profile-grid">

        {/* =================================
            EDIT PROFILE
        ================================== */}

        <Card className="profile-section-card">

          <div className="profile-section-header">

            <h3>
              {t("profile.edit_profile")}
            </h3>

            <p>
              {t("profile.edit_profile_subtitle")}
            </p>

          </div>

          <div className="profile-form">

            <Input
              label={t("profile.name")}
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder={t("profile.enter_name")}
            />

            <Input
              label={t("profile.phone")}
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              placeholder={t("profile.enter_phone")}
            />

            <Button
              onClick={
                handleUpdateProfile
              }
            >
              {t("profile.save_changes")}
            </Button>

          </div>

        </Card>

        {/* =================================
            CHANGE PASSWORD
        ================================== */}

        <Card className="profile-section-card">

          <div className="profile-section-header">

            <h3>
              {t("profile.change_password")}
            </h3>

            <p>
              {t("profile.change_password_subtitle")}
            </p>

          </div>

          <div className="profile-form">

            <Input
              type="password"
              label={t("profile.current_password")}
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              placeholder={t("profile.enter_current_password")}
            />

            <Input
              type="password"
              label={t("profile.new_password")}
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              placeholder={t("profile.enter_new_password")}
            />

            <Input
              type="password"
              label={t("profile.confirm_password")}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder={t("profile.enter_confirm_password")}
            />

            <Button
              onClick={
                handleChangePassword
              }
            >
              {t("profile.update_password")}
            </Button>

          </div>

        </Card>

      </div>

    </div>
  );
}