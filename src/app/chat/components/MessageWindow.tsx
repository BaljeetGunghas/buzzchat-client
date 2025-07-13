"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchMessages,
  sendMessage as sendMsgAPI,
} from "@/app/api/chatAPI";
import { ChatMessage } from "@/app/api/types/message";
import { Conversation } from "@/app/api/types/conversation";
import MessageInput from "./MessageInput";
import { fetchUserConversations } from "@/app/api/conversationsAPI";
import { fetchChatsRequest } from "@/redux/slices/chatListSlice";
import { useAppDispatch } from "@/redux/hooks";
import socket from "@/app/socket-client";

interface Props {
  friendId: string;
  userId: string;
}

interface UIMessage extends ChatMessage {
  fromMe: boolean;
}

export default function MessageWindow({ friendId, userId }: Props) {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [conversationId, setConverSationID] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };
  const loadConversation = async () => {
    try {
      const conversations = await fetchUserConversations(userId);

      const existing = conversations.find((c: Conversation) =>
        c.participants.some((p) => p._id === friendId)
      );

      if (existing) {
        setConverSationID(() => existing?._id)
        const msgs = await fetchMessages(existing._id);
        const formatted = msgs.map((m) => ({
          ...m,
          fromMe: m.senderId === userId,
        }));
        setMessages(formatted);

        // Ensure scroll after rendering
        setTimeout(scrollToBottom, 150);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };
  // Load messages when chat is opened
  useEffect(() => {
    if (userId && friendId) {
      loadConversation();
    }
  }, [friendId, userId]);



  useEffect(() => {
    const onReceive = (msg: ChatMessage) => {
      socket.emit("mark_as_read", { conversationId: conversationId, userId });
      if (msg.senderId === friendId && msg.receiverId === userId) {
        setMessages((prev) => [...prev, { ...msg, fromMe: false }]);
        setTimeout(scrollToBottom, 100);
      }
    };

    socket.on("receive_message", onReceive);
    return () => {
      socket.off("receive_message", onReceive);
    };
  }, [friendId, userId]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    try {
      const response = await sendMsgAPI({
        senderId: userId,
        receiverId: friendId,
        content: message.trim(),
      });

      const newMsg = response.jsonResponse.message;

      setMessages((prev) => [...prev, { ...newMsg, fromMe: true }]);
      setTimeout(scrollToBottom, 100);
      dispatch(fetchChatsRequest(userId));

      const vibreate = new Audio("/sounds/message-send.mp3");
      vibreate.play().catch((err) => {
        console.warn("🔇 Sound blocked:", err.message);
      });

      socket.emit("send_message", newMsg);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Message area */}
      <div
        className="flex-1 p-4 bg-white dark:bg-gray-900 space-y-3 overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: "83vh", minHeight: "83vh" }}
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xs break-words ${msg.fromMe
                ? "bg-yellow-400 text-black rounded-br-none"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {/* 👇 PLACE THE REF **inside** the scrollable container */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSendMessage={handleSend} />
    </div>
  );
}
