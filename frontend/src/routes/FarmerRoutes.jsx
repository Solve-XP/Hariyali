import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/farmer/Dashboard";
import Farms from "../pages/farmer/Farms";
import Crops from "../pages/farmer/Crops";
import Fertilizers from "../pages/farmer/Fertilizers";
import Pesticides from "../pages/farmer/Pesticides";
import Incomes from "../pages/farmer/Incomes";
import Expenses from "../pages/farmer/Expenses";
import Rentals from "../pages/farmer/Rentals";
import Profile from "../pages/profile/Profile";
import Marketplace from "../pages/marketplace/Marketplace";
import MyListings from "../pages/marketplace/MyListings";
import CreateListing from "../pages/marketplace/CreateListing";
import EditListing from "../pages/marketplace/EditListing";
import ListingDetails from "../pages/marketplace/ListingDetails";



function FarmerRoutes() {
  return (
    <ProtectedRoute role="farmer">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="farms" element={<Farms />} />
          <Route path="crops" element={<Crops />} />
          <Route path="fertilizers" element={<Fertilizers />} />
          <Route path="pesticides" element={<Pesticides />} />
          <Route path="incomes" element={<Incomes />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="rentals" element={<Rentals />} />
          <Route path="profile" element={<Profile />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/my-listings" element={<MyListings />} />
          <Route path="marketplace/create" element={<CreateListing />} />
          <Route path="marketplace/:id" element={<ListingDetails />} />
          <Route path="marketplace/edit/:id" element={<EditListing />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}

export default FarmerRoutes;