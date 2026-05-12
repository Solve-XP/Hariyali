import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/farmer/Dashboard";

function FarmerRoutes() {

  return (

    <ProtectedRoute role="farmer">

      <Routes>

        <Route element={<MainLayout />}>

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

        </Route>

      </Routes>

    </ProtectedRoute>
  );
}

export default FarmerRoutes;