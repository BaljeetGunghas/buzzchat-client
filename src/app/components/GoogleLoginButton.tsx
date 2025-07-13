// components/GoogleLoginButton.tsx
"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/slices/authSlice";
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

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;

      if (!token) {
        toast.error("Google login failed");
        return;
      }

      // Optional: You can use this if needed later
      // const decoded = jwtDecode<GoogleJwtPayload>(token);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/google-login`, {
        token,
      });

      const { jsonResponse } = response.data;

      dispatch(loginSuccess(jsonResponse));
      localStorage.setItem("token", jsonResponse.token);
      toast.success("Google login successful!");
      router.push("/chat");
    } catch (error) {
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
