import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore.js";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";

export default function Login() {
  const { login, loading, error } = useAuthStore();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-xl font-semibold">Login</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" {...register("email", { required: true })} placeholder="Email" />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" {...register("password", { required: true })} placeholder="Password" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
