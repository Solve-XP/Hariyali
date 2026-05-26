// src/services/rentalsService.js

import api from "../api/axios";

export const RentalsService = {

  /* ==========================================
     GET RENTALS MARKETPLACE
  ========================================== */

  getRentals(
    params = {}
  ) {

    return api.get(
      "/rentals",
      {
        params,
      }
    );
  },

  /* ==========================================
     GET PUBLIC RENTALS
  ========================================== */

  getPublicRentals(
    params = {}
  ) {

    return api.get(
      "/rentals/public",
      {
        params,
      }
    );
  },

  /* ==========================================
     GET MY RENTALS
  ========================================== */

  getMyRentals() {

    return api.get(
      "/rentals/my-listings"
    );
  },

  /* ==========================================
     GET RENTAL DETAILS
  ========================================== */

  getRentalById(
    rentalId
  ) {

    return api.get(
      `/rentals/${rentalId}`
    );
  },

  /* ==========================================
     CREATE RENTAL
  ========================================== */

  createRental(
    data
  ) {

    const formData =
      new FormData();

    Object.entries(
      data
    ).forEach(
      ([
        key,
        value,
      ]) => {

        if (
          key ===
          "equipment_images"
        ) {
          return;
        }

        if (
          value !==
            undefined &&
          value !== null &&
          value !== ""
        ) {

          formData.append(
            key,
            value
          );
        }
      }
    );

    if (
      data
        ?.equipment_images
        ?.length
    ) {

      data
        .equipment_images
        .forEach(
          (
            image
          ) => {

            formData.append(
              "equipment_images",
              image
            );
          }
        );
    }

    return api.post(
      "/rentals",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  },

  /* ==========================================
     UPDATE RENTAL
  ========================================== */

  updateRental(
    rentalId,
    data
  ) {

    const formData =
      new FormData();

    Object.entries(
      data
    ).forEach(
      ([
        key,
        value,
      ]) => {

        if (
          key ===
          "equipment_images"
        ) {
          return;
        }

        if (
          value !==
            undefined &&
          value !== null &&
          value !== ""
        ) {

          formData.append(
            key,
            value
          );
        }
      }
    );

    if (
      data
        ?.equipment_images
        ?.length
    ) {

      data
        .equipment_images
        .forEach(
          (
            image
          ) => {

            formData.append(
              "equipment_images",
              image
            );
          }
        );
    }

    return api.patch(
      `/rentals/${rentalId}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  },

  /* ==========================================
     DELETE RENTAL
  ========================================== */

  deleteRental(
    rentalId
  ) {

    return api.delete(
      `/rentals/${rentalId}`
    );
  },
};