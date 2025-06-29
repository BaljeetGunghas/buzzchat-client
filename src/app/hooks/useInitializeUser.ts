// src/hooks/useInitializeUser.ts
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { registerSuccess } from "@/redux/slices/authSlice";
import { User } from "@/app/auth/type";

export const useInitializeUser = (propUser?: User) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let user: User | null = null;
    let token: string | null = null;

    if (propUser) {
      user = propUser;
      token = localStorage.getItem("token");
    } else {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        try {
          user = JSON.parse(storedUser);
          token = storedToken;
        } catch (err) {
          console.error("Failed to parse user from localStorage", err);
        }
      }
    }

    if (user && token) {
      dispatch(registerSuccess({ user, token }));
    }
  }, [propUser, dispatch]);
};
