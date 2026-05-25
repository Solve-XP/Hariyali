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
import {
  useTranslation,
} from "react-i18next";

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

  const { t } =
    useTranslation();
  
  
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
                      {t(
                        "rental.perHour"
                      )}
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
                      {t(
                        "rental.perDay"
                      )}
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
                    {t(
                      "listingDetails.village"
                    )}
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
                    {t(
                      "listingDetails.taluka"
                    )}
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
                    {t(
                      "listingDetails.district"
                    )}
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
                    {t(
                      "rentalDetails.state"
                    )}
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
                    {t(
                      "rentalDetails.availability"
                    )}
                  </strong>

                  <span>

                    {rental
                      ?.is_available

                      ? t(
                          "rentalDetails.available"
                        )

                      : t(
                          "rentalDetails.unavailable"
                        )}

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
                  {t(
                    "listingDetails.description"
                  )}
                </h3>

                <p>

                  {
                    rental
                      ?.description
                      ?.trim()

                    ||

                    t(
                      "rentalDetails.noDescription"
                    )
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
                    {t(
                      "editRental.editRental"
                    )}
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
                    {t(
                      "common.delete"
                    )}
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

      <ConfirmDialog
        open={
          deleteOpen
        }
        title={
          t(
            "myRentals.deleteRental"
          )
        }
        message={
          t(
            "rentalDetails.deleteConfirm"
          )
        }
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

    </Modal>
  );
}
   