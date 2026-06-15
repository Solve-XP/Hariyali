import "./AuthShell.css";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SUPPORTED_LANGUAGES } from "../i18n/i18n";
import farmBg from "../assets/farm-bg.jpg";
import { ShieldCheck, Sprout, Users, Droplets, BarChart3, Tractor, Store } from "lucide-react";
import logo from "../assets/logo.png";

export default function AuthShell({ title, subtitle, children, footer }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const langToggle = (
    <div className="auth-shell__lang">
      <div className="lang-toggle" role="group" aria-label={t("topbar.language")}>
        {SUPPORTED_LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            className={
              i18n.language?.startsWith(l.code)
                ? "lang-toggle__btn lang-toggle__btn--active"
                : "lang-toggle__btn"
            }
            onClick={() => i18n.changeLanguage(l.code)}
          >
            {t(l.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="auth-shell">

      {/* Desktop background */}
      <img src={farmBg} alt="Farm Background" className="auth-bg-image" />
      <div className="auth-shell__overlay" />

      {/* Left hero (desktop) / Top bar (mobile) */}
      <div className="auth-shell__hero">

        {/* Brand row: logo + name | lang toggle (mobile only via CSS) */}
        <div className="auth-shell__brand">
          <div className="auth-shell__brand-identity">
            <img
              src={logo}
              alt="Hariyali"
              className="auth-shell__main-logo"
            />
            <p>{t("app.tagline")}</p>
          </div>
          {/* Shown on mobile via CSS, hidden on desktop via CSS */}
          {langToggle}
        </div>

        {/* Desktop content */}
        <div className="auth-shell__content">
          <h1>{t("hero.title")}</h1>
          <p>{t("hero.subtitle")}</p>
          <div className="auth-shell__features">
            <div className="feature-item"><Sprout size={28} /><span>{t("hero.crop")}</span></div>
            <div className="feature-item"><Users size={28} /><span>{t("hero.labor")}</span></div>
            <div className="feature-item"><Droplets size={28} /><span>{t("hero.irrigation")}</span></div>
            <div className="feature-item"><BarChart3 size={28} /><span>{t("hero.analytics")}</span></div>
          </div>
        </div>

        {/* CTA buttons — desktop and mobile */}
        <div className="auth-shell__cta">
          <button className="auth-shell__cta-btn" onClick={() => navigate("/marketplace")}>
            <Store size={20} />{t("hero.marketplace")}
          </button>
          <button className="auth-shell__cta-btn" onClick={() => navigate("/rentals")}>
            <Tractor size={20} />{t("hero.rentals")}
          </button>
        </div>

      </div>

      {/* Desktop badge */}
      <div className="auth-shell__badge">
        <div className="auth-shell__badge-icon"><ShieldCheck size={34} /></div>
        <div>
          <h4>Secure. Simple. Reliable.</h4>
          <p>Built for farmers, by people who understand farming.</p>
        </div>
      </div>

      {/* Right card (desktop) / Bottom sheet (mobile) */}
      <div className="auth-card-wrapper">

        {/* Shown on desktop via CSS, hidden on mobile via CSS */}
        {langToggle}

        <div className="auth-card">
          <h2 className="auth-card__title">{title}</h2>
          {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
          <div className="auth-card__body">{children}</div>
          {footer && <div className="auth-card__footer">{footer}</div>}
        </div>

      </div>

    </div>
  );
}