import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const { user, token, fetchProfile } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullname: user?.fullname || "",
      username: user?.username || ""
    }
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("username", data.username);
      if (data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      await axios.put("/user/me/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      await fetchProfile();
      alert("Profile updated successfully!");
      navigate("/profile");

    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("fullname", { required: true })} placeholder="Full Name" className="w-full border px-3 py-2"/>
        {errors.fullname && <p className="text-red-500 text-sm">Full name is required</p>}

        <input {...register("username", { required: true })} placeholder="Username" className="w-full border px-3 py-2"/>
        {errors.username && <p className="text-red-500 text-sm">Username is required</p>}

        <input type="file" {...register("avatar")} className="w-full"/>
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Profile</button>
      </form>
    </div>
  );
}



