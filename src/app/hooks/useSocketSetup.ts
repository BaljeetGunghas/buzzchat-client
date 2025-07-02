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
      const beep = new Audio("/sounds/message-rec.mp3");
      const vibreate = new Audio("/sounds/vibrating.mp3");
      beep.play().catch((err) => {
        console.warn("🔇 Beep sound blocked or failed:", err.message);
      });
      vibreate.play().catch((err) => {
        console.warn("🔇 Beep sound blocked or failed:", err.message);
      });

      toast.info(`New message recived : ${data.content}`);

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
      socket.disconnect(); // optional: reset
      socket.connect();
    } else {
      handleConnect(); // manually emit if already connected
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("online_users", handleOnlineUsers);
    };
  }, [USER, USER?._id, dispatch,]);
};
