"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevents hydration mismatch

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => toggleTheme()}
      className={`transition-all cursor-pointer duration-300 ease-in-out relative w-14 h-8 rounded-full px-1 flex items-center ${
        isDark ? "bg-yellow-400" : "bg-gray-700"
      }`}
      title="Toggle Theme"
    >
      <div
        className={`absolute left-1 top-1 w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md transform transition-transform ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? <FaMoon className="text-yellow-500 text-sm" /> : <FaSun className="text-gray-700 text-sm" />}
      </div>
    </button>
  );
}
