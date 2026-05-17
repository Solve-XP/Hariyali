// src/services/farmsService.js

import api from "../api/axios";

export const FarmsService = {

  getAll: async (search = "") => {
    const response = await api.get(
      `/farms${search ? `?search=${encodeURIComponent(search)}` : ""}`
    );

    return response.data;
  },

  create: async (payload) => {
    const formData = new FormData();

    formData.append("farm_name", payload.farm_name);
    formData.append("acres", payload.acres);
    formData.append("location", payload.location);
    formData.append("soil_type", payload.soil_type);

    if (payload.farm_photo) {
      formData.append("farm_photo", payload.farm_photo);
    }

    const response = await api.post("/farms", formData);

    return response.data;
  },

  update: async (farmId, payload) => {
    const formData = new FormData();

    formData.append("farm_name", payload.farm_name);
    formData.append("acres", payload.acres);
    formData.append("location", payload.location);
    formData.append("soil_type", payload.soil_type);

    if (payload.farm_photo instanceof File) {
      formData.append("farm_photo", payload.farm_photo);
    }

    const response = await api.put(`/farms/${farmId}`, formData);

    return response.data;
  },

  delete: async (farmId) => {
    const response = await api.delete(`/farms/${farmId}`);

    return response.data;
  },

};