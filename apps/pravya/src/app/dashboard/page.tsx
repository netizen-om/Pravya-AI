import type React from "react"

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {DashboardClient} from "@/components/dashboard/Dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/sign-in")
  }

  return (
    <>
      <DashboardClient session={session} />
    </>
  )
}
