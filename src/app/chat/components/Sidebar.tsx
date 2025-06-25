"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { FiChevronDown, FiLogOut, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ChatList from "./ChatList";
import Link from "next/link";
import SearchPeople from "@/app/components/chat/SearchPeople";
import ThemeToggle from "@/app/components/ThemeToggle";
import { logoutRequest } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";


const friends = [
    {
        id: 1,
        name: "Alice",
        online: true,
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        id: 2,
        name: "Bob",
        online: false,
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        id: 3,
        name: "Charlie",
        online: true,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },

    // Add more friends as needed
];

interface SidebarProps {
    visible: boolean;
    onClose: () => void;
    onSelectFriend: (friendId: number) => void;
}

export default function Sidebar({ visible, onClose, onSelectFriend }: SidebarProps) {
    const dispatch = useAppDispatch()
    const [activeTab, setActiveTab] = useState<"friends" | "requests" | "groups">("friends");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showChats, setShowChats] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [searchMode, setSearchMode] = useState(false);


    const currentUser = {
        name: "You",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleLogout = async () => {
        dispatch(logoutRequest());
    }


    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black opacity-80 z-40 md:hidden",
                    visible ? "block" : "hidden"
                )}
                onClick={onClose}
            />

            <aside
                className={clsx(
                    "fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r dark:border-gray-700 p-4 space-y-6 z-50 w-[80%] md:w-72 transform transition-transform duration-300 ease-in-out",
                    {
                        "-translate-x-full": !visible,
                        "translate-x-0": visible,
                    },
                    "md:translate-x-0 md:static md:flex md:flex-col md:w-[25%]"
                )}
            >
                {/* Top bar with logo and avatar */}
                <div className="flex items-center justify-between py-2 pt-1.5   border-b dark:border-gray-700">
                    <Image
                        src="/images/logoTrans.png"
                        alt="logo"
                        width={150}
                        height={50}
                        className="object-cover"
                    />
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-1 cursor-pointer"
                        >
                            <Image
                                src={currentUser.avatar}
                                alt="You"
                                width={45}
                                height={45}
                                className="rounded-full border-2 border-yellow-500"
                            />
                            <FiChevronDown className="text-gray-600 dark:text-white" />
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-md rounded-lg w-40 p-2 z-50">
                                <Link href={'/profile/edit'} className="flex items-center w-full px-3 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                    <FiUser className="mr-2" /> Edit Profile
                                </Link>
                                <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                    <FiLogOut className="mr-2" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-between mb-4">
                    {["friends", "requests", "groups"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={clsx(
                                "flex-1 text-sm font-medium px-3 py-2 rounded-md transition cursor-pointer",
                                {
                                    "bg-yellow-400 text-black": activeTab === tab,
                                    "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800":
                                        activeTab !== tab,
                                }
                            )}
                        >
                            {tab === "friends" ? "Friends" : tab === "requests" ? "Requests" : "Groups"}
                        </button>
                    ))}
                </div>

                {/* Horizontal Friends List */}
                {activeTab === "friends" && (
                    <div className="relative">
                        <div className="flex overflow-x-auto space-x-4 pb-2 pr-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent">
                            {friends.map((friend) => (
                                <button
                                    key={friend.id}
                                    onClick={() => {
                                        onSelectFriend(friend.id);
                                        onClose();
                                    }}
                                    className="flex flex-col items-center min-w-[64px] cursor-pointer"
                                >
                                    <div className="relative w-16 h-16">
                                        <Image
                                            src={friend.avatar}
                                            alt={friend.name}
                                            width={64}
                                            height={64}
                                            className="rounded-full object-cover border-2 border-yellow-400"
                                        />
                                        <span
                                            className={clsx(
                                                "absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white dark:border-gray-900",
                                                friend.online ? "bg-green-500" : "bg-gray-400"
                                            )}
                                        />
                                    </div>
                                    <span className="mt-1 text-xs text-center text-gray-700 dark:text-gray-300">
                                        {friend.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                {activeTab === "requests" && (
                    <>
                        {!searchMode ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                                <p className="mb-4 text-sm">No friend requests.</p>
                                <button
                                    onClick={() => setSearchMode(true)}
                                    className="px-4 py-2 text-sm bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                                >
                                    Search People
                                </button>
                            </div>
                        ) : (
                            <SearchPeople onBack={() => setSearchMode(false)} />
                        )}
                    </>
                )}


                {activeTab === "groups" && (
                    <p className="text-sm py-9 text-gray-500 dark:text-gray-400 text-center">No group chats yet.</p>
                )}

                {/* Toggle for Chat List */}
                <div className="flex justify-between items-center mt-6 bg-gray-100 p-3 rounded-md">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Chats
                    </h3>
                    <button onClick={() => setShowChats(!showChats)} className="text-gray-500 dark:text-gray-300 text-sm cursor-pointer">
                        {showChats ? <FiChevronLeft className="text-xl font-semibold" /> : <FiChevronRight className="text-xl font-semibold" />}
                    </button>
                </div>
                {showChats && <ChatList onSelectFriend={onSelectFriend} />}



                     {/* Theme Toggle */}
                      <div className="absolute bottom-4 right-4 z-10">
                      <ThemeToggle />
                      </div>

            </aside>
        </>
    );
}
