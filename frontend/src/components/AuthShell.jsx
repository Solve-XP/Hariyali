import "./AuthShell.css";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n/i18n";

export default function AuthShell({ title, subtitle, children, footer }) {
  const { t, i18n } = useTranslation();
  return (
    <div className="auth-shell">
      <div className="auth-shell__lang">
        <div className="lang-toggle" role="group" aria-label={t("topbar.language")}>
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code} type="button"
              className={i18n.language?.startsWith(l.code) ? "lang-toggle__btn lang-toggle__btn--active" : "lang-toggle__btn"}
              onClick={() => i18n.changeLanguage(l.code)}
            >{t(l.labelKey)}</button>
          ))}
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-card__brand">
          <div className="auth-card__logo">SX</div>
          <div>
            <div className="auth-card__brand-name">{t("app.name")}</div>
            <div className="auth-card__brand-tag">{t("app.tagline")}</div>
          </div>
        </div>
        <h2 className="auth-card__title">{title}</h2>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
        <div className="auth-card__body">{children}</div>
        {footer && <div className="auth-card__footer">{footer}</div>}
      </div>
    </div>
  );
}
