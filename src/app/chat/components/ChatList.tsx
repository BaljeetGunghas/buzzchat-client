"use client";

import { formatDistanceToNow } from "date-fns";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchChatsRequest } from "@/redux/slices/chatListSlice";

interface Props {
  onSelectFriend: (friendId: string) => void;
  userId: string;
}

export default function ChatList({ onSelectFriend }: Props) {
  const dispatch = useAppDispatch();

  const { chats } = useSelector(
    (state: RootState) => state.chatList
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchChatsRequest(user?._id))
    }
  }, [user])

  return (
    <div className="overflow-y-auto h-full p-2 space-y-3 bg-gray-50 dark:bg-gray-800">
      <ul className="flex flex-col space-y-2">
        {chats?.map((chat) => {
          const user = chat.participants;
          if (!user) return null;

          return (
            <li
              key={chat._id}
              onClick={() => onSelectFriend(user._id)}
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-600 transition"
            >
              {/* Left: Profile + Name + Last Message */}
              <div className="flex items-center gap-3">
                {/* Avatar with status */}
                <div className="relative w-10 h-10">
                  <Image
                    src={
                      user.profile_picture ||
                      (user.gender === "F"
                        ? "/images/default-f.png"
                        : "/images/default-m.png")
                    }
                    width={40}
                    height={40}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${user.status === "online" ? "bg-green-500" : "bg-gray-400"
                      } border-white dark:border-gray-900`}
                  />
                </div>

                {/* Name + Last Message */}
                <div className="flex flex-col">
                  <span
                    className="font-semibold text-gray-900 dark:text-white max-w-[120px] truncate"
                    title={user.name}
                  >
                    {user.name}
                  </span>

                  {/* Last message with "You:" if sentByMe */}
                  <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[160px] truncate flex items-center gap-1">
                    {chat.sentByMe && (
                      <span className="text-yellow-500 font-medium">You:</span>
                    )}
                    {chat.lastMessage || "No messages yet"}
                  </span>
                </div>
              </div>

              {/* Right: Time + Unread */}
              <div className="flex flex-col items-end space-y-1">
                {chat.lastMessageTime && (
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    {formatDistanceToNow(new Date(chat.lastMessageTime), {
                      addSuffix: true,
                    })}
                  </span>
                )}
                {!chat.isRead && !chat.sentByMe && (
                  <span className="text-xs bg-yellow-400 text-black px-2 rounded-full font-semibold">
                    1
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
