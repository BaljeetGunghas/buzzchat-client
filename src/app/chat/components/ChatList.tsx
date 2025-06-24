"use client";

import { FaCircle } from "react-icons/fa";

const chats = [
  {
    id: 1,
    name: "Bob",
    userid:1,
    lastMessage: "Hey, how’s it going?",
    time: "2:45 PM",
    online: true,
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Work Group",
    userid:3,
    lastMessage: "Meeting starts at 4pm",
    time: "1:15 PM",
    online: false,
    unreadCount: 0,
  },
  {
    id: 3,
    name: "Charlie",
    userid:4,
    lastMessage: "Got the files, thanks!",
    time: "Yesterday",
    online: true,
    unreadCount: 5,
  },
];

interface Props {
    onSelectFriend: (friendId: number) => void;
}

export default function ChatList({ onSelectFriend }: Props) {
  return (
    <div className="overflow-y-auto h-full p-2 space-y-3 bg-gray-50 dark:bg-gray-800">
      <ul className="flex flex-col space-y-2 ">
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={()=>onSelectFriend(chat.userid)}
            className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-600 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-black ${
                  chat.online ? "bg-green-400" : "bg-gray-400"
                }`}
              >
                {chat.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-white">{chat.name}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[180px]">
                  {chat.lastMessage}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-1">
              <span className="text-xs text-gray-500 dark:text-gray-300">{chat.time}</span>
              {chat.unreadCount > 0 && (
                <span className="text-xs bg-yellow-400 text-black px-2 rounded-full font-semibold">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
