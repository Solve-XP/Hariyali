import "./Rental.css";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useTranslation,
} from "react-i18next";

import PageHeader
from "../../components/PageHeader";

import RentalForm
from "../../components/rentals/RentalForm";

import {
  RentalsService,
} from "../../services/rentalsService";

import {
  useApp,
} from "../../context/AppContext";

import {
  getErrorMessage,
} from "../../utils/errorHandler";

import {
  validateRequired,
} from "../../utils/validators";

export default function CreateRental() {

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

  const [loading,
    setLoading] =
    useState(false);

  /* ==========================================
      SUBMIT
  ========================================== */

  async function
    handleSubmit(
      formData
    ) {

    /* ======================================
       VALIDATION
    ====================================== */

    const requiredFields =
      [

        "equipment_name",

        "village",
        "taluka",
        "district",
        "state",

        "owner_name",
        "phone",
      ];

    const isValid =
      validateRequired(
        formData,
        requiredFields
      );

    if (
      !isValid
    ) {

      pushToast(
        t(
          "rentalCreate.fillRequiredFields"
        ),
        "error"
      );

      return;
    }

    /* ======================================
       PRICE VALIDATION
    ====================================== */

    if (

      !formData
        .price_per_hour &&

      !formData
        .price_per_day

    ) {

      pushToast(
        t(
          "rentalCreate.addPrice"
        ),
        "error"
      );

      return;
    }

    /* ======================================
       IMAGE VALIDATION
    ====================================== */

    if (

      !formData
        ?.equipment_images
        ?.length

    ) {

      pushToast(
        t(
          "rentalCreate.uploadImage"
        ),
        "error"
      );

      return;
    }

    try {

      setLoading(
        true
      );

      const payload = {

        equipment_name:
          formData
            .equipment_name
            ?.trim(),

        price_per_hour:
          formData
            .price_per_hour
            ? Number(
                formData
                  .price_per_hour
              )
            : undefined,

        price_per_day:
          formData
            .price_per_day
            ? Number(
                formData
                  .price_per_day
              )
            : undefined,

        village:
          formData
            .village
            ?.trim(),

        taluka:
          formData
            .taluka
            ?.trim(),

        district:
          formData
            .district
            ?.trim(),

        state:
          formData
            .state
            ?.trim(),
        latitude:
          formData.latitude,

        longitude:
          formData.longitude,

        owner_name:
          formData
            .owner_name
            ?.trim(),

        phone:
          formData
            .phone
            ?.trim(),

        description:
          formData
            .description
            ?.trim(),

        equipment_images:
          formData
            .equipment_images,
      };

      await RentalsService
        .createRental(
          payload
        );

      pushToast(
        t(
          "rentalCreate.createdSuccess"
        ),
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
        ),

        "error"
      );

    } finally {

      setLoading(
        false
      );
    }
  }

  /* ==========================================
      RENDER
  ========================================== */

  return (

    <div className="
      rental-page
    ">

      <PageHeader
        title={
          t(
            "rentalCreate.createRental"
          )
        }
        subtitle={
          t(
            "rentalCreate.addEquipment"
          )
        }
      />

      <RentalForm
        mode="
          create
        "
        loading={
          loading
        }
        onSubmit={
          handleSubmit
        }
      />

    </div>
  );
}