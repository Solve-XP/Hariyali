import "./Rental.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Modal
from "../../components/Modal";

import Card
from "../../components/Card";

import Button
from "../../components/Button";

import ConfirmDialog
from "../../components/ConfirmDialog";

import ListingImageSlider
from "../../components/marketplace/ListingImageSlider";

import ListingSellerInfo
from "../../components/marketplace/ListingSellerInfo";

import ListingSkeleton
from "../../components/marketplace/ListingSkeleton";

import ContactActions
from "../../components/ContactActions";

import {
  RentalsService,
} from "../../services/rentalsService";

import {
  useApp,
} from "../../context/AppContext";

import {
  getErrorMessage,
} from "../../utils/errorHandler";

export default function RentalDetails() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const params =
    useParams();

  const id =
    params.id ||
    params.rentalId;

  const {
    pushToast,
  } = useApp();

  /* ==========================================
      STATE
  ========================================== */

  const [rental,
    setRental] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const [deleteOpen,
    setDeleteOpen] =
    useState(false);

  /* ==========================================
      CLOSE
  ========================================== */

  function handleClose() {

    const from =
      location.state
        ?.from;

    if (
      from ===
      "my-rentals"
    ) {

      navigate(
        "/farmer/rentals/my-rentals"
      );

      return;
    }

    navigate(
      "/farmer/rentals"
    );
  }

  /* ==========================================
      FETCH
  ========================================== */

  async function
    fetchRental() {

    try {

      setLoading(
        true
      );

      const response =
        await RentalsService
          .getRentalById(
            id
          );

      setRental(
        response
          ?.data
      );

    } catch (
      error
    ) {

      pushToast(

        getErrorMessage(
          error
        ) ||

        "Failed to load rental",

        "error"
      );

      handleClose();

    } finally {

      setLoading(
        false
      );
    }
  }

  useEffect(() => {

    if (id) {

      fetchRental();
    }

  }, [id]);

  /* ==========================================
      DELETE
  ========================================== */

  async function
    handleDelete() {

    try {

      await RentalsService
        .deleteRental(
          rental.id
        );

      pushToast(
        "Rental deleted successfully",
        "success"
      );

      navigate(
        "/farmer/rentals/my-rentals"
      );

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
      OWNER
  ========================================== */

  const isOwner =
    location.state
      ?.from ===
    "my-rentals";

  /* ==========================================
      RENDER
  ========================================== */

  return (

    <Modal
      open={true}
      onClose={
        handleClose
      }
      title=""
      width="1250px"
    >

      {loading ? (

        <ListingSkeleton
          count={1}
        />

      ) : (

        <div className="
          marketplace-details
        ">

          {/* ==============================
              LEFT
          ============================== */}

          <div className="
            marketplace-details__gallery
          ">

            <ListingImageSlider
              images={
                rental
                  ?.equipment_images ||
                []
              }
            />

          </div>

          {/* ==============================
              RIGHT
          ============================== */}

          <div className="
            marketplace-details__content
          ">

            {/* HEADER */}

            <div className="
              marketplace-details__header
            ">

              <div>

                <h1 className="
                  marketplace-details__title
                ">

                  {
                    rental
                      ?.equipment_name
                  }

                </h1>

              </div>

            </div>

            {/* PRICES */}

            <Card>

              <div className="
                rental-pricing
              ">

                {!!rental
                  ?.price_per_hour && (

                  <div className="
                    rental-price-card
                  ">

                    <strong>
                      ₹
                      {Number(
                        rental
                          .price_per_hour
                      ).toLocaleString()}
                    </strong>

                    <span>
                      / hour
                    </span>

                  </div>
                )}

                {!!rental
                  ?.price_per_day && (

                  <div className="
                    rental-price-card
                  ">

                    <strong>
                      ₹
                      {Number(
                        rental
                          .price_per_day
                      ).toLocaleString()}
                    </strong>

                    <span>
                      / day
                    </span>

                  </div>
                )}

              </div>

            </Card>

            {/* DETAILS */}

            <Card
              style={{
                marginTop:
                  18,
              }}
            >

              <div className="
                marketplace-details__grid
              ">

                <div>

                  <strong>
                    Village
                  </strong>

                  <span>
                    {
                      rental
                        ?.village
                    }
                  </span>

                </div>

                <div>

                  <strong>
                    Taluka
                  </strong>

                  <span>
                    {
                      rental
                        ?.taluka
                    }
                  </span>

                </div>

                <div>

                  <strong>
                    District
                  </strong>

                  <span>
                    {
                      rental
                        ?.district
                    }
                  </span>

                </div>

                <div>

                  <strong>
                    State
                  </strong>

                  <span>
                    {
                      rental
                        ?.state
                    }
                  </span>

                </div>

                <div>

                  <strong>
                    Availability
                  </strong>

                  <span>

                    {rental
                      ?.is_available

                      ? "Available"

                      : "Unavailable"}

                  </span>

                </div>

              </div>

            </Card>

            {/* DESCRIPTION */}

            <Card
              style={{
                marginTop:
                  18,
              }}
            >

              <div className="
                listing-section
              ">

                <h3>
                  Description
                </h3>

                <p>

                  {
                    rental
                      ?.description
                      ?.trim()

                    ||

                    "No description provided."
                  }

                </p>

              </div>

            </Card>

            {/* OWNER */}

            <Card
              style={{
                marginTop:
                  18,
              }}
            >

              <ListingSellerInfo
                sellerName={
                  rental
                    ?.owner_name
                }

                sellerPhone={
                  rental
                    ?.phone
                }
              />

            </Card>

            {/* ACTIONS */}

            <Card
              style={{
                marginTop:
                  18,
              }}
            >

              {isOwner ? (

                <div className="
                  listing-actions
                ">

                  <Button
                    onClick={() =>
                      navigate(
                        `/farmer/rentals/edit/${rental.id}`
                      )
                    }
                  >
                    Edit Rental
                  </Button>

                  <Button
                    variant="
                      danger
                    "
                    onClick={() =>
                      setDeleteOpen(
                        true
                      )
                    }
                  >
                    Delete
                  </Button>

                </div>

              ) : (

                <ContactActions
                  phone={
                    rental
                      ?.phone
                  }
                />

              )}

            </Card>

          </div>

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
        message="
          Are you sure you want
          to delete this rental?
        "
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

    </Modal>
  );
}   