import api from "../api/axios";

export const UsersService = {

  getMe: async () => {

    const response =
      await api.get("/users/me");

    return response.data;
  },

  updateMe: async (payload) => {

    const response =
      await api.patch(
        "/users/me",
        payload
      );

    return response.data;
  },

  changePassword: async (payload) => {

    const response =
      await api.patch(
        "/users/change-password",
        payload
      );

    return response.data;
  },
};