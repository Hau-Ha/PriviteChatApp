import { create } from "zustand";
import { toast } from "sonner";
import type { AuthSate } from "@/types/store";
import { authService } from "@/services/authService";

export const useAuthStore = create<AuthSate>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => set({ accessToken: null, user: null, loading: false }),

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });

      await authService.signUp(username, password, email, firstName, lastName);

      toast.success("Registration successful! Please sign in to continue.");
    } catch (error) {
      console.error(error);
      toast.error(
        "Registration failed. Please check your details and try again."
      );
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(username, password);
      set({ accessToken });

      toast.success("Sign in successful!");
    } catch (error) {
      console.error(error);
      toast.error(
        "Sign in failed. Please check your credentials and try again."
      );
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });

      await authService.signOut();
      get().clearState();

      toast.success("Sign out successful!");
    } catch (error) {
      console.error(error);
      toast.error("Sign out failed. Please try again.");
    } finally {
      set({ loading: false });
    }
  },
}));
