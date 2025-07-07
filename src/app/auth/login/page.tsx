"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "../authContext";
import { toast } from "sonner";
import { useAuthRedirect } from "@/app/hooks/seAuthRedirect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginRequest } from "@/redux/slices/authSlice";
import GoogleLoginButton from "@/app/components/GoogleLoginButton";

type LoginForm = {
    email: string;
    password: string;
};

const schema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string().required("Password is required").min(6),
});

export default function LoginPage() {
    useAuthRedirect();
    const router = useRouter();
    const { setUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const { user, error, loading, token } = useAppSelector((state) => state.auth);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (user) {
            setUser(user);
            localStorage.setItem('token', token || 'demo-token');
            toast.success('Login successful!');
            router.push('/chat');
        }
        if (error) {
            toast.error(error);
        }

    }, [user, error, router, setUser, token]);

    const onSubmit = (data: LoginForm) => {
        dispatch(loginRequest(data));
    };

    return (
        <div className="min-h-screen flex items-center justify-center  p-4">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-gradient-to-br from-pink-400 via-yellow-400 to-purple-500 opacity-30 rounded-full filter blur-3xl animate-ai-float1" />

                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-sky-400 via-cyan-500 to-teal-400 opacity-10 rounded-full filter blur-2xl animate-ai-float2" />

                <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-gradient-to-br from-indigo-400 to-purple-600 opacity-15 rounded-full filter blur-2xl animate-ai-float3" />
            </div>
            <div
                className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl border border-yellow-300 dark:border-yellow-500"
                data-aos="fade-up"
            >
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
                    Welcome Back 👋
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Log in to continue using <span className="text-yellow-500 font-semibold">BuzzChat</span>
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Field */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            {...register("email")}
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...register("password")}
                            className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 cursor-pointer'
                            } text-black font-semibold py-2 rounded-lg transition`}
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-4 flex items-center gap-2">
                    <hr className="flex-grow border-gray-300 dark:border-gray-700" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
                    <hr className="flex-grow border-gray-300 dark:border-gray-700" />
                </div>

                {/* Google Button */}
                <div className="my-4">
                    <GoogleLoginButton />
                </div>

                {/* Navigation Links */}
                <div className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
                    <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <div className="text-center text-sm mt-2 text-gray-600 dark:text-gray-400">
                    Don’t have an account?{" "}
                    <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
