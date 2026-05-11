import "./AdminLogin.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { IconAdmin } from "../components/Icons";

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const { pushToast } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) { setError(t("messages.VALIDATION_ERROR")); return; }
    setLoading(true);
    try {
      const res = await AuthAPI.adminLogin({ username, password });
      saveAuth(res.access_token, res.user);
      pushToast(t("messages.AUTH_LOGIN_SUCCESS"));
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const code = err.message || "GENERIC_ERROR";
      setError(t(`messages.${code}`, { defaultValue: t("messages.GENERIC_ERROR") }));
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      {t("auth.have_account")}{" "}
      <Link to="/login">{t("auth.login_link")}</Link>
    </>
  );

  return (
    <AuthShell title={t("auth.admin_login_title")} subtitle={t("auth.admin_login_subtitle")} footer={footer}>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <div className="admin-login-form__badge">
          <IconAdmin size={16} />
          <span>Admin Portal</span>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <Input label={t("auth.admin_id")} type="text" placeholder={t("auth.admin_id_placeholder")}
          value={username} onChange={(e) => setUsername(e.target.value)} required />
        <Input label={t("auth.password")} type="password" placeholder={t("auth.password_placeholder")}
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" variant="primary" block disabled={loading}>
          {loading ? t("common.loading") : t("auth.login_button")}
        </Button>
        <div className="admin-login-form__demo">
          {t("auth.admin_demo")}: <code>admin</code> / <code>admin123</code>
        </div>
      </form>
    </AuthShell>
  );
}
