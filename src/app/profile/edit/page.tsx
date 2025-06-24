"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    name: "John Doe",
    username: "johndoe",
    bio: "Let’s build the future 🚀",
  });
  const router = useRouter();

  const [avatar, setAvatar] = useState("/images/default-avatar.png");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real scenario, send data and avatar to backend

    toast.success("Profile updated successfully!");
    return router.push('/chat')
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-white dark:bg-black text-gray-900 dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 border border-yellow-300 dark:border-yellow-600 space-y-6"
      >
        <h2 className="text-3xl font-bold mb-2">Edit Profile</h2>

        {/* Avatar upload */}
        <div className="flex flex-col items-center relative">
          <Image
            src={avatar}
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

        {/* Full Name */}
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

        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
