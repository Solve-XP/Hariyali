import "./Rental.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
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

export default function EditRental() {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const { t } =
    useTranslation();

  const {
    pushToast,
  } = useApp();

  const [loading,
    setLoading] =
    useState(true);

  const [saving,
    setSaving] =
    useState(false);

  const [rental,
    setRental] =
    useState(null);

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
        ),

        "error"
      );

      navigate(
        "/farmer/rentals/my-rentals"
      );

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

  async function
    handleSubmit(
      formData
    ) {

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

    try {

      setSaving(
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

      };

      await RentalsService
        .updateRental(
          id,
          payload
        );

      pushToast(
        t(
          "editRental.updatedSuccess"
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

      setSaving(
        false
      );
    }
  }

  if (
    loading
  ) {

    return (

      <div className="
        rental-loading
      ">

        {t(
          "common.loading"
        )}

      </div>
    );
  }

  return (

    <div className="
      rental-page
    ">

      <PageHeader
        title={
          t(
            "editRental.editRental"
          )
        }
        subtitle={
          t(
            "editRental.updateRentalDetails"
          )
        }
      />

      <RentalForm
        mode="edit"
        loading={
          saving
        }
        initialValues={
          rental
        }
        onSubmit={
          handleSubmit
        }
      />

    </div>
  );
}