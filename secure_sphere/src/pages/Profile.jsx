import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, logout, loading } = useAuthStore();

  if (!user) return <p className="text-center mt-10 text-gray-400">Loading Profile...</p>;

  return (
    <div className="min-h-screen bg-zinc-700 text-white py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Card className="bg-zinc-800 border border-zinc-700 rounded-xl shadow-md">
          <CardHeader className="text-center text-2xl font-semibold text-white">
            Welcome, {user.fullname || user.username}
          </CardHeader>

          <CardContent className="space-y-4 text-zinc-300">
            <div className="space-y-1 text-base">
              <p><span className="text-white font-medium">Email:</span> {user.email}</p>
              <p><span className="text-white font-medium">Username:</span> {user.username}</p>
              <p><span className="text-white font-medium">Role:</span> {user.role}</p>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                variant="destructive"
                onClick={logout}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>

              <Button asChild className="w-full bg-zinc-700 hover:bg-zinc-600 text-white">
                <Link to="/update-profile">Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
