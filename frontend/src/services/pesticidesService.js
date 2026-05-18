import api from "../api/axios";

const BASE_URL = "/pesticides";

export const PesticidesService = {

  getAll: async (params = {}) => {

    const response = await api.get(
      BASE_URL,
      { params }
    );

    return response.data;
  },

  getById: async (id) => {

    const response = await api.get(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },

  create: async (data) => {

    const response = await api.post(
      BASE_URL,
      data
    );

    return response.data;
  },

  update: async (id, data) => {

    const response = await api.patch(
      `${BASE_URL}/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id) => {

    const response = await api.delete(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },
};