import React, { useState, useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";
import { User } from "@/app/auth/type";
import { FiSearch } from "react-icons/fi";

interface HorizontalUserListProps {
  users: User[];
  onSelectUser: (userId: string) => void;
  onClose: () => void;
}

const HorizontalUserList: React.FC<HorizontalUserListProps> = ({
  users,
  onSelectUser,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

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
        />
      </div>

      {/* Online user count */}
      <div className="mb-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
        Online Users:{" "}
        <span className="text-yellow-500 font-bold">{filteredUsers.length}</span>
      </div>

      {/* User list */}
      <div className="flex overflow-x-auto gap-4 pb-2 pl-2 pr-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                onSelectUser(user._id);
                onClose();
              }}
              title={user.name}
              className="flex flex-col items-center min-w-[64px] hover:scale-[1.04] transition-transform"
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
                />
                <span
                  className={clsx(
                    "absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white dark:border-gray-900",
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </div>
              <span
                className="mt-1 text-xs text-center text-gray-700 dark:text-gray-300 max-w-[72px] truncate"
              >
                {user.name}
              </span>
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">No users found</p>
        )}
      </div>
    </div>
  );
};

export default HorizontalUserList;
