"use client";

import ConfirmModal from "@/app/components/common/ConfirmModal";
import { useState, useRef, useEffect } from "react";
import { FaVideo, FaPhone, FaEllipsisV } from "react-icons/fa";

export default function ChatActions() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"block" | "report" | "mute" | null>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirm = () => {
    if (confirmAction === "block") {
      alert("User Blocked ✅");
    } else if (confirmAction === "report") {
      alert("User Reported 🚨");
    } else if (confirmAction === "mute") {
      alert("Notifications Muted 🔕");
    }
    setConfirmOpen(false);
    setShowMenu(false);
  };

  const handleOpenConfirm = (action: "block" | "report" | "mute") => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const handleViewProfile = () => {
    alert("View Profile Clicked");
    setShowMenu(false);
  };

  return (
    <>
      {/* Main Action Buttons */}
      <div className="flex items-center space-x-3 md:space-x-5 text-gray-600 dark:text-gray-300 relative">
        <button
          title="Video Call"
          className="bg-gray-200 h-10 w-10 rounded-full flex justify-center items-center cursor-pointer"
        >
          <FaVideo className="hover:text-yellow-500 transition text-xl" />
        </button>
        <button
          title="Voice Call"
          className="bg-gray-200 h-10 w-10 rounded-full flex justify-center items-center cursor-pointer"
        >
          <FaPhone className="hover:text-yellow-500 transition text-xl" />
        </button>

        {/* More Options */}
        <div ref={menuRef} className="relative">
          <button
            title="More Options"
            onClick={() => setShowMenu((prev) => !prev)}
            className="bg-gray-200 h-10 w-10 rounded-full flex justify-center items-center cursor-pointer"
          >
            <FaEllipsisV className="hover:text-yellow-500 transition text-xl" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
              <button
                onClick={() => handleOpenConfirm("block")}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-700 rounded-t-md"
              >
                Block User
              </button>
              <button
                onClick={() => handleOpenConfirm("report")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Report User
              </button>
              <button
                onClick={() => handleOpenConfirm("mute")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Mute Notifications
              </button>
              <button
                onClick={handleViewProfile}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-md"
              >
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={
          confirmAction === "block"
            ? "Block this user?"
            : confirmAction === "report"
            ? "Report this user?"
            : "Mute notifications?"
        }
        description={
          confirmAction === "block"
            ? "You won't be able to send or receive messages from this user."
            : confirmAction === "report"
            ? "We'll review this user for any violations."
            : "You will stop receiving notifications from this user."
        }
        confirmText={
          confirmAction === "block"
            ? "Block"
            : confirmAction === "report"
            ? "Report"
            : "Mute"
        }
      />
    </>
  );
}
