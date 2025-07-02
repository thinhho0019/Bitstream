'use client';
import Link from "next/link";
import Image from "next/image";
export default function NavBar() {
    return (
        <nav className="p-4" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-xl font-bold">
                    <Image
                        src="/images/logo.png" // ← dẫn từ thư mục public
                        alt="Logo-bitstream"
                        width={120}
                        height={40}
                    />
                </Link>
                <div className="space-x-4">
                    <Link href="/login" className="text-gray-200 hover:text-white">
                        SignIn
                    </Link>
                </div>
            </div>
        </nav>
    );
}