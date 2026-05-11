import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("ttm_token");

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axiosClient.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("ttm_token");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const login = ({ token: authToken, user: authUser }) => {
    localStorage.setItem("ttm_token", authToken);
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem("ttm_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      logout
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
