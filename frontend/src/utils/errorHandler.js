// src/utils/errorHandler.js

export function getErrorMessage(error) {

  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
}