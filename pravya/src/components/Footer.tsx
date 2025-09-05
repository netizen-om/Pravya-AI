import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

export const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  // A simple component for the logo to avoid repetition
  const Logo = () => (
    <div className="flex items-center space-x-2">
      <img
        src="/logo/pravya-logo1.png"
        alt="PRAVYA AI Logo"
        width={32}
        height={32}
        className="rounded-md"
      />
      <span className="text-2xl font-bold text-white">Pravya AI</span>
    </div>
  );

  const navigation = {
    product: [
      { name: 'Start Practicing', href: '#' },
      { name: 'Watch Demo', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-black border-t border-gray-800/50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="pb-8 xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="space-y-4 xl:col-span-1">
            <Logo />
            <p className="text-gray-400 text-sm">
              Your smart companion for interview preparation, practice, and performance tracking.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Product</h3>
              <div className="mt-4 flex flex-col space-y-4">
                {navigation.product.map((item) => (
                  <a key={item.name} href={item.href} className="text-base text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
              <div className="mt-4 flex flex-col space-y-4">
                {navigation.company.map((item) => (
                  <a key={item.name} href={item.href} className="text-base text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-12 md:mt-0">
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
              <div className="mt-4 flex flex-col space-y-4">
                {navigation.legal.map((item) => (
                  <a key={item.name} href={item.href} className="text-base text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800/50 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {currentYear} Pravya AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};