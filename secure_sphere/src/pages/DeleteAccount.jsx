import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const { register, handleSubmit, reset } = useForm();
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.confirm !== "DELETE") {
      return alert("You must type 'DELETE' to confirm");
    }

    try {
      await axios.delete("/user/me/delete-account", {
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logout();
      navigate("/register");
    } catch (err) {
      alert(err.response?.data?.message || "Account deletion failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <p>Type <strong>DELETE</strong> to confirm account deletion.</p>
      <input {...register("confirm")} placeholder='Type "DELETE"' />
      <button type="submit">Delete Account</button>
    </form>
  );
}
