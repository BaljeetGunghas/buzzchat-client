"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";


const nameRegex = /^[A-Za-z\s]{3,}$/;

export default function EditProfilePage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    date_of_birth: "",
    gender: "M", // default gender
  });

  const [avatarPreview, setAvatarPreview] = useState("/images/default-avatar.png");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone_number: user.phone_number || "",
        date_of_birth: user.date_of_birth?.substring(0, 10) || "",
        gender: user.gender || "M",
      });
      setAvatarPreview(
        user.profile_picture
          ? `${user.profile_picture}`
          : user.gender === "F"
            ? "/images/default-f.png"
            : "/images/default-m.png"
      );
    }
  }, [user]);


  useEffect(() => {
    // Update default avatar when gender changes
    if (!avatarFile) {
      setAvatarPreview(
        user?.profile_picture ? user.profile_picture :
          form.gender === "F"
            ? "/images/default-f.png"
            : "/images/default-m.png"
      );
    }
  }, [form.gender, avatarFile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 👇 Basic validation
    if (!nameRegex.test(form.name.trim())) {
      toast.error("Name must be at least 3 letters and contain only alphabets and spaces.");
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(form.phone_number)) {
      toast.error("Phone number must be a valid 10-digit number.");
      setLoading(false);
      return;
    }


    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("phone_number", form.phone_number);
      formData.append("date_of_birth", form.date_of_birth);
      formData.append("gender", form.gender);
      if (avatarFile) {
        formData.append("profile_picture", avatarFile);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}auth/profile-update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.output === 1) {
        toast.success("Profile updated successfully!");
        const user = response.data.jsonResponse.user;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          dispatch(loginSuccess({ user, token: localStorage.getItem("token") || "" }));
          localStorage.setItem("user", JSON.stringify(user));
        }
        router.push("/chat");
      } else {
        toast.error(response.data.message || "Failed to update profile.");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-black dark:via-gray-900 dark:to-gray-800 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 border border-yellow-300 dark:border-yellow-600 space-y-6"
      >
        <h2 className="text-3xl font-bold mb-5">{user?.profile_picture && user?.date_of_birth ? "Edit Profile" : "Complete Profile"}</h2>

        {/* Avatar upload */}
        <div className="flex flex-col items-center relative">
          <Image
            src={avatarPreview}
            alt="Avatar"
            width={100}
            height={100}
            className="h-32 w-32 rounded-full border-4 border-yellow-400 object-cover"
          />
          <button
            type="button"
            className="text-xs mt-2 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full transition"
            onClick={() => fileRef.current?.click()}
          >
            Change Avatar
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            maxLength={10}
            value={form.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
