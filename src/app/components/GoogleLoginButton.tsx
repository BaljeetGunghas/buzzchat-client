// components/GoogleLoginButton.tsx
"use client";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/slices/authSlice"; // adjust if different
import axios from "axios";

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export default function GoogleLoginButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;

      if (!token) return toast.error("Google login failed");

      const decoded = jwtDecode<GoogleJwtPayload>(token);

      const response = await axios.post("http://localhost:5000/api/auth/google-login", {
        token,
      });

      // Assuming your backend returns: { jsonResponse: { user, token }, message }
      const { jsonResponse } = response.data;

      dispatch(loginSuccess(jsonResponse));
      localStorage.setItem("token", jsonResponse.token);
      toast.success("Google login successful!");
      router.push("/chat");
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error("Something went wrong during Google login.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => toast.error("Google login failed")}
    />
  );
}
