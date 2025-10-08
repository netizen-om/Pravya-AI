import Image from "next/image";
import Link from "next/link";
import LeftArrow from "@/components/icons/LeftArrow";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-black min-h-screen">
      <div className="flex overflow-x-auto overflow-y-auto justify-center items-center items-start px-4 min-h-screen bg-black max-sm:px-2 max-sm:min-h-screen">
        {/* Background Image */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none min-h-screen w-auto">
          <Image
            src="/bgImg/background-auth.png"
            alt="Background Image"
            fill
            className="absolute object-cover inset-0 max-w-full align-middle pointer-events-none select-none border-black border-opacity-0 decoration-black decoration-opacity-0 outline-black outline-opacity-0 overflow-x-clip overflow-y-clip size-full text-black text-opacity-0"
            priority
          />
        </div>

        {/* Home Link */}
        <Link
          href="/"
          className="flex absolute top-6 left-6 z-10 gap-0 gap-y-0 justify-center items-center px-4 h-10 text-sm font-semibold leading-5 rounded-2xl border-solid ease-in-out cursor-pointer select-none border-[0.8px] border-black border-opacity-0 decoration-neutral-400 duration-[0.2s] outline-neutral-400 text-neutral-400 transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,visibility,content-visibility,overlay,pointer-events]"
        >
          <LeftArrow />
          Home
        </Link>

        {/* Main Content */}
        <main className="relative z-10 pt-8 w-full max-w-lg max-sm:pt-4 max-sm:max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
} 