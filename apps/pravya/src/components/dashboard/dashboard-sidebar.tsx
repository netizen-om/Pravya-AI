"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  Play,
  History,
  BookOpen,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { FaMoneyBills } from "react-icons/fa6";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Resume", href: "/resume/upload", icon: Upload },
  { name: "Mock Interview", href: "/interview", icon: Play },
  { name: "Learning Hub", href: "/learning-hub", icon: BookOpen },
  { name: "Manage Profile", href: "/user/settings", icon: User },
  { name: "Subscriptions", href: "/subscriptions", icon: FaMoneyBills }
];

interface DashboardSidebarProps {
  isDark: boolean;
}

export function DashboardSidebar({ isDark }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  const handleSignOut = () => signOut();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      {/* ===== MOBILE MENU BUTTON ===== */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 240 : 72 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className={cn(
          "hidden lg:flex flex-col h-screen fixed inset-y-0 left-0 z-50 border-r transition-colors duration-300",
          // light & dark mode separation
          "bg-white border-gray-200 text-gray-700 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300"
        )}
      >
        <div className="flex flex-col flex-grow pt-7 overflow-hidden">
          {/* === LOGO SECTION === */}
          <div className="flex items-center px-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-3"
            >
              <Image
                src="/logo/pravya-logo.png"
                alt="Pravya AI Logo"
                width={36}
                height={36}
                className="rounded-md"
              />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-semibold line-clamp-1 tracking-wide text-gray-800 dark:text-gray-100"
                  >
                    Pravya AI
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <nav className="flex-1 space-y-1 px-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.25 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/50"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 min-w-[20px] transition-colors",
                        isActive
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 group-hover:text-gray-900 dark:text-neutral-500 dark:group-hover:text-white"
                      )}
                    />
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.2 }}
                          className="ml-3 whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* ===== THEME TOGGLE + SIGN OUT ===== */}
          <div className="mt-auto px-2 pb-4 border-t border-gray-200 dark:border-neutral-800">
            <div className="flex flex-col gap-2">
              
              <AnimatedThemeToggler isHovered={isHovered}/>

              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  "dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/50"
                )}
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                {isHovered && <span>Sign Out</span>}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== MOBILE SIDEBAR ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex w-64 flex-col p-4 pt-20 border-r transition-colors duration-300",
              "bg-white border-gray-200 text-gray-700 dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-300"
            )}
          >
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/50"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-neutral-800">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  "dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/50"
                )}
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="mr-3 h-5 w-5" />
                ) : (
                  <Moon className="mr-3 h-5 w-5" />
                )}
                Toggle Theme
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  "dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/50"
                )}
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
