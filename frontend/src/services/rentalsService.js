// src/services/rentalsService.js

import api from "../api/axios";
import { UploadService } from "./uploadService";

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

  async createRental(data) {

  const uploadsResponse =
    await UploadService.getUploadUrls(
      "rentals",
      data.equipment_images
    );

  const imageUrls =
    await UploadService.uploadFilesToS3(
      data.equipment_images,
      uploadsResponse.uploads
    );

  const payload = {

    ...data,

    equipment_images:
      imageUrls
  };

  return api.post(
    "/rentals",
    payload
  );
},

  /* ==========================================
     UPDATE RENTAL
  ========================================== */

  updateRental(
  rentalId,
  data
) {

  return api.patch(
    `/rentals/${rentalId}`,
    data
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