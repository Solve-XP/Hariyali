
import "./MarketplaceTabs.css";

import { useTranslation } from "react-i18next";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function MarketplaceTabs() {

  const { t } =
    useTranslation();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const isMarketplace =
    location.pathname ===
    "/farmer/marketplace";

  const isMyListings =
    location.pathname ===
    "/farmer/marketplace/my-listings";

  return (

    <div className="
      marketplace-tabs
    ">

      <button
        className={`
          marketplace-tab
          ${
            isMarketplace
              ? "marketplace-tab--active"
              : ""
          }
        `}
        onClick={() =>
          navigate(
            "/farmer/marketplace"
          )
        }
      >
        {t(
          "marketplace.marketplace"
        )}
      </button>

      <button
        className={`
          marketplace-tab
          ${
            isMyListings
              ? "marketplace-tab--active"
              : ""
          }
        `}
        onClick={() =>
          navigate(
            "/farmer/marketplace/my-listings"
          )
        }
      >
        {t(
          "marketplace.myListings"
        )}
      </button>

    </div>
  );
}