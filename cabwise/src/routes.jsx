import {
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Vehicles from "./pages/vehicles/Vehicles";
import VehicleDetails from "./pages/vehicles/VehicleDetails";
import Maintenance from "./pages/maintenance/Maintenance";
import Drivers from "./pages/drivers/Drivers";
import Issues from "./pages/issues/Issues";
import Reports from "./pages/reports/Reports";
import Notifications from "./pages/Notifications/Notifications";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";

function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/vehicles"
        element={<Vehicles />} />

      <Route
        path="/vehicles/:id"
        element={<VehicleDetails />}
      />

      <Route
        path="/maintenance"
        element={<Maintenance />}
      />

      <Route
        path="/drivers"
        element={<Drivers />}
      />

      <Route
        path="/issues"
        element={<Issues />}
      />

      <Route
        path="/reports"
        element={<Reports />}
      />

      <Route
        path="/notifications"
        element={<Notifications />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

    </Routes>

  );
}

export default AppRoutes;