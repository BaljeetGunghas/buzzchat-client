"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const publicPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    if (token) {
      // User is authenticated
      if (isPublicPath) {
        // Already logged in, redirect away from auth pages
        router.replace("/chat");
      }
    } else {
      // User is not authenticated
      if (!isPublicPath) {
        // Trying to access protected page
        router.replace("/");
      }
    }
  }, [router, pathname]);
}
