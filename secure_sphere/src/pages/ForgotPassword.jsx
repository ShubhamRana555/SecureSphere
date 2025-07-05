// src/pages/ForgotPassword.jsx
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async ({ email }) => {
    try {
      await axios.post("/auth/forgot-password", { email });
      setMessage("Reset link sent. Check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-xl font-semibold text-center">Forgot Password</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center">{message}</p>}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" placeholder="Enter your email" {...register("email", { required: true })} />
            </div>

            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
