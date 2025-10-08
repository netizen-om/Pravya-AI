"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect } from "react"

export const Appbar = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log("Session:", session)
  }, [session])

  if (status === "loading") return <p>Loading...</p>

  if (!session?.user) {
    return (
      <div>
        <button onClick={() => signIn()}>Sign in</button>
        <p>You are not signed in.</p>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => signOut()}>Sign out</button>
      <p>Welcome {session.user.name}</p>
      <p>Your User ID is: {session.user.id}</p>
    </div>
  )
}
