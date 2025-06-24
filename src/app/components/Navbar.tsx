import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    return (
        <nav className="w-full fixed top-0 z-50 px-4 py-3 bg-gradient-to-l to-white from-transparent backdrop-blur-2xl border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">

            {/* Left: Logo */}
            <div className="flex items-center space-x-2 bg-transparent">
                <Image
                    src="/images/logoTrans.png"
                    alt="Logo"
                    width={140}
                    height={40}
                    className="object-contain"
                    priority
                />
            </div>

            {/* Right: Theme Toggle */}
            <ThemeToggle />
        </nav>
    );
}
