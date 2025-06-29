import { useAuthStore } from "../store/authStore.js";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, logout, loading} = useAuthStore();

  if(!user) return <p className="text-center mt-10">Loading Profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Welcome {user.fullname || user.username}</h2>
      <p><strong>Email: </strong> {user.email}</p>
      <p><strong>Username: </strong> {user.username}</p>
      <p><strong>Role: </strong> {user.role}</p>

      <button
        onClick={logout}
        disabled={loading}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      ></button> 
      <Link to="/update-profile">Edit</Link>
    </div>
  )

}





