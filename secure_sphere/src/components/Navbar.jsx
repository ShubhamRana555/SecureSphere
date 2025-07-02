import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-zinc-800 text-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">SecureSphere</Link>
      </div>

      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>

            {/* Conditionally show My Tasks to users and admins */}
            {(user.role === "user" || user.role === "admin") && (
              <Link to="/dashboard/my-tasks" className="hover:underline">My Tasks</Link>
            )}

            {/* Conditionally show Users only to admin */}
            {user.role === "admin" && (
              <Link to="/dashboard/users" className="hover:underline">Users</Link>
            )}

            <Link to="/profile" className="hover:underline">Profile</Link>

            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
