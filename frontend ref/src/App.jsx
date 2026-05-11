import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";

import Login       from "./pages/Login";
import SignUp      from "./pages/SignUp";
import AdminLogin  from "./pages/AdminLogin";
import Dashboard   from "./pages/Dashboard";
import Farms       from "./pages/Farms";
import Crops       from "./pages/Crops";
import Expenses    from "./pages/Expenses";
import Rental      from "./pages/Rental";
import NotFound    from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers     from "./pages/admin/AdminUsers";
import AdminFarms     from "./pages/admin/AdminFarms";
import AdminCrops     from "./pages/admin/AdminCrops";
import AdminExpenses  from "./pages/admin/AdminExpenses";
import AdminEquipment from "./pages/admin/AdminEquipment";


function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin-login" replace />;
  if (!isAdmin)         return <Navigate to="/dashboard"   replace />;
  return children;
}

function PublicRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace />;
  }
  return children;
}


function AppRoutes() {
  return (
    <Routes>
      {/* Public auth pages */}
      <Route path="/login"       element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup"      element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/admin-login" element={<PublicRoute adminOnly><AdminLogin /></PublicRoute>} />

      {/* Farmer routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farms"     element={<Farms />} />
        <Route path="/crops"     element={<Crops />} />
        <Route path="/expenses"  element={<Expenses />} />
        <Route path="/rental"    element={<Rental />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
        <Route path="/admin"           element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users"     element={<AdminUsers />} />
        <Route path="/admin/farms"     element={<AdminFarms />} />
        <Route path="/admin/crops"     element={<AdminCrops />} />
        <Route path="/admin/expenses"  element={<AdminExpenses />} />
        <Route path="/admin/equipment" element={<AdminEquipment />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
