"use client";

import { User } from "@/app/auth/type";
import ChatActions from "./HeaderOptions";
import Image from "next/image";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { getFrindProfile } from "@/app/API/userAPI";


interface Props {
  friendId: string;
}

export default function Header({ friendId }: Props) {
  const [friend, setFriend] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!friendId) {
      setFriend(null);
      return;
    }

    const fetchFriendProfile = async () => {
      try {
        setLoading(true);
        const response  = await getFrindProfile(friendId)
        setFriend(response.jsonResponse);
      } catch (error) {
        console.error("Failed to fetch friend profile", error);
        setFriend(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendProfile();
  }, [friendId]);

  if (loading) {
    return (
      <header className="flex items-center justify-between px-4 pb-2 pt-7 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Loading...</div>
      </header>
    );
  }

  if (!friend) {
    return (
      <header className="flex items-center justify-between px-4 pb-2 pt-7 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Select a friend to chat</div>
      </header>
    );
  }

  const avatar = friend.profile_picture
    ? friend.profile_picture
    : friend.gender === "F"
    ? "/images/default-f.png"
    : "/images/default-m.png";

  const isOnline = friend.status === "online";

  return (
    <header className="flex items-center justify-between px-4 pb-2 pt-7 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* User Info */}
      <div className="flex items-center gap-3 pl-10 md:pl-0">
        <div className="relative w-10 h-10 rounded-full  border-2 border-yellow-400">
          <Image src={avatar} alt={friend.name} className="rounded-full" fill style={{ objectFit: "cover" }} />
          {isOnline && (
            <span className="absolute bottom-0 right-0 block z-20 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 bg-green-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{friend.name}</p>
          <p className={`text-xs  ${isOnline ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <ChatActions />
    </header>
  );
}
