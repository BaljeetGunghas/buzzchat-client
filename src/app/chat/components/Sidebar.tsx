"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { FiChevronDown, FiLogOut, FiUser, FiChevronUp } from "react-icons/fi";
import ChatList from "./ChatList";
import Link from "next/link";
import SearchPeople from "@/app/components/chat/SearchPeople";
import ThemeToggle from "@/app/components/ThemeToggle";
import { logoutRequest } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import HorizontalUserList from "./HorizontalUserList";


interface SidebarProps {
    visible: boolean;
    onClose: () => void;
    onSelectFriend: (friendId: string) => void;
}

export default function Sidebar({ visible, onClose, onSelectFriend }: SidebarProps) {
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.auth.user);
    const onLineUserProfile = useSelector((state: RootState) => state.onlineUser.userProfiles);

    const [activeTab, setActiveTab] = useState<"friends" | "requests" | "groups">("friends");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showChats, setShowChats] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [searchMode, setSearchMode] = useState(false);


    const currentUser = {
        name: "You",
        avatar: user?.profile_picture ? user.profile_picture : user?.gender === "F"
            ? "/images/default-f.png"
            : "/images/default-m.png",
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
                    "fixed top-0 left-0 bg-white dark:bg-gray-900 border-r dark:border-gray-700 p-4 space-y-6 z-50 w-[80%] md:w-72 transform transition-transform duration-300 ease-in-out overflow-y-auto max-h-screen min-h-screen",
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
                                src={`${currentUser.avatar}`}
                                alt="You"
                                width={45}
                                height={45}
                                className="rounded-full border-2 border-yellow-500 object-cover w-12 h-12"
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
                            onClick={() => setActiveTab(tab as "friends" | "requests" | "groups")}
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
                    <HorizontalUserList
                        users={onLineUserProfile ?? []}
                        onSelectUser={onSelectFriend}
                        onClose={onClose}
                    />
                )}


                {activeTab === "requests" && (
                    <>
                        {!searchMode ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                                <p className="mb-4 text-sm">No requests.</p>
                            </div>
                        ) : (
                            <SearchPeople onBack={() => setSearchMode(false)} />
                        )}
                    </>
                )}


                {activeTab === "groups" && (
                    <p className="text-sm py-9 text-gray-500 dark:text-gray-400 text-center">No group chats yet.</p>
                )}




                <div className="flex flex-col justify-end flex-grow w-full h-full">
                    {showChats ? (
                        <div className="animate-fade-in-up w-full">
                            {/* Expanded Header */}
                            <div
                                onClick={() => setShowChats(false)}
                                className="w-full cursor-pointer flex items-center justify-between px-4 py-2 rounded-t-lg bg-gray-50 dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide select-none">
                                        Chats
                                    </h3>
                                </div>
                                <FiChevronUp className="text-lg text-gray-600 dark:text-gray-300" />
                            </div>

                            {/* Chat List Section */}
                            <div className="w-full bg-white dark:bg-gray-900 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                                <div className="p-4">
                                    {user?._id && (
                                        <ChatList onSelectFriend={onSelectFriend} userId={user._id} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up w-full">
                            {/* Collapsed Header - Adjusted for mobile */}
                            <div
                                onClick={() => setShowChats(true)}
                                className="w-full cursor-pointer flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide select-none">
                                        Chats
                                    </h3>
                                </div>
                                <FiChevronDown className="text-lg text-gray-600 dark:text-gray-300" />
                            </div>
                        </div>
                    )}
                </div>




                {/* Theme Toggle */}
                <div className="absolute bottom-4 right-4 z-10">
                    <ThemeToggle />
                </div>

            </aside>
        </>
    );
}
