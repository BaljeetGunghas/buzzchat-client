// auth/useAuth.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useInitializeUser } from "../hooks/useInitializeUser";
import { useAuthRedirect } from "../hooks/seAuthRedirect";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import socket from "../socket";
import { toast } from "sonner";
import { fetchChatsRequest } from "@/redux/slices/chatListSlice";
import { fetchOnlineUsersByIds } from "@/redux/slices/onlineUsersSlice";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user: USER } = useSelector((state: RootState) => state.auth);

  const [user, setUser] = useState(null);
  useInitializeUser();
  useAuthRedirect()

  useEffect(() => {
    if (!USER?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join", USER._id); // Emit only when connected
    };

    const handleReceiveMessage = (data: any) => {
      console.log("Message received:", data);
      toast.info(`New message from ${data.senderName}: ${data.content}`);
      dispatch(fetchChatsRequest(USER._id));
    };

    const handleOnlineUsers = (onlineUserIds: string[]) => {
      console.log("Online users:", onlineUserIds);
      dispatch(fetchOnlineUsersByIds(onlineUserIds));
    };

    socket.on("connect", handleConnect);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("online_users", handleOnlineUsers);
    };
  }, [USER]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
