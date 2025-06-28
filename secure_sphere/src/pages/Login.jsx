import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore.js';

export default function Login(){
  const { login, loading, error} = useAuthStore();
  const { register, handleSubmit} = useForm();

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <form 
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white p-6 rounded shadow w-80 space-y-4'>
        
        <h2 className='text-xl font-semibold text-center'>Login</h2>

        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        
        <input 
        type="email"
        placeholder='Email'
        className='w-full border px-3 py-2 rounded' 
        {...register("email", {required: true})}
        />

        <input 
        type="password"
        placeholder='Password'
        className='w-full border px-3 py-2 rounded'
        {...register("password", {required: true, minLength: 4})} 
        />

        <button 
        type="submit"
        disabled={loading}
        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
          {loading ? "Loading...": "Login"}
        </button>

      </form>
    </div>
  )

}

