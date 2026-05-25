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
  RentalsService,
} from "../../services/rentalsService";

import {
  getErrorMessage,
} from "../../utils/errorHandler";

import PageHeader
from "../../components/PageHeader";

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

  /* ==========================================
      STATE
  ========================================== */

  const [rentals,
    setRentals] =
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

  const [district,
    setDistrict] =
    useState("");

  const [stateFilter,
    setStateFilter] =
    useState("");

  const [availability,
    setAvailability] =
    useState("");

  /* ==========================================
      FETCH RENTALS
  ========================================== */

  async function
    fetchRentals() {

    try {

      setLoading(
        true
      );

      const response =
        await RentalsService
          .getRentals({

            search,

            exclude_my_listings:
              true,
          });

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

        "Failed to load rentals",

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

      /* DISTRICT */

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

      /* STATE */

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

      /* AVAILABILITY */

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

      /* SORT */

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

  /* ==========================================
      FILTER OPTIONS
  ========================================== */

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

  /* ==========================================
      RENDER
  ========================================== */

  return (

    <div className="
      marketplace-page
    ">

      <PageHeader
        title="
          Rental Marketplace
        "
        subtitle="
          Rent farming
          equipment near
          you
        "
      />

      {/* TABS */}

      <div className="
        marketplace-tabs
      ">

        <button
          className="
            marketplace-tab
            marketplace-tab--active
          "
        >
          Rental Marketplace
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
          My Rentals
        </button>

      </div>

      {/* FILTERS */}

      <Card>

        <div className="
          listing-filters
        ">

          <SearchInput
            placeholder="
              Search equipment,
              village,
              taluka,
              district...
            "
            value={
              search
            }
            onChange={(
              e
            ) =>
              setSearch(
                e.target
                  .value
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
                e.target
                  .value
              )
            }
          >

            <option value="">
              All Districts
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

          <Select
            value={
              stateFilter
            }
            onChange={(
              e
            ) =>
              setStateFilter(
                e.target
                  .value
              )
            }
          >

            <option value="">
              All States
            </option>

            {stateOptions.map(
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

          <Select
            value={
              availability
            }
            onChange={(
              e
            ) =>
              setAvailability(
                e.target
                  .value
              )
            }
          >

            <option value="">
              Availability
            </option>

            <option value="true">
              Available
            </option>

            <option value="false">
              Unavailable
            </option>

          </Select>

          <Select
            value={
              sortBy
            }
            onChange={(
              e
            ) =>
              setSortBy(
                e.target
                  .value
              )
            }
          >

            <option value="latest">
              Latest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="price-low">
              Price Low → High
            </option>

            <option value="price-high">
              Price High → Low
            </option>

          </Select>

        </div>

      </Card>

      {/* RENTALS GRID */}

      {loading ? (

        <ListingSkeleton
          count={6}
        />

      ) : !filteredRentals
          .length ? (

        <ListingEmpty
          title="
            No Rentals Found
          "
          subtitle="
            Try changing filters
          "
        />

      ) : (

        <div className="
          marketplace-grid
        ">

          {filteredRentals.map(
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

                onViewDetails={() =>
                  navigate(
                    `/farmer/rentals/${rental.id}`,
                    {
                      state: {
                        from:
                          "marketplace",
                      },
                    }
                  )
                }
              />
            )
          )}

        </div>
      )}

    </div>
  );
} 