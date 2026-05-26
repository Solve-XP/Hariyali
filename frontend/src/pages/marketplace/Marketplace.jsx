import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useTranslation,
} from "react-i18next";

import "./Marketplace.css";

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

  const [
    listings,
    setListings,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    sortBy,
    setSortBy,
  ] = useState("latest");

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(null);

  const [
    showAll,
    setShowAll,
  ] = useState(false);

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

  /* ==========================================
      FETCH
  ========================================== */

  async function
  fetchListings() {

    try {

      setLoading(
        true
      );

      const params = {
        search,
      };

      if (
        isAuthenticated &&
        isFarmer
      ) {

        params.exclude_my_listings =
          true;
      }

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

  /* ==========================================
      PUBLIC LIMIT
  ========================================== */

  const visibleListings =

    !isAuthenticated &&
    !showAll

      ? listings.slice(
          0,
          8
        )

      : listings;

  return (

    <div className="
      marketplace-page
    ">

      {/* ======================================
          PUBLIC HEADER
      ====================================== */}

      <div className="
        marketplace-public-header
      ">

        <div className="
          marketplace-public-content
        ">

          <h1 className="
            marketplace-public-title
          ">

            {t(
              "marketplace.marketplace"
            )}

          </h1>

          <p className="
            marketplace-public-subtitle
          ">

            {t(
              "marketplace.browseListings"
            )}

          </p>

        </div>

        {!isAuthenticated && (

          <div className="
            marketplace-auth-actions
          ">

            <button
              className="
                marketplace-login-btn
              "
              onClick={() =>
                navigate(
                  "/login"
                )
              }
            >

              {t(
                "auth.login"
              )}

            </button>

            <button
              className="
                marketplace-signup-btn
              "
              onClick={() =>
                navigate(
                  "/signup"
                )
              }
            >

              {t(
                "auth.signup"
              )}

            </button>

          </div>

        )}

      </div>

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
          count={8}
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

        <>

          <ListingGrid
            listings={
              visibleListings
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

              if (
                listing?.is_locked
              ) {

                pushToast(
                  t(
                    "authMessages.loginToViewListing"
                  ),
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

          {!isAuthenticated &&
            listings.length > 8 && (

            <div className="
              marketplace-view-all
            ">

              <button
                className="
                  marketplace-view-all-btn
                "
                onClick={() =>
                  setShowAll(
                    !showAll
                  )
                }
              >

                {showAll

                  ? t(
                      "marketplace.showLess"
                    )

                  : t(
                      "marketplace.viewAll"
                    )}

              </button>

            </div>

          )}

        </>

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