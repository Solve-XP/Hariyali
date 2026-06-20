
// src/services/farmsService.js

import api from "../api/axios";

const BASE_URL = "/farms";

export const FarmsService = {

  /* ========================================
      GET ALL
  ========================================= */

  async getAll(search = "") {

    const response =
      await api.get(
        `${BASE_URL}/`,
        {
          params: search
            ? { search }
            : {},
        }
      );

    return response.data;
  },

  /* ========================================
      CREATE
  ========================================= */

  async create(payload) {

    const formData =
      new FormData();

    formData.append(
      "farm_name",
      String(payload.farm_name)
    );

    formData.append(
      "acres",
      String(payload.acres)
    );

    formData.append(
      "location",
      String(payload.location)
    );

    formData.append(
      "soil_type",
      String(payload.soil_type)
    );

    if (
      payload.farm_photo?.uri
    ) {
      formData.append(
        "farm_photo",
        {
          uri:
            payload.farm_photo.uri,

          name:
            payload.farm_photo.name ||
            `farm_${Date.now()}.jpg`,

          type:
            payload.farm_photo.type ||
            "image/jpeg",
        }
      );
    }

    const response =
      await api.post(
        `${BASE_URL}/`, // important slash
        payload
      );

    return response.data;
  },

  /* ========================================
      UPDATE
  ========================================= */

  async update(
    farmId,
    payload
  ) {

    const formData =
      new FormData();

    formData.append(
      "farm_name",
      String(payload.farm_name)
    );

    formData.append(
      "acres",
      String(payload.acres)
    );

    formData.append(
      "location",
      String(payload.location)
    );

    formData.append(
      "soil_type",
      String(payload.soil_type)
    );

    if (
      payload.farm_photo?.uri
    ) {
      formData.append(
        "farm_photo",
        {
          uri:
            payload.farm_photo.uri,

          name:
            payload.farm_photo.name ||
            `farm_${Date.now()}.jpg`,

          type:
            payload.farm_photo.type ||
            "image/jpeg",
        }
      );
    }

    const response =
      await api.put(
        `${BASE_URL}/${farmId}`,
        payload
      );

    return response.data;
  },

  /* ========================================
      DELETE
  ========================================= */

  async delete(
    farmId
  ) {

    const response =
      await api.delete(
        `${BASE_URL}/${farmId}`
      );

    return response.data;
  },
};