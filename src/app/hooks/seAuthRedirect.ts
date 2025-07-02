"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("token");  // <-- inside useEffect

    if (token) {
      router.replace("/chat");
    } 
    
  }, [router]);
}
