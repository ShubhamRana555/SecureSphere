import axios from "axios";
import { create } from "zustand";
import { useAuthStore } from "./authStore.js";

axios.defaults.baseURL = "http://localhost:3000/api/v1";
axios.defaults.withCredentials = true;

export const useAdminStore = create((set) => ({
    users: [],
    loading: false,
    error: null,

    fetchAllUsers: async() => {
        const token = useAuthStore.getState().token;

        try {
            set({ loading: true, error: null });
            
            const response = await axios.get("/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ users: response.data.data});

        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to fetch users" }); 
        }
        finally{
            set({ loading: false });
        }

    }

}))
