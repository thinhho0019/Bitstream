import ButtonLoginGoogle from "@/components/buttonLoginGoogle";

export default function LoginPage() {
    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="max-w-sm w-full text-gray-600 space-y-8">
                <div className="text-center">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
                        <p>
                            Don't have an account?{" "}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
                <form   className="space-y-4">
                    <div>
                        <label className="font-medium">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="font-medium">Password</label>
                        <input
                            type="password"
                            required
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
                    <ButtonLoginGoogle  />
                </div>
                <div className="text-center">
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>
            </div>
        </main>
    );
}