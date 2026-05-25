// // src/services/marketplaceService.js

// import api from "../api/axios";

// export const MarketplaceService = {

//   /* ==========================================
//      GET MARKETPLACE LISTINGS
//   ========================================== */

//   getListings(params = {}) {

//     return api.get(
//       "/marketplace/listings",
//       {
//         params,
//       }
//     );
//   },

//   /* ==========================================
//      GET MY LISTINGS
//   ========================================== */

//   getMyListings() {

//     return api.get(
//       "/marketplace/my-listings"
//     );
//   },

//   /* ==========================================
//      GET SINGLE LISTING
//   ========================================== */

//   getListingById(listingId) {

//     return api.get(
//       `/marketplace/listings/${listingId}`
//     );
//   },

//   /* ==========================================
//      CREATE LISTING
//   ========================================== */

//   createListing(formData) {

//     return api.post(
//       "/marketplace/listings",
//       formData,
//       {
//         headers: {
//           "Content-Type":
//             "multipart/form-data",
//         },
//       }
//     );
//   },

//   /* ==========================================
//      UPDATE LISTING
//   ========================================== */

//   updateListing(
//   listingId,
//   payload
// ) {
//   return api.patch(
//     `/marketplace/listings/${listingId}`,
//     payload
//   );
// },

//   /* ==========================================
//      DELETE LISTING
//   ========================================== */

//   deleteListing(listingId) {

//     return api.delete(
//       `/marketplace/listings/${listingId}`
//     );
//   },
// };

import api
from "../api/axios";

const BASE_URL =
  "/marketplace";

/* ==========================================
   HELPERS
========================================== */

function cleanParams(
  params = {}
) {

  return Object.fromEntries(

    Object.entries(
      params
    ).filter(
      ([_, value]) =>
        value !==
          undefined &&
        value !==
          null &&
        value !== ""
    )
  );
}

/* ==========================================
   SERVICE
========================================== */

export const MarketplaceService = {

  /* ========================================
      GET MARKETPLACE LISTINGS
  ========================================= */

  async getListings(
    params = {}
  ) {

    const response =
      await api.get(

        `${BASE_URL}/listings`,

        {
          params:
            cleanParams(
              params
            ),
        }
      );

    return response;
  },

  /* ========================================
      GET MY LISTINGS
  ========================================= */

  async getMyListings(
    params = {}
  ) {

    const response =
      await api.get(

        `${BASE_URL}/my-listings`,

        {
          params:
            cleanParams(
              params
            ),
        }
      );

    return response;
  },

  /* ========================================
      GET SINGLE LISTING
  ========================================= */

  async getListingById(
    listingId
  ) {

    if (
      !listingId
    ) {

      throw new Error(
        "Listing ID is required"
      );
    }

    const response =
      await api.get(

        `${BASE_URL}/listings/${listingId}`
      );

    return response;
  },

  /* ========================================
      CREATE LISTING
  ========================================= */

  async createListing(
    formData
  ) {

    const response =
      await api.post(

        `${BASE_URL}/listings`,

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response;
  },

  /* ========================================
      UPDATE LISTING
  ========================================= */

  async updateListing(
    listingId,
    payload
  ) {

    if (
      !listingId
    ) {

      throw new Error(
        "Listing ID is required"
      );
    }

    const response =
      await api.patch(

        `${BASE_URL}/listings/${listingId}`,

        payload
      );

    return response;
  },

  /* ========================================
      DELETE LISTING
  ========================================= */

  async deleteListing(
    listingId
  ) {

    if (
      !listingId
    ) {

      throw new Error(
        "Listing ID is required"
      );
    }

    const response =
      await api.delete(

        `${BASE_URL}/listings/${listingId}`
      );

    return response;
  },
};