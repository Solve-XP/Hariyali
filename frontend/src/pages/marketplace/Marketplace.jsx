import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import "./Marketplace.css";

import PageHeader
from "../../components/PageHeader";

import ListingGrid
from "../../components/marketplace/ListingGrid";

import ListingFilters
from "../../components/marketplace/ListingFilters";

import ListingSkeleton
from "../../components/marketplace/ListingSkeleton";

import ListingEmptyState
from "../../components/marketplace/ListingEmptyState";

import MarketplaceTabs
from "../../components/marketplace/MarketplaceTabs";

import ImageViewer
from "../../components/ImageViewer";

import {
  MarketplaceService,
} from "../../services/marketplaceService";

import {
  getErrorMessage,
} from "../../utils/errorHandler";

import {
  useApp,
} from "../../context/AppContext";

import {
  useAuth,
} from "../../context/AuthContext";

export default function Marketplace() {

  const { t } =
    useTranslation();

  const navigate =
    useNavigate();

  const {
    pushToast,
  } = useApp();

  const {
  isFarmer,
  isAuthenticated,
} = useAuth();

  const [listings,
    setListings] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [sortBy,
    setSortBy] =
    useState("latest");

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(null);

  /* ==========================================
      SORT
  ========================================== */

  function applySorting(
    data = []
  ) {

    const sorted =
      [...data];

    switch (
      sortBy
    ) {

      case
        "price-low":

        sorted.sort(
          (a, b) =>
            (a.expected_price || 0) -
            (b.expected_price || 0)
        );

        break;

      case
        "price-high":

        sorted.sort(
          (a, b) =>
            (b.expected_price || 0) -
            (a.expected_price || 0)
        );

        break;

      case
        "oldest":

        sorted.sort(
          (a, b) =>
            new Date(
              a.created_at
            ) -
            new Date(
              b.created_at
            )
        );

        break;

      default:

        sorted.sort(
          (a, b) =>
            new Date(
              b.created_at
            ) -
            new Date(
              a.created_at
            )
        );
    }

    return sorted;
  }

  async function
  fetchListings() {

  try {

    setLoading(
      true
    );

    const params = {
      search,
    };

    /* ======================================
       FARMER EXCLUDE OWN
    ====================================== */

    if (
      isAuthenticated &&
      isFarmer
    ) {

      params.exclude_my_listings =
        true;
    }

    /* ======================================
       API SWITCH
    ====================================== */

    const response =
      isAuthenticated

        ? await MarketplaceService
            .getListings(
              params
            )

        : await MarketplaceService
            .getPublicListings(
              params
            );

    const data =
      response?.data ||
      [];

    setListings(
      applySorting(
        data
      )
    );

  } catch (
    error
  ) {

    pushToast(

      getErrorMessage(
        error
      ) ||

      t(
        "marketplace.failedToLoad"
      ),

      "error"
    );

  } finally {

    setLoading(
      false
    );
  }
}

  useEffect(() => {

    fetchListings();

  }, [
    search,
    sortBy,
  ]);

  return (

    <div className="
      marketplace-page
    ">

      <PageHeader
        title={
          t(
            "marketplace.marketplace"
          )
        }

        subtitle={
          t(
            "marketplace.browseListings"
          )
        }
      />

      {/* ======================================
          FARMER TABS
      ====================================== */}

      {isAuthenticated &&
        isFarmer && (

        <MarketplaceTabs />

      )}

      {/* ======================================
          FILTERS
      ====================================== */}

      <ListingFilters
        search={
          search
        }

        onSearchChange={
          setSearch
        }

        sortBy={
          sortBy
        }

        onSortChange={
          setSortBy
        }

        showLocationFilters={
          false
        }
      />

      {/* ======================================
          CONTENT
      ====================================== */}

      {loading ? (

        <ListingSkeleton
          count={6}
        />

      ) : !listings
          ?.length ? (

        <ListingEmptyState
          title={
            t(
              "marketplace.noListingsFound"
            )
          }

          subtitle={
            t(
              "marketplace.trySearchFilters"
            )
          }
        />

      ) : (

        <ListingGrid
          listings={
            listings
          }

          type="
            marketplace
          "

          isOwner={
            false
          }

          onViewDetails={(
            listing
          ) => {

            /* ==============================
              PUBLIC LOCK
            =============================== */

            if (
              listing?.is_locked
            ) {

              pushToast(
                t("authMessages.loginToViewListing"),
                "error"
              );

              navigate(
                "/login"
              );

              return;
            }

            navigate(

              `${
                isFarmer
                  ? "/farmer"
                  : "/merchant"
              }/marketplace/${listing.id}`,

              {
                state: {
                  from:
                    "marketplace",
                },
              }
            );
          }}

          onImageClick={(
            image
          ) =>
            setSelectedImage(
              image
            )
          }
        />

      )}

      <ImageViewer
        image={
          selectedImage
        }

        onClose={() =>
          setSelectedImage(
            null
          )
        }
      />

    </div>
  );
}