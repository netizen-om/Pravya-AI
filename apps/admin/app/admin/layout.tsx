import type React from "react"
import { Sidebar } from "@/components/admin-panel/sidebar"
import { redirect } from "next/navigation"
import { getCurrentAdmin } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const admin = await getCurrentAdmin()
    
    if (!admin) {
      redirect("/sign-in")
    }

    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    )
  } catch (error) {
    console.error("Admin layout error:", error);
    redirect("/sign-in")
  }
}
