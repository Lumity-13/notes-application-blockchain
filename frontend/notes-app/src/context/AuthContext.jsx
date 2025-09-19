import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem("notesapp_auth");
      return saved ? JSON.parse(saved) : { user: null };
    } catch {
      return { user: null };
    }
  });

  useEffect(() => {
    localStorage.setItem("notesapp_auth", JSON.stringify(auth));
  }, [auth]);

  const login = (user) => setAuth({ user });
  const logout = () => setAuth({ user: null });

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
