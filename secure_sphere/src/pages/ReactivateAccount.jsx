// src/pages/ReactivateAccount.jsx
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ReactivateAccount() {
  const { user, fetchProfile, token } = useAuthStore();
  const { reactivateAccount, loading, error, message, clearMessages } = useUserStore();
  const navigate = useNavigate();

  const handleReactivate = async () => {
    await reactivateAccount(token);
    await fetchProfile(); // Update authStore user state
    navigate("/dashboard");
  };

  useEffect(() => {
    return () => {
      clearMessages(); // Clear old error/message when unmounting
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-xl font-semibold">Reactivate Account</CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center text-red-500">
            Your account is deactivated. You must reactivate it to continue.
          </p>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}

          <Button onClick={handleReactivate} className="w-full" disabled={loading}>
            {loading ? "Reactivating..." : "Reactivate Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
