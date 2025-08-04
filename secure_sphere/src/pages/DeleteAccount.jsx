// src/pages/DeleteAccount.jsx
import { useAuthStore } from "../store/authStore.js";
import { useUserStore } from "../store/userStore.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const { token, logout } = useAuthStore();
  const { deleteAccount, loading, error, message, clearMessages } = useUserStore();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await deleteAccount(token, data.password, data.confirm);
    if (!error) {
      await logout();
      navigate("/register");
    }
  };

  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-xl font-semibold text-white">Delete Account</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-red-500 text-center">
              Warning: This action is irreversible. Your data will be permanently deleted.
            </p>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center">{message}</p>}

            <div>
              <Label htmlFor="password" className="text-white">Confirm Password</Label>
              <Input
                type="password"
                {...register("password", { required: true })}
                placeholder="Enter your password"
              />
            </div>

            <div>
              <Label htmlFor="confirm" className="text-white">Type "DELETE" to confirm</Label>
              <Input
                {...register("confirm", { required: true })}
                placeholder='Type "DELETE"'
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
