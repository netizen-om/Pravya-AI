"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Mic, FileText, BookOpen, DollarSign, Activity, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Interviews",
    href: "/admin/interviews",
    icon: Mic,
  },
  {
    label: "Resumes",
    href: "/admin/resumes",
    icon: FileText,
  },
  {
    label: "Content",
    href: "/admin/content",
    icon: BookOpen,
  },
  {
    label: "Financials",
    href: "/admin/financials",
    icon: DollarSign,
  },
  {
    label: "System Health",
    href: "/admin/system",
    icon: Activity,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200",
          isOpen ? "w-64" : "w-20",
        )}
      >
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              P
            </div>
            {isOpen && <span>Pravya AI</span>}
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
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
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => (window.location.href = "/login")}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="ml-2 text-sm">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar - Full screen overlay on small screens */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-sidebar">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  P
                </div>
                <span>Pravya AI</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-sidebar-foreground">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-sidebar-border space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => (window.location.href = "/login")}
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2 text-sm">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Toggle - Fixed FAB */}
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
  )
}
