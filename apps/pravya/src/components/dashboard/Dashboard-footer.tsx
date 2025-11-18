import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";
import { HoverGradient } from "../HoverGradient";
import { boolean } from "zod";
import GithubLogo from "../GithubLogo";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa6";

interface DashboardFooterProps {
  isDark: boolean;
}

export const DashboardFooter = ({ isDark }: DashboardFooterProps) => {
  const currentYear = new Date().getFullYear();

  const FooterColumn = ({
    title,
    links,
  }: {
    title: string;
    links: { name: string; href: string }[];
  }) => (
    <div>
      <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
        {title}
      </h3>
      <div className="mt-4 flex flex-col space-y-4">
        {links.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-base text-gray-400 hover:text-white transition-colors duration-200"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <footer
      className="dark:bg-neutral-950/70 border-t "
      aria-labelledby="footer-heading"
    >
      <HoverGradient
        gradientSize={300}
        fromColor={isDark ? "#262626" : "#D9D9D955"}
        toColor={isDark ? "#262626" : "#D9D9D955"}
        opacity={0.8}
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-2 lg:px-8">
          <div className="pb-8 xl:grid xl:grid-cols-4 xl:gap-8">
            {/* Logo + Description */}
            <div className="space-y-4 xl:col-span-1">
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo/pravya-logo1.png"
                  alt="Pravya AI Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                  priority
                />
                <span className="text-2xl font-bold dark:text-white">
                  Pravya AI
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t  border-gray-800/50 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2 mt-4">
              <Link
                target="_blank"
                href="/twitter"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {/* <Twitter className="h-6 w-6" /> */}
                < FaTwitter className="h-6 w-6"/>
              </Link>
              <Link
                target="_blank"
                href="https://github.com/netizen-om/Pravya-AI"
                aria-label="GitHub"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaGithub className="h-6 w-6"/>
              </Link>
              <Link
                target="_blank"
                href="/linkedin"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {/* <Linkedin className="h-6 w-6" /> */}
                <FaLinkedinIn className="h-6 w-6" />
              </Link>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; {currentYear} Pravya AI. All rights reserved.
            </p>
          </div>
        </div>
      </HoverGradient>
    </footer>
  );
};
