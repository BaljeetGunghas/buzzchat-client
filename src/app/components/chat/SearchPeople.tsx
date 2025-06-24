"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronLeft } from "react-icons/fi";

interface User {
    id: number;
    name: string;
    avatar: string;
}

interface SearchPeopleProps {
    onBack: () => void;
}

const dummyUsers: User[] = [
    { id: 1, name: "David", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
    { id: 2, name: "Emily", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 3, name: "Frank", avatar: "https://randomuser.me/api/portraits/men/53.jpg" },
    { id: 4, name: "Grace", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
];

export default function SearchPeople({ onBack }: SearchPeopleProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = dummyUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Search Header */}
            <div className="flex items-center gap-2 mb-4 overflow-hidden">
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                    <FiChevronLeft size={22} />
                </button>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="flex-1 px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                />
            </div>

            {/* Filtered List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-400">
                {filtered.length > 0 ? (
                    filtered.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <span className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</span>
                            </div>
                            <button className="px-3 py-1 bg-yellow-400 text-sm rounded hover:bg-yellow-500 text-black">
                                Send Request
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                        No users found.
                    </p>
                )}
            </div>
        </div>
    );
}
