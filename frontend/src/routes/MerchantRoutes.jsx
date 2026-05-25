import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/merchant/Dashboard";
import Profile from "../pages/profile/Profile";
import Marketplace from "../pages/marketplace/Marketplace";
import ListingDetails from "../pages/marketplace/ListingDetails";


function MerchantRoutes() {

  return (

    <ProtectedRoute role="merchant">

      <Routes>

        <Route element={<MainLayout />}>
          <Route
            path="profile"
            element={<Profile />} />
          <Route
            path="marketplace"
            element={<Marketplace />} />
          <Route
            path="marketplace/:id"
            element={<ListingDetails />} />
        </Route>

      </Routes>

    </ProtectedRoute>
  );
}

export default MerchantRoutes; 