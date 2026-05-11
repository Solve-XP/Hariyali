import "./Login.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const { pushToast } = useApp();
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!phone || !password) { setError(t("messages.VALIDATION_ERROR")); return; }
    setLoading(true);
    try {
      const res = await AuthAPI.login({ phone, password });
      saveAuth(res.access_token, res.user);
      pushToast(t("messages.AUTH_LOGIN_SUCCESS"));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const code = err.message || "GENERIC_ERROR";
      setError(t(`messages.${code}`, { defaultValue: t("messages.GENERIC_ERROR") }));
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      {t("auth.no_account")}{" "}
      <Link to="/signup">{t("auth.signup_link")}</Link>
      {" · "}
      <Link to="/admin-login">{t("auth.admin_login_title")}</Link>
    </>
  );

  return (
    <AuthShell title={t("auth.login_title")} subtitle={t("auth.login_subtitle")} footer={footer}>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        <Input label={t("auth.phone")} type="tel" inputMode="tel" placeholder={t("auth.phone_placeholder")}
          value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <Input label={t("auth.password")} type="password" placeholder={t("auth.password_placeholder")}
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" variant="primary" block disabled={loading}>
          {loading ? t("common.loading") : t("auth.login_button")}
        </Button>
        <div className="login__demo-hint">
          {t("auth.farmer_demo")}: <code>9876543210</code> / <code>farmer123</code>
        </div>
      </form>
    </AuthShell>
  );
}
