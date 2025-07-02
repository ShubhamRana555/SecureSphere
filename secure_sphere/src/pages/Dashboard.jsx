import { useAuthStore } from "../store/authStore.js";

export default function Dashboard() {
  const { user } = useAuthStore();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="bg-zinc-800 p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user.username}
      </h1>

      {user.role === "admin" ? (
        <div>
          <p className="text-lg mb-2">🔐 Admin Panel</p>
          <ul className="list-disc list-inside space-y-2">
            <li>View All Users</li>
            <li>Manage Roles</li>
            <li>System Logs</li>
          </ul>
        </div>
      ) : (
        <div>
          <p className="text-lg mb-2">👤 User Dashboard</p>
          <ul className="list-disc list-inside space-y-2">
            <li>My Tasks</li>
            <li>Profile Settings</li>
            <li>Support Tickets</li>
          </ul>
        </div>
      )}
    </div>
  );
}
