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
      PRIVATE LISTINGS
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
      PUBLIC LISTINGS
  ========================================= */

  async getPublicListings(
    params = {}
  ) {

    const response =
      await api.get(

        `${BASE_URL}/public/listings`,

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
      MY LISTINGS
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
      SINGLE LISTING
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
      CREATE
  ========================================= */

  async createListing(
    payload
  ) {

    const response =
      await api.post(

        `${BASE_URL}/listings`,
        payload
        
      );

    return response;
  },

  /* ========================================
      UPDATE
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
      DELETE
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