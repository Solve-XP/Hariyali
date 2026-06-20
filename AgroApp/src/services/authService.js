import api from "../api/axios";

// Login
export const loginUser = async (data) => {

  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

// Signup
export const signupUser = async (data) => {

  const response = await api.post(
    "/auth/signup",
    data
  );

  return response.data;
};

export const forgotPassword = async (data) => {
  const res = await api.post("/auth/forgot-password", data);
  return res.data;
};