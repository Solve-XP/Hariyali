import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";

import MainLayout
from "../layouts/MainLayout";

import AdminRoutes from "./AdminRoutes";
import FarmerRoutes from "./FarmerRoutes";
import MerchantRoutes from "./MerchantRoutes";
import Marketplace from "../pages/marketplace/Marketplace";
import Rentals from "../pages/rentals/Rentals";

import PrivacyPolicy from "../pages/static/PrivacyPolicy";
import Terms from "../pages/static/Terms";
import Support from "../pages/static/Support";
import Contact from "../pages/static/Contact";
import UsefulLinks from "../pages/static/UsefulLinks";



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

      <Route
        element={
          <MainLayout />
        }
      >
      
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />
        <Route
          path="/support"
          element={<Support />}
        />
        <Route
          path="/contact"
          element={<Contact />}
        />
        <Route
          path="/useful-links"
          element={<UsefulLinks />}
        />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
