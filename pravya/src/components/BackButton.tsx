import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const BackButton = () => {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors duration-200 group"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      Back
    </Link>
  );
};