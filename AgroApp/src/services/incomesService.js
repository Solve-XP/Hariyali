import api from "../api/axios";

const BASE_URL = "/incomes";

export const IncomesService = {

  async getAll(params = {}) {

    const response = await api.get(BASE_URL, {
      params,
    });

    return response.data;
  },

  async getById(id) {

    const response = await api.get(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },

  async create(payload) {

    const response = await api.post(
      BASE_URL,
      payload
    );

    return response.data;
  },

  async update(id, payload) {

    const response = await api.patch(
      `${BASE_URL}/${id}`,
      payload
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