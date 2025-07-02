"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}

function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState("");

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setPasswordMatchError("Passwords do not match.");
        } else {
            setPasswordMatchError("");
        }
    }, [password, confirmPassword]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !email) {
            toast.error("Missing token or email in the link.");
            return;
        }

        if (password !== confirmPassword) {
            setPasswordMatchError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}auth/reset-password`,
                {
                    token,
                    email,
                    password,
                },
                { withCredentials: true }
            );

            if (response.data.output) {
                toast.success("Password reset successful! Please login.", {
                    action: {
                        label: "Login",
                        onClick: () => router.push("/auth/login"),
                    },
                });
            } else {
                toast.error(response.data.message || "Reset failed.");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                toast.error(
                    axiosError.response?.data?.message || error.message || "Something went wrong. Try again."
                );
            } else {
                toast.error("Something went wrong. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-black dark:via-gray-900 dark:to-gray-800 p-6">
            <form
                onSubmit={handleReset}
                className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl border border-yellow-300 dark:border-yellow-500"
            >
                <h2 className="text-2xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
                    Reset Your Password 🔐
                </h2>

                {/* Password Input */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full mb-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Password Mismatch Error */}
                {passwordMatchError && (
                    <p className="text-red-500 text-sm mb-4">{passwordMatchError}</p>
                )}

                <button
                    type="submit"
                    disabled={loading || !!passwordMatchError}
                    className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition disabled:opacity-60"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}
