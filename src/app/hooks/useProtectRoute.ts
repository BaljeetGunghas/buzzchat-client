"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useProtectRoute() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  return loading;
}
