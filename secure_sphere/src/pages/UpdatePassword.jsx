import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import axios from "axios";
import { useState } from "react";

export default function UpdatePassword() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setMsg(null);
    try {
      await axios.put("/auth/update-password", data);
      setMsg("Password updated successfully.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-xl font-semibold">Update Password</CardHeader>
        <CardContent>
          {msg && <p className="text-sm text-center mb-4">{msg}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input type="password" {...register("currentPassword", { required: true })} placeholder="Current Password" />
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input type="password" {...register("newPassword", { required: true })} placeholder="New Password" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
