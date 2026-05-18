import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/farmer/Dashboard";
import Farms from "../pages/farmer/Farms";
import Crops from "../pages/farmer/Crops";
import Fertilizers from "../pages/farmer/Fertilizers";
import Incomes from "../pages/farmer/Incomes";  

function FarmerRoutes() {

  return (

    <ProtectedRoute role="farmer">

      <Routes>

        <Route element={<MainLayout />}>

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="farms" element={<Farms />}/>
          <Route path="crops" element={<Crops />} />
          <Route path="fertilizers" element={<Fertilizers />} />
          <Route path="incomes" element={<Incomes />} />
        </Route>

      </Routes>

    </ProtectedRoute>
  );
}

export default FarmerRoutes;