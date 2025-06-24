"use client";

import { FaVideo, FaPhone, FaEllipsisV } from "react-icons/fa";
import ChatActions from "./HeaderOptions";

export default function Header() {
  return (
    <header className="flex items-center justify-between  px-4 pb-2  pt-7 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* User Info */}
      <div className="flex items-center gap-3 pl-10 md:pl-0">
        <div className="w-10 h-10 rounded-full bg-yellow-300 dark:bg-yellow-500 flex items-center justify-center text-black font-bold">
          A
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Alice</p>
          <p className="text-xs text-green-600 dark:text-green-400">Online</p>
        </div>
      </div>

      {/* Actions */}
     <ChatActions />
    </header>
  );
}
