'use client'
import Agent from '@/components/Agent'
import { useSession } from 'next-auth/react'
import React from 'react'

function page() {

  const { data: session, status } = useSession()

  return (
    <>
        <h1>Interview Generation</h1>
        <Agent userName={session?.user.name!} userId={session?.user.id} type="generate"/>
    </>
  )
}

export default page