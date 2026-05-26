import "./Rental.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useTranslation,
} from "react-i18next";

import {
  useApp,
} from "../../context/AppContext";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  RentalsService,
} from "../../services/rentalsService";

import {
  getErrorMessage,
} from "../../utils/errorHandler";

import Card
from "../../components/Card";

import SearchInput
from "../../components/SearchInput";

import Select
from "../../components/Select";

import RentalCard
from "../../components/rentals/RentalCard";

import ListingEmpty
from "../../components/marketplace/ListingEmptyState";

import ListingSkeleton
from "../../components/marketplace/ListingSkeleton";

export default function Rentals() {

  const navigate =
    useNavigate();

  const { t } =
    useTranslation();

  const {
    pushToast,
  } = useApp();

  const {
    isAuthenticated,
    isFarmer,
  } = useAuth();

  const [
    rentals,
    setRentals,
  ] =
    useState([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    sortBy,
    setSortBy,
  ] =
    useState("latest");

  const [
    district,
    setDistrict,
  ] =
    useState("");

  const [
    stateFilter,
    setStateFilter,
  ] =
    useState("");

  const [
    availability,
    setAvailability,
  ] =
    useState("");

  const [
    showAll,
    setShowAll,
  ] =
    useState(false);

  /* ==========================================
      FETCH RENTALS
  ========================================== */

  async function
  fetchRentals() {

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

          ? await RentalsService
              .getRentals(
                params
              )

          : await RentalsService
              .getPublicRentals(
                params
              );

      setRentals(
        response
          ?.data || []
      );

    } catch (
      error
    ) {

      pushToast(

        getErrorMessage(
          error
        ) ||

        t(
          "rentals.failedToLoad"
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

    fetchRentals();

  }, [search]);

  /* ==========================================
      FILTERS + SORT
  ========================================== */

  const filteredRentals =
    useMemo(() => {

      let data =
        [...rentals];

      if (
        district
      ) {

        data =
          data.filter(
            (
              item
            ) =>

              item
                ?.district
                ?.toLowerCase()
                ===
              district
                .toLowerCase()
          );
      }

      if (
        stateFilter
      ) {

        data =
          data.filter(
            (
              item
            ) =>

              item
                ?.state
                ?.toLowerCase()
                ===
              stateFilter
                .toLowerCase()
          );
      }

      if (
        availability
      ) {

        data =
          data.filter(
            (
              item
            ) =>

              String(
                item
                  .is_available
              ) ===
              availability
          );
      }

      switch (
        sortBy
      ) {

        case
          "oldest":

          data.sort(
            (
              a,
              b
            ) =>

              new Date(
                a.created_at
              ) -

              new Date(
                b.created_at
              )
          );

          break;

        case
          "price-low":

          data.sort(
            (
              a,
              b
            ) =>

              (
                a.price_per_day ||
                a.price_per_hour ||
                0
              ) -

              (
                b.price_per_day ||
                b.price_per_hour ||
                0
              )
          );

          break;

        case
          "price-high":

          data.sort(
            (
              a,
              b
            ) =>

              (
                b.price_per_day ||
                b.price_per_hour ||
                0
              ) -

              (
                a.price_per_day ||
                a.price_per_hour ||
                0
              )
          );

          break;

        default:

          data.sort(
            (
              a,
              b
            ) =>

              new Date(
                b.created_at
              ) -

              new Date(
                a.created_at
              )
          );
      }

      return data;

    }, [

      rentals,
      district,
      stateFilter,
      availability,
      sortBy,
    ]);

  const visibleRentals =

    !isAuthenticated &&
    !showAll

      ? filteredRentals.slice(
          0,
          8
        )

      : filteredRentals;

  const districtOptions =
    [
      ...new Set(
        rentals
          .map(
            (
              r
            ) =>
              r.district
          )
          .filter(Boolean)
      ),
    ];

  const stateOptions =
    [
      ...new Set(
        rentals
          .map(
            (
              r
            ) =>
              r.state
          )
          .filter(Boolean)
      ),
    ];

  return (

    <div className="
      marketplace-page
    ">

      {/* HEADER */}

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
              "rentals.marketplace"
            )}

          </h1>

          <p className="
            marketplace-public-subtitle
          ">

            {t(
              "rentals.marketplaceSubtitle"
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

      {/* FARMER TABS */}

      {isAuthenticated &&
        isFarmer && (

        <div className="
          marketplace-tabs
        ">

          <button
            className="
              marketplace-tab
              marketplace-tab--active
            "
          >
            {t(
              "rentals.marketplace"
            )}
          </button>

          <button
            className="
              marketplace-tab
            "
            onClick={() =>
              navigate(
                "/farmer/rentals/my-rentals"
              )
            }
          >
            {t(
              "myRentals.myRentals"
            )}
          </button>

        </div>

      )}

      {/* FILTERS */}

      <Card>

        <div className="
          listing-filters
        ">

          <SearchInput
            placeholder={
              t(
                "rentals.searchPlaceholder"
              )
            }
            value={
              search
            }
            onChange={(
              e
            ) =>
              setSearch(
                e.target.value
              )
            }
          />

          <Select
            value={
              district
            }
            onChange={(
              e
            ) =>
              setDistrict(
                e.target.value
              )
            }
          >
            <option value="">
              {t(
                "rentals.allDistricts"
              )}
            </option>

            {districtOptions.map(
              (
                item
              ) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </Select>

        </div>

      </Card>

      {/* GRID */}

      {loading ? (

        <ListingSkeleton
          count={8}
        />

      ) : !filteredRentals
          .length ? (

        <ListingEmpty
          title={
            t(
              "rentals.noRentalsFound"
            )
          }
          subtitle={
            t(
              "rentals.tryChangingFilters"
            )
          }
        />

      ) : (

        <>

          <div className="
            marketplace-grid
          ">

            {visibleRentals.map(
              (
                rental
              ) => (

                <RentalCard
                  key={
                    rental.id
                  }

                  rental={
                    rental
                  }

                  isOwner={
                    false
                  }

                  onViewDetails={() => {

                    if (
                      rental?.is_locked
                    ) {

                      pushToast(
                        t(
                          "authMessages.loginToViewRental"
                        ),
                        "error"
                      );

                      navigate(
                        "/login"
                      );

                      return;
                    }

                    navigate(
                      `/farmer/rentals/${rental.id}`
                    );
                  }}
                />
              )
            )}

          </div>

          {!isAuthenticated &&
            filteredRentals.length > 8 && (

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

    </div>
  );
}