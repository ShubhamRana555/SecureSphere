import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import axios from "axios";
import { useState } from "react";

export default function DeactivateAccount() {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await axios.patch("/users/me/deactivate");
      setMsg("Account deactivated successfully.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to deactivate account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-xl font-semibold">Deactivate Account</CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            Temporarily deactivate your account. You can reactivate it anytime by logging in again.
          </p>
          {msg && <p className="text-sm text-center">{msg}</p>}

          <Button onClick={handleDeactivate} disabled={loading} className="w-full bg-yellow-600 hover:bg-yellow-700">
            {loading ? "Processing..." : "Deactivate Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
