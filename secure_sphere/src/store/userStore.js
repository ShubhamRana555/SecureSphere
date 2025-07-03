// src/store/userStore.js
import axios from "axios";
import { create } from "zustand";

axios.defaults.baseURL = "http://localhost:3000/api/v1";
axios.defaults.withCredentials = true;

export const useUserStore = create((set, get) => ({
  loading: false,
  error: null,
  message: null,

  updatePassword: async (data, token) => {
    try {
      set({ loading: true, error: null, message: null });
      await axios.put("/users/me/update-password", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ message: "Password updated successfully" });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update password" });
    } finally {
      set({ loading: false });
    }
  },

  reactivateAccount: async (token) => {
    try {
      set({ loading: true, error: null, message: null });
      await axios.put("/users/me/reactivate-account", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ message: "Account reactivated successfully" });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to reactivate account" });
    } finally {
      set({ loading: false });
    }
  },

  deactivateAccount: async (token) => {
    try {
      set({ loading: true, error: null, message: null });
      await axios.delete("/users/me/deactivate-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ message: "Account deactivated successfully" });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to deactivate account" });
    } finally {
      set({ loading: false });
    }
  },

  deleteAccount: async (token, password, confirmText) => {
    try {
      set({ loading: true, error: null });

      await axios.delete("/users/me/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          password,
          confirm: confirmText,
        },
      });

      set({ message: "Account deleted successfully" });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete account" });
    } finally {
      set({ loading: false });
    }
  },
  clearMessages: () => set({ error: null, message: null }),
}));
