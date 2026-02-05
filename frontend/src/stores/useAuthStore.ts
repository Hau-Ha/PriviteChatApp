import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });

      //  call api
      await authService.signUp(username, password, email, firstName, lastName);

      toast.success(" Account created successfully. Please sign in.");
    } catch (error) {
      console.error(error);
      toast.error(" Failed to create account. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);

      await get().fetchMe();

      toast.success(" Signed in successfully.");
    } catch (error) {
      console.error(error);
      toast.error(
        " Failed to sign in. Please check your credentials and try again."
      );
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success(" Signed out successfully.");
    } catch (error) {
      console.error(error);
      toast.error("   Failed to sign out. Please try again.");
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error(" Failed to fetch user data. Please sign in again.");
    } finally {
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refreshToken();

      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      toast.error(" Failed to refresh token. Please sign in again.");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
