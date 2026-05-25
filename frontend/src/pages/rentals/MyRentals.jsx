import "./Rental.css";

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

import Button
from "../../components/Button";

import ConfirmDialog
from "../../components/ConfirmDialog";

import RentalCard
from "../../components/rentals/RentalCard";

import ListingEmpty
from "../../components/marketplace/ListingEmptyState";

import ListingSkeleton
from "../../components/marketplace/ListingSkeleton";

export default function MyRentals() {

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

  const [selectedRental,
    setSelectedRental] =
    useState(null);

  const [deleteOpen,
    setDeleteOpen] =
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

      const response =
        await RentalsService
          .getMyRentals();

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

  }, []);

  /* ==========================================
      DELETE
  ========================================== */

  async function
    handleDelete() {

    if (
      !selectedRental
    ) return;

    try {

      await RentalsService
        .deleteRental(
          selectedRental.id
        );

      pushToast(
        "Rental deleted successfully",
        "success"
      );

      setDeleteOpen(
        false
      );

      setSelectedRental(
        null
      );

      fetchRentals();

    } catch (
      error
    ) {

      pushToast(

        getErrorMessage(
          error
        ) ||

        "Failed to delete rental",

        "error"
      );
    }
  }

  /* ==========================================
      RENDER
  ========================================== */

  return (

    <div className="
      marketplace-page
    ">

      <PageHeader
        title="
          My Rentals
        "
        subtitle="
          Manage your
          equipment listings
        "
        action={

          <Button
            onClick={() =>
              navigate(
                "/farmer/rentals/create"
              )
            }
          >
            + Add Rental
          </Button>

        }
      />

      {/* TABS */}

      <div className="
        marketplace-tabs
      ">

        <button
          className="
            marketplace-tab
          "
          onClick={() =>
            navigate(
              "/farmer/rentals"
            )
          }
        >
          Rental Marketplace
        </button>

        <button
          className="
            marketplace-tab
            marketplace-tab--active
          "
        >
          My Rentals
        </button>

      </div>

      {/* GRID */}

      {loading ? (

        <ListingSkeleton
          count={6}
        />

      ) : !rentals
          .length ? (

        <ListingEmpty
          title="
            No Rentals Yet
          "
          subtitle="
            Create your first
            rental listing
          "
          action={

            <Button
              onClick={() =>
                navigate(
                  "/farmer/rentals/create"
                )
              }
            >
              Add Rental
            </Button>

          }
        />

      ) : (

        <div className="
          marketplace-grid
        ">

          {rentals.map(
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
                  true
                }

                onViewDetails={() =>
                  navigate(
                    `/farmer/rentals/${rental.id}`,
                    {
                      state: {
                        from:
                          "my-rentals",
                      },
                    }
                  )
                }

                onEdit={() =>
                  navigate(
                    `/farmer/rentals/edit/${rental.id}`
                  )
                }

                onDelete={() => {

                  setSelectedRental(
                    rental
                  );

                  setDeleteOpen(
                    true
                  );
                }}
              />
            )
          )}

        </div>
      )}

      {/* DELETE */}

      <ConfirmDialog
        open={
          deleteOpen
        }
        title="
          Delete Rental
        "
        message={`
          Are you sure
          you want to delete
          "${selectedRental?.equipment_name}"?
        `}
        confirmText="
          Delete
        "
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setDeleteOpen(
            false
          )
        }
      />

    </div>
  );
}