import "./Topbar.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { SUPPORTED_LANGUAGES } from "../i18n/i18n";
import { IconMenu } from "./Icons";

const titleByPath = {
  "/dashboard":       "dashboard.title",
  "/farms":           "farms.title",
  "/crops":           "crops.title",
  "/expenses":        "expenses.title",
  "/rental":          "rental.title",
  "/admin/dashboard": "admin.dashboard_title",
  "/admin/users":     "admin.users_title",
  "/admin/farms":     "admin.farms_title",
  "/admin/crops":     "admin.crops_title",
  "/admin/expenses":  "admin.expenses_title",
  "/admin/equipment": "admin.equipment_title",
};

export default function Topbar({ onMenuClick }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const titleKey = titleByPath[location.pathname] || "app.name";
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button type="button" className="topbar__menu-btn" onClick={onMenuClick} aria-label="menu">
          <IconMenu />
        </button>
        <h1 className="topbar__page-title">{t(titleKey)}</h1>
      </div>
      <div className="topbar__right">
        <div className="lang-toggle" role="group" aria-label={t("topbar.language")}>
          {SUPPORTED_LANGUAGES.map((l) => (
            <button key={l.code} type="button"
              className={i18n.language?.startsWith(l.code) ? "lang-toggle__btn lang-toggle__btn--active" : "lang-toggle__btn"}
              onClick={() => i18n.changeLanguage(l.code)}
            >{t(l.labelKey)}</button>
          ))}
        </div>
      </div>
    </header>
  );
}
