import api from "../api/axios";

export const RentalsService = {

  getRentals(params = {}) {
    return api.get("/rentals", { params });
  },

  getPublicRentals(params = {}) {
    return api.get("/rentals/public", { params });
  },

  getMyRentals() {
    return api.get("/rentals/my-listings");
  },

  getRentalById(rentalId) {
    return api.get(`/rentals/${rentalId}`);
  },

  createRental(data) {
    return api.post(
      "/rentals",
      data
    );
  },

  updateRental(
    rentalId,
    data
  ) {
    return api.patch(
      `/rentals/${rentalId}`,
      data
    );
  },

  deleteRental(rentalId) {
    return api.delete(
      `/rentals/${rentalId}`
    );
  },
};