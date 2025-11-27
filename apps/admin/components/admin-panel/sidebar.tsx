"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mic,
  FileText,
  BookOpen,
  DollarSign,
  Activity,
  LogOut,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "../theme/animated-theme-toggler";

// ---- Roles ----
enum AdminRoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
}

// ---- Navigation Items ----
const navigationItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Interviews", href: "/admin/interviews", icon: Mic },
  { label: "Resumes", href: "/admin/resumes", icon: FileText },
  { label: "Content", href: "/admin/content", icon: BookOpen },
  { label: "Financials", href: "/admin/financials", icon: DollarSign },
  { label: "System Health", href: "/admin/system", icon: Activity },
];

const superAdminItems = [
  {
    label: "Admin Management",
    href: "/admin/admins",
    icon: Shield,
    requireSuperAdmin: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<{
    role: AdminRoleType;
  } | null>(null);

  // ---------------------
  // HYDRATION-SAFE THEME
  // ---------------------
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Prevent hydration mismatch
  }, []);

  // Fetch Admin Info
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.admin) {
          setCurrentAdmin(data.admin);
        }
      })
      .catch(() => {});
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/sign-in");
    }
  };

  const isSuperAdmin = currentAdmin?.role === AdminRoleType.SUPER_ADMIN;

  const allNavigationItems = [
    ...navigationItems,
    ...(isSuperAdmin ? superAdminItems : []),
  ];

  // -----------------------------
  // THEME ICON & LABEL (SAFE!)
  // -----------------------------
  const ThemeIcon = !mounted
    ? Laptop
    : theme === "light"
    ? Sun
    : theme === "dark"
    ? Moon
    : Laptop;

  const themeLabel = !mounted
    ? "System"
    : theme === "light"
    ? "Light"
    : theme === "dark"
    ? "Dark"
    : "System";

    
    const toggleTheme = () => {
      if (!mounted) return;
      if (theme === "light") setTheme("dark");
      else if (theme === "dark") setTheme("system");
      else setTheme("light");
    };

    if(!mounted) {
      return (
        <>
        </>
      )
    }
    
    return (
      <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200",
          isOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
             <Image
                src={(theme === "dark") ? "/logo/pravya-logo.png" : "/logo/pravya-light-logo.png"}
                alt="Pravya AI Logo"
                width={36}
                height={36}
                className="rounded-md"
              />
            </div>
            {isOpen && <span>Pravya AI</span>}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {allNavigationItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER — THEME + COLLAPSE + LOGOUT */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          {/* ——— THEME SWITCH —— */}

          {/* Collapse */}
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <>
                <X className="w-5 h-5" />
                <span className="ml-2 text-sm">Collapse</span>
              </>
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          <AnimatedThemeToggler isHovered={isOpen}/>
          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="ml-2 text-sm">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-sidebar">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  P
                </div>
                <span>Pravya AI</span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-sidebar-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {allNavigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-sidebar-border space-y-2">
              <Button
                variant="ghost"
                disabled={!mounted}
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
                onClick={toggleTheme}
              >
                <ThemeIcon className="w-5 h-5" />
                <span className="ml-2 text-sm">{themeLabel} Mode</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2 text-sm">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <Button
          size="icon"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
    </>
  );
}
