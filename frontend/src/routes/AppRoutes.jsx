import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";

import AdminRoutes from "./AdminRoutes";
import FarmerRoutes from "./FarmerRoutes";
import MerchantRoutes from "./MerchantRoutes";
import Marketplace from "../pages/marketplace/Marketplace";
import Rentals from "../pages/rentals/Rentals";



function AppRoutes() {
  return (
    <Routes>

      {/* Redirect Root */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Public Routes */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/marketplace"
        element={
          <Marketplace />
        }
      />

      <Route
        path="/rentals"
        element={
          <Rentals />
        }
      />

      <Route
        path="/admin/*"
        element={<AdminRoutes />}
      />

      <Route
        path="/farmer/*"
        element={<FarmerRoutes />}
      />

      <Route
        path="/merchant/*"
        element={<MerchantRoutes />}
      /> 

    </Routes>
  );
}

export default AppRoutes;