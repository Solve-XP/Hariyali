import "./SignUp.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const { pushToast } = useApp();

  const [form, setForm] = useState({ name: "", phone: "", password: "", confirm: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, phone, password, confirm } = form;
    if (!name || !phone || !password || !confirm) { setError(t("messages.VALIDATION_ERROR")); return; }
    if (password.length < 6) { setError(t("auth.password_too_short")); return; }
    if (password !== confirm) { setError(t("auth.password_mismatch")); return; }
    setLoading(true);
    try {
      const res = await AuthAPI.signup({ name, phone, password });
      saveAuth(res.access_token, res.user);
      pushToast(t("messages.AUTH_SIGNUP_SUCCESS"));
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
      {t("auth.have_account")}{" "}
      <Link to="/login">{t("auth.login_link")}</Link>
    </>
  );

  return (
    <AuthShell title={t("auth.signup_title")} subtitle={t("auth.signup_subtitle")} footer={footer}>
      <form onSubmit={handleSubmit} className="auth-form signup-form">
        {error && <div className="auth-error">{error}</div>}
        <Input label={t("auth.name")} type="text" placeholder={t("auth.name_placeholder")}
          value={form.name} onChange={set("name")} required />
        <Input label={t("auth.phone")} type="tel" inputMode="tel" placeholder={t("auth.phone_placeholder")}
          value={form.phone} onChange={set("phone")} required />
        <div className="signup-form__password-row">
          <Input label={t("auth.password")} type="password" placeholder={t("auth.password_placeholder")}
            value={form.password} onChange={set("password")} required />
          <Input label={t("auth.confirm_password")} type="password" placeholder={t("auth.password_placeholder")}
            value={form.confirm} onChange={set("confirm")} required />
        </div>
        <Button type="submit" variant="primary" block disabled={loading}>
          {loading ? t("common.loading") : t("auth.signup_button")}
        </Button>
      </form>
    </AuthShell>
  );
}
