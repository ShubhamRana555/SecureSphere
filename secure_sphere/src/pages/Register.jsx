import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore.js';

export default function Register() {
  const { register: registerUser, loading, error } = useAuthStore();
  const { register, handleSubmit} = useForm();

  const onSubmit = async (data) => {
    await registerUser(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow w-80 space-y-4">
        <h2 className="text-xl font-semibold text-center">Register</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          {...register("fullname", { required: true })}
          placeholder="Full Name"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          {...register("username", { required: true })}
          placeholder="Username"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );

}








