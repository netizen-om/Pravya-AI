"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Upload, Play, History, BarChart3, BookOpen, User, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import type { Session } from "next-auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Resume", href: "/resume/upload", icon: Upload },
  { name: "Start Mock Interview", href: "/interview/start", icon: Play },
  { name: "Interview History", href: "/interview/history", icon: History },
  { name: "Performance Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Learning Hub", href: "/learning", icon: BookOpen },
  { name: "Manage Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
  session: {
    user: {
      id: string;
      name: string;
      email?: string | null;
      image?: string | null;
      emailVerified?: boolean;
      password?: string | null;
    };
  }
}

export function MobileSidebar({ open, onClose, session }: MobileSidebarProps) {
  const pathname = usePathname()

  const handleSignOut = () => {
    signOut()
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 bg-neutral-950/95 border-neutral-800 p-0">
        <div className="flex flex-col h-full">
          {/* Header with user info */}
          <SheetHeader className="p-6 border-b border-neutral-800">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name!} />
                <AvatarFallback className="bg-neutral-900 text-white">
                  {session.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 text-left">
                <SheetTitle className="text-white font-medium">{session.user.name}</SheetTitle>
                <p className="text-sm text-neutral-400">{session.user.email}</p>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              <AnimatePresence>
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-900/50",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "mr-3 h-5 w-5 transition-colors",
                            isActive ? "text-white" : "text-neutral-500 group-hover:text-white",
                          )}
                        />
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </nav>
          </div>

          {/* Sign out button */}
          <div className="p-4 border-t border-neutral-800">
            <Button
              variant="ghost"
              className="w-full justify-start text-neutral-400 hover:text-white hover:bg-neutral-900/50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
