import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import {
  IconDashboard, IconFarm, IconCrop, IconExpense,
<<<<<<< HEAD
  IconRental, IconUsers, IconAdmin, IconLogout,IconFertilizer,IconIncome,
=======
  IconRental, IconUsers, IconAdmin, IconLogout,IconFertilizer,IconPesticide,
>>>>>>> 8965bd3 (Fertilizers and Pesticides created)
} from "./Icons";

const userItems = [
  {
    to: "/farmer/dashboard",
    labelKey: "nav.dashboard",
    icon: <IconDashboard className="sidebar__icon" />
  },

  {
    to: "/farmer/farms",
    labelKey: "nav.farms",
    icon: <IconFarm className="sidebar__icon" />
  },

  {
    to: "/farmer/crops",
    labelKey: "nav.crops",
    icon: <IconCrop className="sidebar__icon" />
  },
  {
    to: "/farmer/fertilizers",
    labelKey: "nav.fertilizers",
    icon: <IconFertilizer className="sidebar__icon" />
  },
  {
<<<<<<< HEAD
    to: "/farmer/incomes",
    labelKey: "nav.incomes",
    icon: <IconIncome className="sidebar__icon" />
  },
=======
  to: "/farmer/pesticides",
  labelKey: "nav.pesticides",
  icon: <IconPesticide className="sidebar__icon" />
 },
>>>>>>> 8965bd3 (Fertilizers and Pesticides created)
  {
    to: "/farmer/expenses",
    labelKey: "nav.expenses",
    icon: <IconExpense className="sidebar__icon" />
  },

  {
    to: "/farmer/rental",
    labelKey: "nav.rental",
    icon: <IconRental className="sidebar__icon" />
  },
];
const adminItems = [
  { to: "/admin/dashboard", labelKey: "nav.admin_dashboard",  icon: <IconDashboard className="sidebar__icon" /> },
  { to: "/admin/users",     labelKey: "nav.users",             icon: <IconUsers     className="sidebar__icon" /> },
  { to: "/admin/farms",     labelKey: "nav.admin_farms",       icon: <IconFarm      className="sidebar__icon" /> },
  { to: "/admin/crops",     labelKey: "nav.admin_crops",       icon: <IconCrop      className="sidebar__icon" /> },
  { to: "/admin/expenses",  labelKey: "nav.admin_expenses",    icon: <IconExpense   className="sidebar__icon" /> },
  { to: "/admin/equipment", labelKey: "nav.admin_equipment",   icon: <IconRental    className="sidebar__icon" /> },
];

export default function Sidebar({ onNavigate }) {
  const { t } = useTranslation();
  const { logout, user, isAdmin } = useAuth();
  const { pushToast } = useApp();
  const location = useLocation();
  const items = location.pathname.startsWith("/admin") ? adminItems : userItems;

  const handleLogout = () => {
    logout();
    pushToast(t("messages.AUTH_LOGOUT_SUCCESS"));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">SX</div>
        <div className="sidebar__brand-text">
          <span className="sidebar__title">{t("app.name")}</span>
          <span className="sidebar__tagline">{t("app.tagline")}</span>
        </div>
      </div>

      <div className="sidebar__section">
        {isAdmin ? (
          <span><IconAdmin size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />{t("nav.admin_section")}</span>
        ) : t("topbar.user_role")}
      </div>

      <nav className="sidebar__nav">
        {items.map((item) => (
          <NavLink
            key={item.to} to={item.to} onClick={onNavigate}
            className={({ isActive }) => isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"}
          >
            {item.icon}<span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__user">
        <div className="sidebar__user-info">
          <span className="sidebar__user-name">{user?.name}</span>
          <span className="sidebar__user-role">{isAdmin ? t("topbar.admin_role") : t("topbar.user_role")}</span>
        </div>
        <button className="sidebar__logout-btn" onClick={handleLogout} title={t("auth.logout")}>
          <IconLogout size={16} />
        </button>
      </div>

      <div className="sidebar__footer">{t("footer.copyright")}</div>
    </aside>
  );
}
