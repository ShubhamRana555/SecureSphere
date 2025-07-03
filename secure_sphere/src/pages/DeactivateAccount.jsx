import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DeactivateAccount() {
  const { register, handleSubmit } = useForm();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const onSubmit = async ({ password }) => {
    try {
      await axios.delete("/users/me/deactivate-account", {
        data: { password },
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
      });
      await logout();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Deactivation failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-xl font-semibold text-red-600">Deactivate Account</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="password">Confirm with Password</Label>
              <Input type="password" {...register("password", { required: true })} placeholder="Password" />
            </div>

            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
              Deactivate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
