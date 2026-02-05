import api from "@/lib/axios";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await api.post(
        "/auth/signup",
        {
          username,
          password,
          email,
          firstName,
          lastName,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Sign Up Error:", error);
      throw error;
    }
  },

  signIn: async (username: string, password: string) => {
    try {
      const response = await api.post(
        "/auth/signin",
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      return response.data; // access token or user data
    } catch (error) {
      console.error("Sign In Error:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await api.post("/auth/signout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Sign Out Error:", error);
      throw error;
    }
  },

  fetchMe: async () => {
    try {
      const response = await api.get("/users/me", { withCredentials: true });
      return response.data.user; // user data
    } catch (error) {
      console.error("Fetch Me Error:", error);
      throw error;
    }
  },
  refreshToken: async () => {
    try {
      const response = await api.post(
        "/auth/refresh",
        {},
        { withCredentials: true }
      );
      return response.data.accessToken; // new access token
    } catch (error) {
      console.error("Refresh Token Error:", error);
      throw error;
    }
  },
};
