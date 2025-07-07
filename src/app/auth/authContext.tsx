// auth/useAuth.tsx
"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from "react";
import { useInitializeUser } from "../hooks/useInitializeUser";
import { useAuthRedirect } from "../hooks/seAuthRedirect";
import { User } from "@/app/auth/type";
import { useSocketSetup } from "../hooks/useSocketSetup";
import { GoogleOAuthProvider } from '@react-oauth/google';


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
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthContext.Provider value={{ user, setUser }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
