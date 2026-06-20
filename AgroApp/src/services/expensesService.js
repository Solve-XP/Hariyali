import api from "../api/axios";

const BASE_URL = "/expenses";

export const ExpensesService = {

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

    const response = await api.post(
      BASE_URL,
      data
    );

    return response.data;
  },

  async update(id, data) {

    const response = await api.patch(
      `${BASE_URL}/${id}`,
      data
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