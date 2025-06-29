"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MessageWindow from "./components/MessageWindow";
import { FaBars } from "react-icons/fa";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function ChatPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeChatFriendId, setActiveChatFriendId] = useState<string | null>(null);

  const toggleSidebar = () => setSidebarVisible((v) => !v);

  const handleSelectFriend = (friendId: string) => {
    setActiveChatFriendId(friendId);
    setSidebarVisible(false)
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
        {activeChatFriendId && <Header friendId={activeChatFriendId} />}
        {activeChatFriendId && user?._id ? (
          <MessageWindow key={activeChatFriendId} friendId={activeChatFriendId} userId={user?._id} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a friend to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
