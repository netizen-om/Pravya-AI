"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Upload, Play, History, BarChart3, BookOpen, User, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "./sidebar-context"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Resume", href: "/resume/upload", icon: Upload },
  { name: "Start Mock Interview", href: "/interview/start", icon: Play },
  { name: "Interview History", href: "/interview/history", icon: History },
  { name: "Performance Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Learning Hub", href: "/learning", icon: BookOpen },
  { name: "Manage Profile", href: "/profile", icon: User },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { sidebarOpen } = useSidebar()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col transition-transform duration-300 ease-in-out z-30",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col flex-grow bg-neutral-950/90 border-r border-neutral-800 pt-20">
          <div className="flex flex-col flex-grow px-4 py-6">
            <nav className="flex-1 space-y-2">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
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
            </nav>

            <div className="mt-6 pt-6 border-t border-neutral-800">
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
        </div>
      </div>
    </>
  )
}
