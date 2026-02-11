import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import * as api from "../api";

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "admin" | "client";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const verifyToken = async () => {
      if (token) {
        try {
          const userData = await api.getCurrentUser();
          if (mounted) setUser(userData);
        } catch {
          if (mounted) {
            localStorage.removeItem("token");
            setToken(null);
          }
        }
      }
      if (mounted) setLoading(false);
    };
    
    verifyToken();
    
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (username: string, password: string) => {
    const response = await api.login(username, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem("token", response.token);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    const response = await api.register(username, email, password, firstName, lastName);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem("token", response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isClient: user?.role === "client",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
