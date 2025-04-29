import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  user_id: number;
  name: string;
  email: string;
  role: "buyer" | "seller";
  is_active: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: "buyer" | "seller" | null;
  login: (token: string, user: User) => void;
  register: (token: string, user: User) => void;
  logout: () => void;
  getToken: () => string | null; // Add the getToken function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"buyer" | "seller" | null>(null);

  // Check for existing tokens and user data on initial load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const parsedUser = JSON.parse(userData) as User;
      setIsAuthenticated(true);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
  }, []);

  // Login function
  const login = (token: string, user: User) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
    setRole(user.role);
  };

  // Register function
  const register = (token: string, user: User) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
    setRole(user.role);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  // GetToken function
  const getToken = (): string | null => {
    return localStorage.getItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, register, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
