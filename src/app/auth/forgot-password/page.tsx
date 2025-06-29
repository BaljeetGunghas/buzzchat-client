"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";
import { resetPassword } from "@/app/API/authAPI";
import { toast } from "sonner";
import { ImSpinner2 } from "react-icons/im";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resetPassword(email);
      if (res.output) {
        toast.success(res.message);
        setEmail(""); // Clear input after success
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
      
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          Enter your registered email and we&apos;ll send you a reset link.
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
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-2 rounded-lg transition flex items-center justify-center ${
            loading
              ? "bg-yellow-300 text-gray-600 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500 text-black"
          }`}
        >
          {loading ? (
            <>
              <ImSpinner2 className="animate-spin mr-2 text-lg" /> Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>

        <div className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Go back to{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
