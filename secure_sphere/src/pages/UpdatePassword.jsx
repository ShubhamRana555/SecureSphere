import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

export default function UpdatePassword() {
  const { token } = useAuthStore();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.put("/user/me/update-password", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Password updated!");
      reset();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <input {...register("originalPassword")} type="password" placeholder="Current Password" />
      <input {...register("newPassword")} type="password" placeholder="New Password" />
      <input {...register("confirmNewPassword")} type="password" placeholder="Confirm New Password" />
      <button type="submit">Update Password</button>
    </form>
  );
}
