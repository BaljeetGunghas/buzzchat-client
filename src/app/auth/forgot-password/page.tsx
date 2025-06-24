"use client";

import { useState, useEffect } from "react";
import { resetPassword } from "../authAPI";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await resetPassword(email);
    if (res.success) {
      setMessage("A password reset link has been sent to your email.");
    } else {
      setMessage("Email not found or failed to send reset link.");
    }
  };

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-black dark:via-gray-900 dark:to-gray-800 p-6">
      <form
        onSubmit={handleReset}
        data-aos="fade-up"
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl border border-yellow-300 dark:border-yellow-500"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
          Forgot Password 🔑
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter your registered email and we'll send you a reset link.
        </p>

        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="text-green-600 text-sm text-center mt-4">{message}</p>
        )}

        <div className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Go back to{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
