"use client";

import Image from "next/image";

export default function LogoLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black opacity-60 dark:bg-yellow-100">
      <div className="animate-pulse">
        <Image
          src="/images/logo.png" // Replace with your image path
          alt="Loading"
          width={100}
          height={100}
          priority
          className=" rounded-full bg-amber-300 p-3 z-10 relative"
        />
      </div>
    </div>
  );
}
