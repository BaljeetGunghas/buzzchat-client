"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaGoogle, FaPhone } from "react-icons/fa";
import Link from "next/link";
import { useAuthRedirect } from "@/app/hooks/seAuthRedirect";
import { toast } from "sonner";

import { registerRequest } from "@/redux/slices/authSlice";
import { RegisterForm } from "../type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import GoogleLoginButton from "@/app/components/GoogleLoginButton";



const schema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(3),
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string().required("Password is required").min(6),
  phone_number: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
});

export default function RegisterPage() {
  useAuthRedirect();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, loading, token } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token ? token : ''); // store token on successful login
      toast.success("Registration successful!");
      router.push("/profile/edit");
    }
    if (error) {
      toast.error(error);
    }
  }, [error, router, token]);


  const onSubmit = (data: RegisterForm) => {
    dispatch(registerRequest(data));
  };

  return (
    <main className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen p-6 transition-colors duration-300 bg-white dark:bg-black">

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-gradient-to-br from-pink-400 via-yellow-400 to-purple-500 opacity-30 rounded-full filter blur-3xl animate-ai-float1" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-sky-400 via-cyan-500 to-teal-400 opacity-10 rounded-full filter blur-2xl animate-ai-float2" />

        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-gradient-to-br from-indigo-400 to-purple-600 opacity-15 rounded-full filter blur-2xl animate-ai-float3" />
      </div>

      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl border border-yellow-300 dark:border-yellow-500"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">
          Create Account 🚀
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Join <span className="text-yellow-500 font-semibold">BuzzChat</span> and start connecting instantly.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          {/* Phone Number */}
          <div className="relative">
            <FaPhone className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
            <input
              type="tel"
              placeholder="Mobile Number"
              maxLength={10}
              minLength={10}
              {...register("phone_number")}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
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
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer text-black font-semibold py-2 rounded-lg transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-2">
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
          <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
        </div>

        {/* Google Sign-In */}
        <div className="my-4">
          <GoogleLoginButton />
        </div>

        {/* Navigation */}
        <div className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
