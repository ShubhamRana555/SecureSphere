import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const { register, handleSubmit } = useForm();
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setMsg(null);
    try {
      await axios.delete("/users/me", { data });
      setMsg("Account deleted permanently.");
      setTimeout(() => navigate("/register"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-xl font-semibold">Delete Account</CardHeader>
        <CardContent>
          {msg && <p className="text-sm text-center mb-4">{msg}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-red-500 text-center">
              This action is irreversible. Please confirm your password.
            </p>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" {...register("password", { required: true })} placeholder="Password" />
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
