import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/farmer/Dashboard";
import Farms from "../pages/farmer/Farms";
import Crops from "../pages/farmer/Crops";

function FarmerRoutes() {

  return (

    <ProtectedRoute role="farmer">

      <Routes>

        <Route element={<MainLayout />}>

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="farms" element={<Farms />}/>
          <Route path="crops" element={<Crops />}/>
    
        </Route>

      </Routes>

    </ProtectedRoute>
  );
}

export default FarmerRoutes;