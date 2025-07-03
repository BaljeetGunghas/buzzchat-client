"use client";

import { useState } from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";


interface Props {
  onSendMessage: (message: string) => void;
}

export default function MessageInput({ onSendMessage }: Props) {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    // setShowPicker(false);
  };

  return (
    <div className="relative" >

      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setShowPicker(false)}
            aria-hidden="true"
          />

          {/* Emoji Picker Container */}
          <div
            className="
        absolute
        bottom-20
        left-[45%]
        -translate-x-1/2
        z-50
        md:left-1/4
        w-full
        max-w-xs
        sm:translate-x-0
      "
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        </div>
      )}


      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="text-yellow-500 hover:text-yellow-600 transition cursor-pointer"
          aria-label="Add emoji"
        >
          <FaSmile size={24} />
        </button>

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 outline-none text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400"
        />

        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full p-3 transition"
          aria-label="Send message"
        >
          <FaPaperPlane size={20} />
        </button>
      </form>
    </div>
  );
}
