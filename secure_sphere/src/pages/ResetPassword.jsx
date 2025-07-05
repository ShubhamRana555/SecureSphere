// src/pages/ResetPassword.jsx
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      await axios.post(`/auth/reset-password/${token}`, data);
      setMessage("Password reset successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-xl font-semibold">Reset Password</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center">{message}</p>}

            <div>
              <Label htmlFor="password">New Password</Label>
              <Input type="password" {...register("password", { required: true })} />
            </div>

            <Button type="submit" className="w-full">Reset Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
