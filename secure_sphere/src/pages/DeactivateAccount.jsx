import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function DeactivateAccount() {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleDeactivate = async () => {
    const confirm = window.confirm("Are you sure you want to deactivate your account?");
    if (!confirm) return;

    try {
      await axios.delete("/user/me/deactivate-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logout();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Deactivation failed");
    }
  };

  return (
    <div className="deactivate">
      <h2>Deactivate Your Account</h2>
      <button className="border bg-red-400" onClick={handleDeactivate}>Deactivate Account</button>
    </div>
  );
}
