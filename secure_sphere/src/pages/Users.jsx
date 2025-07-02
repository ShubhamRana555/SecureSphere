// src/pages/Users.jsx
import { useEffect } from "react";
import { useAdminStore } from "../store/adminStore.js";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

export default function Users() {
  const { users, loading, error, fetchAllUsers } = useAdminStore();

  useEffect(() => {
    const fetchUsers = async () => {
      await fetchAllUsers();
    }

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">All Users</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl bg-zinc-700" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user._id} className="bg-zinc-800 text-white">
              <CardHeader className="text-lg font-semibold">
                {user.fullname || user.username}
              </CardHeader>
              <CardContent className="space-y-1">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
