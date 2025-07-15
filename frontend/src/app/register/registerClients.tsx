'use client';
import ButtonLoginGoogle from "@/components/buttonLoginGoogle";
import { useState } from "react";
import { toast } from "sonner";
export const metadata = {
    title: 'Login Page',
    describe: 'Bitstream follow bitcoin every where'
};

export default function RegisterPageClient() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email || !password) {
            toast.error("Please enter all fields.");
            return;
        }
        if (password !== passwordAgain) {
            toast.error("Passwords do not match. Please try again.");
            return;
        }
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            toast.error(errorData.message || "Failed to register account");
            return;
        }
        const data = await res.json();
        console.log("Registration successful:", data);
        toast.success("Registration successful");
    }
    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="max-w-sm w-full text-gray-600 space-y-8">
                <div className="text-center">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Now! You Should Register Account</h3>
                        <p>
                            Dont have an account?{" "}
                            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
                <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="email" className="font-medium">Email</label>
                        <input
                            id="email"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                           
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="font-medium">Password</label>
                        <input
                            id="password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                       
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="password_again" className="font-medium">Password Again</label>
                        <input
                            id="password_again"
                            type="password"
                            onChange={(e) => setPasswordAgain(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                    >
                        Sign up
                    </button>
                </form>
                <div className="relative">
                    <span className="block w-full h-px bg-gray-300"></span>
                    <p className="inline-block w-fit text-sm bg-white px-2 absolute -top-2 left-1/2 -translate-x-1/2">
                        Or continue with
                    </p>
                </div>
                <div className="space-y-4 text-sm font-medium">
                    <ButtonLoginGoogle />
                </div>
            </div>
        </main>
    );
}