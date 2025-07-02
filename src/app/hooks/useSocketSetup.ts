// src/hooks/useSocketSetup.ts
import { useEffect } from "react";
import socket from "@/app/socket";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchChatsRequest } from "@/redux/slices/chatListSlice";
import { fetchOnlineUsersByIds } from "@/redux/slices/onlineUsersSlice";

interface MessagePayload {
  senderName: string;
  content: string;
}

export const useSocketSetup = () => {
  const dispatch = useAppDispatch();
  const { user: USER } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!USER?._id) return;

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join", USER._id);
    };

    const handleReceiveMessage = (data: MessagePayload) => {
      console.log("📩 Message received:", data);
      toast.info(`New message from ${data.senderName}: ${data.content}`);
      dispatch(fetchChatsRequest(USER._id));
    };

    const handleOnlineUsers = (onlineUserIds: string[]) => {
      console.log("🟢 Online users:", onlineUserIds);
      dispatch(fetchOnlineUsersByIds(onlineUserIds));
    };

    // Listen for events
    socket.on("connect", handleConnect);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("online_users", handleOnlineUsers);

    // Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect(); // manually emit if already connected
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("online_users", handleOnlineUsers);
    };
  }, [USER,USER?._id, dispatch]);
};
