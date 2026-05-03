import { createContext, useContext, useState, ReactNode } from "react";

type Role = "member" | "admin" | null;

interface AuthContextType {
  role: Role;
  login: (role: "member" | "admin") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    const stored = localStorage.getItem("auth_role");
    return (stored as Role) ?? null;
  });

  const login = (newRole: "member" | "admin") => {
    setRole(newRole);
    localStorage.setItem("auth_role", newRole);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("auth_role");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
