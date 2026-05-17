import api from "../api/axios";

export const CropsService = {

  getAll: async (params = {}) => {

    const query = new URLSearchParams();

    if (params.search) {
      query.append("search", params.search);
    }

    if (params.farm_id && params.farm_id !== "all") {
      query.append("farm_id", params.farm_id);
    }

    if (params.season && params.season !== "all") {
      query.append("season", params.season);
    }

    if (params.financial_year && params.financial_year !== "all") {
      query.append("financial_year", params.financial_year);
    }

    const response = await api.get(
      `/crops${query.toString() ? `?${query.toString()}` : ""}`
    );

    return response.data;
  },

  create: async (payload) => {

    const response = await api.post("/crops", payload);

    return response.data;
  },

  update: async (cropId, payload) => {

    const response = await api.put(`/crops/${cropId}`, payload);

    return response.data;
  },

  delete: async (cropId) => {

    const response = await api.delete(`/crops/${cropId}`);

    return response.data;
  },

};