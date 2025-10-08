import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  const navigation = {
    product: [
      { name: "Start Practicing", href: "/practice" },
      { name: "Watch Demo", href: "/demo" },
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact Us", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

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
      className="bg-black border-t border-gray-800/50"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
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
              <span className="text-2xl font-bold text-white">Pravya AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your smart companion for interview preparation, practice, and
              performance tracking.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3 md:grid-cols-3">
            <FooterColumn title="Product" links={navigation.product} />
            <FooterColumn title="Company" links={navigation.company} />
            <FooterColumn title="Legal" links={navigation.legal} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-800/50 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link
              href="/twitter"
              aria-label="Twitter"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Twitter className="h-6 w-6" />
            </Link>
            <Link
              href="/github"
              aria-label="GitHub"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Github className="h-6 w-6" />
            </Link>
            <Link
              href="/linkedin"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {currentYear} Pravya AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
