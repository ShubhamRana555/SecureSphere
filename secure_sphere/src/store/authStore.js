import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// configure axios base URL globally
axios.defaults.baseURL = "http://localhost:3000/api/v1";
axios.defaults.withCredentials = true;

//persist -> Adds localStorage.setItem("auth", JSON.stringify(store)) when the state updates. It basically helps to persist the state across page reloads otherwise the state will be lost on page reloads and user will be logged out.
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.post("/auth/login", {
            email,
            password,
          });

          const { accessToken } = response.data.data;
          set({ token: accessToken });

          // Fetch user data after login
          await get().fetchProfile();
          return true;
        } catch (err) {
          set({ error: err.response?.data?.message || "Login failed" });
          return false;
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
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async () => {
        try {
          const response = await axios.get("/users/me", {
            headers: {
              Authorization: `Bearer ${get().token}`,
            },
          });
          set({ user: response.data.data });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch profile",
          });
        }
      },

      logout: async () => {
        try {
          await axios.post(
            "/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${get().token}`,
              },
            }
          );
        } catch (err) {
          console.warn("Logout failed but continuing cleanup:", err.message);
          // Don't return here — continue cleanup
        } finally {
          // Clear everything regardless of API success
          set({
            user: null,
            token: null,
            error: null,
          });
          localStorage.removeItem("auth");
          sessionStorage.removeItem("auth");
        }
      },
    }),
    {
      name: "auth",
    }
  )
);
