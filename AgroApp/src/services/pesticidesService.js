import api from "../api/axios";

const BASE_URL = "/pesticides";

export const PesticidesService = {

  getAll: async (params = {}) => {

    const response = await api.get(BASE_URL, {
      params,
    });

    return response.data;
  },

  getById: async (id) => {

    const response = await api.get(`${BASE_URL}/${id}`);

    return response.data;
  },

  create: async (payload) => {

    const response = await api.post(BASE_URL, payload);

    return response.data;
  },

  update: async (id, payload) => {

    const response = await api.patch(
      `${BASE_URL}/${id}`,
      payload
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