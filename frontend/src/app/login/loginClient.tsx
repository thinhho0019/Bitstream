'use client';
import ButtonLoginGoogle from "@/components/buttonLoginGoogle";
import { useEffect, useState } from "react";
import { toast } from 'sonner'
import { signIn } from "next-auth/react"
import { getFingerprint } from '@/helper/fingerPrints'
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";
export default function LoginPageClient() {
    const [email, setEmail] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [password, setPassword] = useState("");
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here
        if (!email || !password) {
            toast.error("Please enter both email and password.");
            return;
        }
        const resultPrintFingers = await getFingerprint();
        console.log(resultPrintFingers);
        if (!resultPrintFingers) {
            toast.error("Failed to retrieve fingerprint.");
            return;
        }
        const res = await signIn("credentials", {
            email,
            password,
            finger_print: resultPrintFingers,
            redirect: false,
        });
        if (!res || res.error) {
            toast.error("Login failed. Please check your credentials.");
            return;
        }
        const data = await res;
        if (!data || !data.ok) {
            toast.error("Login failed. Please check your credentials.");
            return;
        }
        if (!Object.hasOwn(data, "access_token")) {
            toast.error("Login failed. Please check your credentials.");
        }
        toast.success("Login successful");
        router.push("/dashboard");
    };
    useEffect(() => {
        setHasMounted(true);
    }, []);
    useEffect(() => {
        const paramError = searchParams.get("error");
        if (paramError) {
            toast.error(paramError);
        }
    }, [hasMounted, searchParams]);
    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="max-w-sm w-full text-gray-600 space-y-8">
                <div className="text-center">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
                        <p>
                            Dont have an account?{" "}
                            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
                <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="email" className="font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}

                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}

                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                    >
                        Sign in
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
                <div className="text-center">
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>
            </div>
        </main>
    );
}