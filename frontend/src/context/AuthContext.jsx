import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    const rawUser = localStorage.getItem("auth_user");
    return rawUser ? JSON.parse(rawUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));

  const login = (userData) => {
    const nextToken = userData?.token || null;
    setAuthUser(userData || null);
    setToken(nextToken);

    if (userData) {
      localStorage.setItem("auth_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("auth_user");
    }

    if (nextToken) {
      localStorage.setItem("auth_token", nextToken);
    } else {
      localStorage.removeItem("auth_token");
    }
  };

  const logout = () => {
    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const value = useMemo(
    () => ({
      authUser,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [authUser, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

