import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loginUser } from "@/services/auth.service";

export type UserRole = "admin" | "landlord" | "tenant";

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  approved?: boolean;
  status?: "pending" | "approved" | "rejected";
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // restore session on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("homehub_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const userData = await loginUser(email, password);
    localStorage.setItem("homehub_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("homehub_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
