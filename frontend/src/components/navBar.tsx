'use client';
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";
export default function NavBar() {
    const { loading, error, user, refetch } = useProfile();
    return (
        <nav className="p-4" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-xl font-bold">
                    <Image className="scale-120"
                        src="/images/logo.png" // ← dẫn từ thư mục public
                        alt="Logo-bitstream"
                        width={120}
                        height={40}
                    />
                </Link>
                {loading ? (
                    <div className="flex space-x-4">
                        <Link href="/login" className="text-gray-200 hover:text-white">
                            SignIn
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md max-w-md">
                        <img
                            src="https://i.pinimg.com/736x/b2/60/94/b26094970505bcd59c2e5fe8b6f41cf0.jpg" // ảnh avatar người dùng
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full object-cover border border-gray-300 bg-gray-100"
                        />
                        <div>
                            <div className="text-xs leading-none space-y-1">
                                <h2 className="font-medium text-gray-800 truncate">{user?.name}</h2>
                                <p className="text-gray-500 truncate">{user?.email}</p>
                                <div className="flex justify-center mt-2">
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/auth/login" })}
                                        className="text-black hover:text-green-400 text-[10px]"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}