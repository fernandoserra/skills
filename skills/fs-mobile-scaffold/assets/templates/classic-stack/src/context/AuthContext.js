import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { http, setAuthToken } from "../utils/http";
import { Endpoints } from "../values/endpointsString";

const TOKEN_KEY = "auth_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then((stored) => {
      if (stored) {
        setToken(stored);
        setAuthToken(stored);
      }
      setLoading(false);
    });
  }, []);

  async function login(email, password) {
    const { access_token } = await http.post(Endpoints.login, { email, password });
    await SecureStore.setItemAsync(TOKEN_KEY, access_token);
    setAuthToken(access_token);
    setToken(access_token);
  }

  async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthToken(null);
    setToken(null);
  }

  const value = { isLoggedIn: !!token, token, login, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
