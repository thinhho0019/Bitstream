import Image from "next/image";
export default function BottomNavigation() {
    return (
        <nav className="bottom-0 left-0 right-0 z-50 shadow-md bg-black h-35">
            <div className="flex justify-around py-3 text-white">
                <div className="h-25 flex justify-center items-center">
                    <Image
                        src="/images/logo.png"
                        alt="Logo-bitstream"
                        width={120}
                        height={40}
                        className="scale-110"
                    />
                </div>
                <div className="flex justify-center items-center">
                    <p className="font-bold ">Contact:</p>
                    <p className="ml-2"> hoxuanthinh68@gmail.com</p>
                </div>
            </div>
        </nav>
    );
}
