import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/admin/Dashboard";
import Profile from "../pages/profile/Profile";

function AdminRoutes() {

  return (

    <ProtectedRoute role="admin">

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

export default AdminRoutes;