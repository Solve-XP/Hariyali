import api from "../api/axios";

const BASE_URL = "/rentals";

export const RentalsService = {

  async getAll(params = {}) {

    const response = await api.get(
      BASE_URL,
      {
        params,
      }
    );

    return response.data;
  },

  async getById(id) {

    const response = await api.get(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },

  async create(data) {

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        formData.append(key, value);
      }
    });

    const response = await api.post(
      BASE_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async update(id, data) {

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        formData.append(key, value);
      }
    });

    const response = await api.patch(
      `${BASE_URL}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async delete(id) {

    const response = await api.delete(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },
};