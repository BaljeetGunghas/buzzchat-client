"use client";

import { User } from "@/app/auth/type";
import Image from "next/image";
import { format } from "date-fns";
import {
    FaEnvelope,
    FaPhone,
    FaShieldAlt,
    FaTransgender,
    FaBirthdayCake,
    FaCalendarAlt,
    FaUserSlash,
    FaComments,
    FaVideo,
    FaBell,
} from "react-icons/fa";
import { MdClose, MdOutlineLogin } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onBlock?: (userId: string) => void;
}

export default function UserInfoModal({ isOpen, onClose, user, onBlock }: Props) {
    if (!isOpen || !user) return null;

    const avatar = user.profile_picture
        ? user.profile_picture
        : user.gender === "F"
            ? "/images/default-f.png"
            : "/images/default-m.png";

    const handleBlock = () => {
        if (onBlock) onBlock(user._id);
        onClose();
    };

    const actions = [
        { icon: <FaComments size={20} />, label: "Message" },
        { icon: <FaPhone size={20} />, label: "Call" },
        { icon: <FaVideo size={20} />, label: "Video" },
        { icon: <FaBell size={20} />, label: "Notify" },
        { icon: <HiOutlineMail size={20} />, label: "Mail" },
        {
            icon: <FaUserSlash size={20} />,
            label: "Block",
            action: handleBlock,
            color: "text-red-600 dark:text-red-400",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative z-60 w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-2xl animate-fade-in-up border dark:border-gray-800
                      mx-auto
                      sm:mx-0
                      overflow-auto
                      max-h-[90vh]
                      ">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        User Info
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="
              w-8 h-8
              flex items-center justify-center
              text-xl font-bold
              text-gray-500
              border border-gray-300
              rounded-full
              hover:text-red-600 hover:border-red-600
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
            "
                    >
                        <MdClose />
                    </button>
                </div>

                {/* Profile */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-500 shadow-lg flex-shrink-0">
                        <Image src={avatar} alt={user.name} fill className="object-cover" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                            {user.name}
                            {user.isVerified && <FaShieldAlt className="text-green-500" />}
                        </h3>
                        <p
                            className={`text-sm ${user.status === "online"
                                ? "text-green-500"
                                : "text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            {user.status === "online" ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* User Info Section */}
                <div className="space-y-4 mb-6 text-sm text-gray-700 dark:text-gray-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    Email
                                </p>
                                <p className="break-all">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaPhone className="text-green-600 dark:text-green-400" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    Phone
                                </p>
                                <p>{user.phone_number || "Not provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaTransgender className="text-purple-600 dark:text-purple-400" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    Gender
                                </p>
                                <p>
                                    {user.gender === "F"
                                        ? "Female"
                                        : user.gender === "M"
                                            ? "Male"
                                            : "Other"}
                                </p>
                            </div>
                        </div>

                        {user.date_of_birth && (
                            <div className="flex items-center gap-2">
                                <FaBirthdayCake className="text-pink-500 dark:text-pink-400" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        Date of Birth
                                    </p>
                                    <p>{format(new Date(user.date_of_birth), "dd MMM yyyy")}</p>
                                </div>
                            </div>
                        )}

                        {user.lastLogin && user.status !== "online" && (
                            <div className="flex items-center gap-2 col-span-2">
                                <MdOutlineLogin className="text-orange-500 dark:text-orange-400" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        Last Login
                                    </p>
                                    <p>{format(new Date(user.lastLogin), "dd MMM yyyy, hh:mm a")}</p>
                                </div>
                            </div>
                        )}

                        {user.createdAt && (
                            <div className="flex items-center gap-2 col-span-2">
                                <FaCalendarAlt className="text-yellow-500 dark:text-yellow-400" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        Joined
                                    </p>
                                    <p>{format(new Date(user.createdAt), "dd MMM yyyy")}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid Action Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 text-center mb-6">
                    {actions.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={item.action || (() => alert(`${item.label} clicked`))}
                            className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition ${item.color || "text-gray-800 dark:text-white"
                                }`}
                            type="button"
                        >
                            {item.icon}
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-semibold"
                    type="button"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
