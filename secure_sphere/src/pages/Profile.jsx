import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, logout, loading } = useAuthStore();

  if (!user) return <p className="text-center mt-10">Loading Profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader className="text-2xl font-semibold">Welcome, {user.fullname || user.username}</CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <div className="flex gap-3 mt-6">
            <Button variant="destructive" onClick={logout} disabled={loading}>
              {loading ? "Logging out..." : "Logout"}
            </Button>
            <Button asChild>
              <Link to="/update-profile">Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
