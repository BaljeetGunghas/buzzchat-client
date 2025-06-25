"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatList from "./components/ChatList";
import MessageWindow from "./components/MessageWindow";
import MessageInput from "./components/MessageInput";
import { FaBars } from "react-icons/fa";
import socket from "../socket";

export default function ChatPage() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeChatFriendId, setActiveChatFriendId] = useState<number | null>(null);

  const toggleSidebar = () => setSidebarVisible((v) => !v);

    useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected with id:", socket.id);
      // Join with userId (replace with real user id)
      socket.emit("join", "user123");
    });

    socket.on("receive_message", (data) => {
      console.log("Message received:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
    };
  }, []);


  const handleSelectFriend = (friendId: number) => {
    setActiveChatFriendId(friendId);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-7 left-1 z-50 p-2 rounded-md bg-yellow-400 text-black md:hidden"
        aria-label="Toggle sidebar"
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onSelectFriend={handleSelectFriend}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 md:ml-full">
        <Header />
        {/* 
          For demo: Pass friend id as prop to MessageWindow to show relevant chat.
          Currently, MessageWindow is static, you can later extend it to load chat data dynamically 
        */}
        {activeChatFriendId ? (
          <MessageWindow key={activeChatFriendId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a friend to start chatting.
          </div>
        )}
        <MessageInput />
      </div>
    </div>
  );
}
