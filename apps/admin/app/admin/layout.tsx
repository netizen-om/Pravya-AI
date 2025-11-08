import type React from "react"
import { Sidebar } from "@/components/admin-panel/sidebar"
import { redirect } from "next/navigation"
import { getCurrentAdmin } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
}
