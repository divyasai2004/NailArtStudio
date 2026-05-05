import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // sessionStorage is per-tab — admin in one tab, customer in another, no collision
  const [authUser, setAuthUser] = useState(() => {
    const rawUser = sessionStorage.getItem("auth_user");
    return rawUser ? JSON.parse(rawUser) : null;
  });
  const [token, setToken] = useState(() => sessionStorage.getItem("auth_token"));

  const login = (userData) => {
    const nextToken = userData?.token || null;
    setAuthUser(userData || null);
    setToken(nextToken);

    if (userData) {
      sessionStorage.setItem("auth_user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("auth_user");
    }

    if (nextToken) {
      sessionStorage.setItem("auth_token", nextToken);
    } else {
      sessionStorage.removeItem("auth_token");
    }
  };

  const logout = () => {
    setAuthUser(null);
    setToken(null);
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
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

