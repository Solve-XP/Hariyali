import "./Login.css";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import { useNavigate, Link } from "react-router-dom";

import AuthShell from "../components/AuthShell";
import Input from "../components/Input";
import Button from "../components/Button";

import { loginUser, forgotPassword } from "../services/authService";

import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

// ─── Forgot Password Modal ────────────────────────────────────────────────────

function ForgotPasswordModal({ onClose, pushToast, t }) {
  const [fpPhone, setFpPhone] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);

  const navigate = useNavigate();

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!fpPhone || !fpNewPassword || !fpConfirmPassword) {
      pushToast(t("messages.VALIDATION_ERROR"), "error");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(fpPhone)) {
      pushToast(t("messages.INVALID_PHONE", { defaultValue: "Invalid phone number" }), "error");
      return;
    }

    if (fpNewPassword.length < 8) {
      pushToast(
        t("messages.PASSWORD_TOO_SHORT", {
          defaultValue: "Password must be at least 8 characters",
        }),
        "error"
      );
      return;
    }

    if (fpNewPassword !== fpConfirmPassword) {
      pushToast(
        t("messages.PASSWORDS_DO_NOT_MATCH", { defaultValue: "Passwords do not match" }),
        "error"
      );
      return;
    }

    setFpLoading(true);

    try {
      await forgotPassword({
        phone: fpPhone,
        new_password: fpNewPassword,
        confirm_password: fpConfirmPassword,
      });

      pushToast(
        t("messages.PASSWORD_RESET_SUCCESS", { defaultValue: "Password updated successfully" }),
        "success"
      );

      onClose();
      navigate("/login", { replace: true });
    } catch (err) {
      // Handle both detail string and detail array (FastAPI validation errors)
      const detail = err?.response?.data?.detail;
      let message;

      if (Array.isArray(detail)) {
        message = detail.map((d) => d.msg).join(", ");
      } else if (typeof detail === "string") {
        message = detail;
      } else {
        message = t("messages.GENERIC_ERROR");
      }

      pushToast(message, "error");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fp-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fp-modal">
        <h2 className="fp-title">
          {t("auth.forgot_password_title")}
        </h2>
        <p className="fp-subtitle">
          {t("auth.forgot_password_subtitle",

          )}
        </p>

        <form onSubmit={handleForgotSubmit} className="auth-form">
          <Input
            label={t("auth.phone")}
            type="tel"
            inputMode="tel"
            placeholder={t("auth.phone_placeholder")}
            value={fpPhone}
            onChange={(e) => setFpPhone(e.target.value)}
            required
          />

          <Input
            label={t("auth.new_password")}
            type="password"
            placeholder={t("auth.new_password_placeholder")}
            value={fpNewPassword}
            onChange={(e) => setFpNewPassword(e.target.value)}
            required
          />

          <Input
            label={t("auth.confirm_password")}
            type="password"
            placeholder={t("auth.confirm_password_placeholder")}
            value={fpConfirmPassword}
            onChange={(e) => setFpConfirmPassword(e.target.value)}
            required
          />

          <div className="fp-actions">
            <Button
              type="button"
              variant="secondary"
              block
              onClick={onClose}
              disabled={fpLoading}
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Button>

            <Button type="submit" variant="primary" block disabled={fpLoading}>
              {fpLoading
                ? t("common.loading")
                : t("auth.reset_password_button")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const { pushToast } = useApp();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const switchLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "mr" : "en");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone || !password) {
      setError(t("messages.VALIDATION_ERROR"));
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({ phone, password });

      saveAuth(res.access_token, res.user);

      pushToast(t("messages.AUTH_LOGIN_SUCCESS"), "success");

      switch (res.user.role) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "farmer":
          navigate("/farmer/dashboard", { replace: true });
          break;
        case "merchant":
          navigate("/merchant/marketplace", { replace: true });
          break;
        default:
          navigate("/login", { replace: true });
      }
    } catch (err) {
      const code =
        err?.response?.data?.message || err?.message || "GENERIC_ERROR";

      setError(t(`messages.${code}`, { defaultValue: t("messages.GENERIC_ERROR") }));
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="auth-footer">
      {t("auth.no_account")}{" "}
      <Link to="/signup">{t("auth.signup_link")}</Link>
    </div>
  );

  return (
    <>
      <div id="login">
        <AuthShell
          title={t("auth.login_title")}
          subtitle={t("auth.login_subtitle")}
          footer={footer}
        >
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            {/* Phone */}
            <Input
              label={t("auth.phone")}
              type="tel"
              inputMode="tel"
              placeholder={t("auth.phone_placeholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            {/* Password */}
            <Input
              label={t("auth.password")}
              type="password"
              placeholder={t("auth.password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Forgot Password Link */}
            <div className="fp-link-wrapper">
              <button
                type="button"
                className="fp-link"
                onClick={() => setShowForgotPassword(true)}
              >
                {t("auth.forgot_password")}
              </button>
            </div>

            {/* Login Button */}
            <Button type="submit" variant="primary" block disabled={loading}>
              {loading ? t("common.loading") : t("auth.login_button")}
            </Button>
          </form>
        </AuthShell>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPassword(false)}
          pushToast={pushToast}
          t={t}
        />
      )}
    </>
  );
}