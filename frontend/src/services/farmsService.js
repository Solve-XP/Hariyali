import api from "../api/axios";

export const FarmsService = {

  getAll: async (
    search = ""
  ) => {

    const response =
      await api.get(
        `/farms${
          search
            ? `?search=${encodeURIComponent(search)}`
            : ""
        }`
      );

    return response.data;
  },

  create: async (
    payload
  ) => {

    const response =
      await api.post(
        "/farms",
        payload
      );

    return response.data;
  },

  update: async (
    farmId,
    payload
  ) => {

    const response =
      await api.put(
        `/farms/${farmId}`,
        payload
      );

    return response.data;
  },

  delete: async (
    farmId
  ) => {

    const response =
      await api.delete(
        `/farms/${farmId}`
      );

    return response.data;
  },
};