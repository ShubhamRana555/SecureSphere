import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import DeactivateAccount from "./pages/DeactivateAccount.jsx";
import DeleteAccount from "./pages/DeleteAccount.jsx";
import Navbar from "./components/Navbar.jsx";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import MyTasks from "./pages/MyTasks";
import ProtectedRoute from "./components/ProtectedRoute";
import ReactivateAccount from "./pages/ReactivateAccount";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="my-tasks"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <MyTasks />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/"
          element={<Navigate to={token ? "/profile" : "/register"} />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/profile" /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/profile" /> : <Register />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/deactivate-account" element={<DeactivateAccount />} />
        <Route path="/reactivate-account" element={<ReactivateAccount />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
