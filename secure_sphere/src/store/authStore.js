import axios from "axios";
import zustand from "zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// configure axios base URL globally
axios.defaults.baseURL = "http://localhost:3000/api/v1";
axios.defaults.withCredentials = true;

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            error: null,

            login: async (email, password) => {
                try {
                    set({loading: true, error: null});
                    const response = await axios.post("/auth/login", 
                    { 
                        email,
                        password
                    });

                    const { accessToken } = response.data.data;
                    set({ token: accessToken });

                    // Fetch user data after login
                    await get().fetchProfile();
                } catch (err) {
                    set({ error: err.response?.data?.message || "Login failed"});
                } finally {
                    set({ loading: false });
                }
            },

            register: async (userData) => {
                try {
                    set({ loading: true, error: null });
                    const response = await axios.post("/auth/register", userData);
                    const { accessToken } = response.data.data;
                    set({ token: accessToken });

                    await get().fetchProfile();

                } catch (err) {
                    set({ error: err.response?.data?.message || "Registration failed" });
                }
                finally {
                    set({ loading: false });
                }
            },

            fetchProfile: async () => {
                try {
                    const response = await axios.get("/user/me", {
                        headers: {
                            Authorization: `Bearer ${get().token}`
                        }
                    });
                    set({ user: response.data.data});
                } catch (error) {
                    set({ error: error.response?.data?.message || "Failed to fetch profile" }); 
                }
            },

            logout: async () => {
                try {
                    const response = await axios.post("/auth/logout", {},{
                        headers: {
                            Authorization: `Bearer ${get().token}`
                        }
                    });

                    set({ user: null, token: null });
                    localStorage.removeItem("auth");
                } catch (err) {
                    set({ error: err.response?.data?.message || "Logout failed" }); 
                }
            }

        }),
        {
            name: "auth"
        }
    )
)


