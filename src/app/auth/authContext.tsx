// auth/useAuth.tsx
"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from "react";
import { useInitializeUser } from "../hooks/useInitializeUser";
import { useAuthRedirect } from "../hooks/seAuthRedirect";
import { User } from "@/app/auth/type";
import { useSocketSetup } from "../hooks/useSocketSetup";

// ✅ Auth context type
interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  useInitializeUser();
  useAuthRedirect();
  useSocketSetup();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
