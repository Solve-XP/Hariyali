import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/merchant/Dashboard";
import Profile from "../pages/profile/Profile";

function MerchantRoutes() {

  return (

    <ProtectedRoute role="merchant">

      <Routes>

        <Route element={<MainLayout />}>

          <Route
            path="dashboard"
            element={<Dashboard />}
          />
          <Route
            path="profile"
            element={<Profile />} />
        </Route>

      </Routes>

    </ProtectedRoute>
  );
}

export default MerchantRoutes; 