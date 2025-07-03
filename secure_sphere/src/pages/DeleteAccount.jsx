import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore.js";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";

import axios from "axios";

export default function DeleteAccount() {
  const { logout, token, loading } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.delete("/users/delete", {
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await logout();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
    } finally {
      reset();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md bg-background text-foreground">
        <CardHeader className="text-center text-xl font-semibold">
          Delete Account
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-red-500 text-center">
              Warning: This action is irreversible!
            </p>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                {...register("password", { required: true })}
                placeholder="Your Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">Password is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirm">Type "DELETE" to confirm</Label>
              <Input
                {...register("confirm", {
                  required: true,
                  validate: (val) => val === "DELETE",
                })}
                placeholder='Type DELETE'
              />
              {errors.confirm && (
                <p className="text-red-500 text-sm">
                  You must type "DELETE" to confirm
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
