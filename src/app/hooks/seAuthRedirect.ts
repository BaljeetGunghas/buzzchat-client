"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // If token exists, user shouldn't access login or register
      router.replace("/chat");
    }
  }, []);
}
