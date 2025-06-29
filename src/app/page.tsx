"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoLoader from "./components/Loader/LogoLoader";
import Navbar from "./components/Navbar";

// MOCK function to check if user is logged in
// Replace with your actual auth logic or API call
function useIsLoggedIn() {
  // For demo, try to read token from localStorage or your auth store
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Example: check for token in localStorage
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  return loggedIn;
}

export default function HomePage() {
  const router = useRouter();

  const loggedIn = useIsLoggedIn();

  // Handle Launch Chat click
  function handleLaunchClick() {
    if (loggedIn) {
      router.push("/chat");
    } else {
      router.push("/auth/login");
    }
  }

  // Render only when loggedIn state resolved (not null)
  if (loggedIn === null) {
    return (
      <LogoLoader />
    );
  }

  return (
    <main className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen p-6 transition-colors duration-300 bg-white dark:bg-black">
      <Navbar />

      {/* Glowing AI Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-gradient-to-br from-pink-400 via-yellow-400 to-purple-500 opacity-30 rounded-full filter blur-3xl animate-ai-float1" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-sky-400 via-cyan-500 to-teal-400 opacity-10 rounded-full filter blur-2xl animate-ai-float2" />

        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-gradient-to-br from-indigo-400 to-purple-600 opacity-15 rounded-full filter blur-2xl animate-ai-float3" />
      </div>
      {/* Hero Section */}
      <section className="z-10 text-center max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-gray-900 dark:text-white">
          Welcome to <span className="text-yellow-500">BuzzChat</span> 🚀
        </h1>

        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8">
          A real-time chat and social app to stay connected with your people.
          Group chats, friend requests, live reactions — all in one place.
        </p>

        <button
          onClick={handleLaunchClick}
          className="inline-block bg-yellow-400 hover:bg-yellow-500 cursor-pointer text-black text-base md:text-lg px-6 py-3 rounded-lg transition duration-200 shadow"
        >
          Launch Chat
        </button>
      </section>

      {/* Footer / Credits */}
      <footer className="z-10 mt-16 text-sm text-gray-500 dark:text-gray-400">
        Made with ❤️ by the BuzzChat Team
      </footer>
    </main>
  );
}
