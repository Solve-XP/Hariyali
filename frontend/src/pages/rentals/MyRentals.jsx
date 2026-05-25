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

        t(
          "myRentals.failedToLoad"
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

  }, []);

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
        t(
          "myRentals.deletedSuccess"
        ),
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

        t(
          "myRentals.failedToDelete"
        ),

        "error"
      );
    }
  }

  return (

    <div className="
      marketplace-page
    ">

      <PageHeader
        title={
          t(
            "myRentals.myRentals"
          )
        }
        subtitle={
          t(
            "myRentals.manageEquipment"
          )
        }
        action={

          <Button
            onClick={() =>
              navigate(
                "/farmer/rentals/create"
              )
            }
          >
            {t(
              "myRentals.addRental"
            )}
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
          {t(
            "myRentals.rentalMarketplace"
          )}
        </button>

        <button
          className="
            marketplace-tab
            marketplace-tab--active
          "
        >
          {t(
            "myRentals.myRentals"
          )}
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
          title={
            t(
              "myRentals.noRentals"
            )
          }
          subtitle={
            t(
              "myRentals.createFirstRental"
            )
          }
          action={

            <Button
              onClick={() =>
                navigate(
                  "/farmer/rentals/create"
                )
              }
            >
              {t(
                "myRentals.addRental"
              )}
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

      <ConfirmDialog
        open={
          deleteOpen
        }
        title={
          t(
            "myRentals.deleteRental"
          )
        }
        message={`
          ${t(
            "myRentals.deleteConfirm"
          )}
          "${selectedRental?.equipment_name}"?
        `}
        confirmText={
          t(
            "common.delete"
          )
        }
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