import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore.js";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardHeader, CardContent } from "@/components/ui/card.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { useEffect } from "react";

export default function Register() {
  const { register: registerUser, loading, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm();

  // Watch selected role
  const role = watch("role");

  // Register the custom role field manually
  useEffect(() => {
    register("role", { required: true });
  }, [register]);

  const onSubmit = async (data) => {
    await registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-xl font-semibold">Register</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input {...register("fullname", { required: true })} placeholder="Full Name" />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input {...register("username", { required: true })} placeholder="Username" />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" {...register("email", { required: true })} placeholder="Email" />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" {...register("password", { required: true })} placeholder="Password" />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setValue("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
