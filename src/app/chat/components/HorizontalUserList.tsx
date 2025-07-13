"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import { FiSearch } from "react-icons/fi";
import { User } from "@/app/auth/type";
import axiosInstance from "@/app/utils/axiosInstance";
import { SearchUserResponse } from "@/app/api/types/user";

interface HorizontalUserListProps {
  users: User[]; // Online users passed from parent
  onSelectUser: (userId: string) => void;
  onClose: () => void;
}

const HorizontalUserList: React.FC<HorizontalUserListProps> = ({
  users,
  onSelectUser,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Keep track of ongoing fetch to cancel if new request comes
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      const response = await axiosInstance.get<SearchUserResponse>(
        `/users/searchbyname?query=${encodeURIComponent(term)}`,
        { signal: controller.signal }
      );

      setSearchResults(response.data?.jsonResponse || []);
   } catch (error: unknown) {
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        console.log(axiosError);
        
      } else {
        console.log("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounce input changes for search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 800);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // If search term exists, display searchResults else online users
  const displayUsers = searchTerm.trim() ? searchResults : users;

  return (
    <div className="relative px-1">
      {/* Search input */}
      <div className="relative mb-3">
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          autoComplete="off"
        />
      </div>

      {/* Label */}
      <div className="mb-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
        {searchTerm ? "Search Results:" : "Online Users:"}{" "}
        <span className="text-yellow-500 font-bold">{displayUsers.length}</span>
      </div>

      {/* User list */}
      <div className="flex overflow-x-auto gap-4 pb-2 pl-2 pr-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent">
        {loading ? (
          <div className="flex gap-4 pb-2 pl-2 pr-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center min-w-[64px] animate-pulse"
                aria-hidden="true"
              >
                <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-gray-200" />
                <div className="mt-2 h-3 w-16 rounded bg-gray-300 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        ) : displayUsers.length > 0 ? (
          displayUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                onSelectUser(user._id);
                onClose();
              }}
              title={user.name}
              className="flex flex-col items-center min-w-[64px] hover:scale-[1.04] transition-transform"
              type="button"
            >
              <div className="relative w-16 h-16">
                <Image
                  src={
                    user?.profile_picture
                      ? user.profile_picture
                      : user.gender === "F"
                        ? "/images/default-f.png"
                        : "/images/default-m.png"
                  }
                  alt={user.name}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-yellow-500 object-cover h-16"
                  priority={false}
                  draggable={false}
                />
                <span
                  className={clsx(
                    "absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white dark:border-gray-900",
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </div>
              <span className="mt-1 text-xs text-center text-gray-700 dark:text-gray-300 max-w-[72px] truncate">
                {user.name}
              </span>
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default HorizontalUserList;
