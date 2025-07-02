"use client";

import { useEffect, useState } from "react";
import socket from "../../socket";
import {
  fetchMessages,
  sendMessage as sendMsgAPI,
} from "@/app/API/chatAPI";
import { ChatMessage } from "@/app/API/types/message";
import { Conversation } from "@/app/API/types/conversation";
import MessageInput from "./MessageInput";
import { fetchUserConversations } from "@/app/API/conversationsAPI";

interface Props {
  friendId: string;
  userId: string;
}

interface UIMessage extends ChatMessage {
  fromMe: boolean;
}

export default function MessageWindow({ friendId, userId }: Props) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  // const [conversationId, setConversationId] = useState<string | null>(null);

  // Load conversation and its messages
  useEffect(() => {
    if (userId && friendId) {
      loadConversation();
    }
  }, [friendId, userId]);

  const loadConversation = async () => {
    try {
      const conversations = await fetchUserConversations(userId);

      // Find conversation that includes both users
      const existing = conversations.find((c: Conversation) =>
        c.participants.some((p) => p._id === friendId)
      );

      if (existing) {
        // setConversationId(existing._id);
        const msgs = await fetchMessages(existing._id);
        const formatted = msgs.map((m) => ({
          ...m,
          fromMe: m.senderId === userId,
        }));
        setMessages(formatted);
      } else {
        // setConversationId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };

  useEffect(() => {
    const onReceive = (msg: ChatMessage) => {
      if (msg.senderId === friendId && msg.receiverId === userId) {
        setMessages((prev) => [...prev, { ...msg, fromMe: false }]);
      }
    };

    socket.on("receive_message", onReceive);
    return () => {
      socket.off("receive_message", onReceive);
    };
  }, [friendId, userId]);

  // Send a new message
  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    try {
      const response = await sendMsgAPI({
        senderId: userId,
        receiverId: friendId,
        content: message.trim(),
      });

      const newMsg = response.jsonResponse.message;

      // setConversationId(convoId);
      setMessages((prev) => [...prev, { ...newMsg, fromMe: true }]);
      const vibreate = new Audio("/sounds/message-send.mp3");
      vibreate.play().catch((err) => {
        console.warn("🔇 Beep sound blocked or failed:", err.message);
      });
      socket.emit("send_message", newMsg);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900 space-y-3">
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
      </div>

      {/* Input Area */}
      <MessageInput onSendMessage={handleSend} />
    </div>
  );
}
