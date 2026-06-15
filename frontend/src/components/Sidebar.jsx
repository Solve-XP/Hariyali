import "./Sidebar.css";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import logo from "../assets/logo.png";

import {
  IconDashboard,
  IconFarm,
  IconCrop,
  IconExpense,
  IconRental,
  IconUsers,
  IconAdmin,
  IconLogout,
  IconFertilizer,
  IconIncome,
  IconPesticide,
} from "./Icons";

/* =========================================================
   USER NAVIGATION
========================================================= */

const userItems = [
  {
    to: "/farmer/dashboard",
    labelKey: "nav.dashboard",
    icon: <IconDashboard className="sidebar__icon" />,
  },

  {
    to: "/farmer/farms",
    labelKey: "nav.farms",
    icon: <IconFarm className="sidebar__icon" />,
  },

  {
    to: "/farmer/crops",
    labelKey: "nav.crops",
    icon: <IconCrop className="sidebar__icon" />,
  },

  {
    to: "/farmer/fertilizers",
    labelKey: "nav.fertilizers",
    icon: <IconFertilizer className="sidebar__icon" />,
  },

  {
    to: "/farmer/pesticides",
    labelKey: "nav.pesticides",
    icon: <IconPesticide className="sidebar__icon" />,
  },

  {
    to: "/farmer/incomes",
    labelKey: "nav.incomes",
    icon: <IconIncome className="sidebar__icon" />,
  },

  {
    to: "/farmer/expenses",
    labelKey: "nav.expenses",
    icon: <IconExpense className="sidebar__icon" />,
  },

  {
    to: "/farmer/rentals",
    labelKey: "nav.rental",
    icon: <IconRental className="sidebar__icon" />,
  },
  {
  to: "/farmer/marketplace",
  labelKey: "nav.marketplace",
  icon: (
    <IconCrop
      className="sidebar__icon"
    />
  ),
},
];

/* =========================================================
   ADMIN NAVIGATION
========================================================= */

const adminItems = [
  {
    to: "/admin/dashboard",
    labelKey: "nav.admin_dashboard",
    icon: <IconDashboard className="sidebar__icon" />,
  },

  {
    to: "/admin/users",
    labelKey: "nav.users",
    icon: <IconUsers className="sidebar__icon" />,
  },

  {
    to: "/admin/farms",
    labelKey: "nav.admin_farms",
    icon: <IconFarm className="sidebar__icon" />,
  },

  {
    to: "/admin/crops",
    labelKey: "nav.admin_crops",
    icon: <IconCrop className="sidebar__icon" />,
  },

  {
    to: "/admin/expenses",
    labelKey: "nav.admin_expenses",
    icon: <IconExpense className="sidebar__icon" />,
  },

  {
    to: "/admin/equipment",
    labelKey: "nav.admin_equipment",
    icon: <IconRental className="sidebar__icon" />,
  },
];

/* =========================================================
   MERCHANT NAVIGATION
========================================================= */

const merchantItems = [
  {
    to: "/merchant/marketplace",
    labelKey: "nav.marketplace",
    icon: (
      <IconCrop
        className="sidebar__icon"
      />
    ),
  }
];

/* =========================================================
   COMPONENT
========================================================= */

export default function Sidebar({ onNavigate }) {

  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    logout,
    user,
    isAdmin,
  } = useAuth();

  const { pushToast } = useApp();

  const location = useLocation();

  /* =====================================================
     CURRENT SIDEBAR ITEMS
  ====================================================== */

  const items =
    location.pathname.startsWith("/admin")
      ? adminItems
      : location.pathname.startsWith("/merchant")
        ? merchantItems
        : userItems;

  /* =====================================================
     LOGOUT
  ====================================================== */

  const handleLogout = () => {

    logout();

    pushToast(
      t("messages.AUTH_LOGOUT_SUCCESS")
    );
  };

  /* =====================================================
     PROFILE NAVIGATION
  ====================================================== */

  const handleProfileClick = () => {

    if (
      location.pathname.startsWith("/admin")
    ) {

      navigate("/admin/profile");

    } else if (
      location.pathname.startsWith("/merchant")
    ) {

      navigate("/merchant/profile");

    } else {

      navigate("/farmer/profile");
    }

    if (onNavigate) {
      onNavigate();
    }
  };

  /* =====================================================
     USER INITIAL
  ====================================================== */

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (

    <aside className="sidebar">

      {/* =================================================
          BRAND
      ================================================== */}

      <div className="sidebar__brand">

        <img
          src={logo}
          alt="Hariyali Logo"
          className="sidebar__logo-image"
        />

        <span className="sidebar__tagline">
          {t("app.tagline")}
        </span>

      </div>

      {/* =================================================
          SECTION LABEL
      ================================================== */}

      <div className="sidebar__section">

        {isAdmin ? (

          <span>

            <IconAdmin
              size={12}
              style={{
                verticalAlign: "middle",
                marginRight: 4,
              }}
            />

            {t("nav.admin_section")}

          </span>

        ) : (

          t("topbar.user_role")

        )}

      </div>

      {/* =================================================
          NAVIGATION
      ================================================== */}

      <nav className="sidebar__nav">

        {items.map((item) => (

          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>

              isActive
                ? "sidebar__link sidebar__link--active"
                : "sidebar__link"

            }
          >

            {item.icon}

            <span>
              {t(item.labelKey)}
            </span>

          </NavLink>

        ))}

      </nav>

      {/* =================================================
          USER PROFILE
      ================================================== */}

      <div className="sidebar__user">

        {/* PROFILE CLICKABLE AREA */}

        <div
          className="sidebar__user-info sidebar__user-clickable"
          onClick={handleProfileClick}
          title="Open Profile"
        >

          {/* USER AVATAR */}

          <div className="sidebar__user-avatar">

            {userInitial}

          </div>

          {/* USER DETAILS */}

          <div className="sidebar__user-details">

            <span className="sidebar__user-name">

              {user?.name || "User"}

            </span>

            <span className="sidebar__user-role">

              {user?.role || "Farmer"}

            </span>

          </div>

        </div>

        {/* LOGOUT BUTTON */}

        <button
          className="sidebar__logout-btn"
          onClick={handleLogout}
          title={t("auth.logout")}
        >

          <IconLogout size={16} />

        </button>

      </div>

      {/* =================================================
          FOOTER
      ================================================== */}

      <div className="sidebar__footer">

        {t("footer.copyright")}

      </div>

    </aside>
  );
}