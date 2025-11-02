"use client"
import { check2 } from '@/actions/interview-action'
import React, { useEffect } from 'react'

const page = () => {
    useEffect(() => {
        let theGot = async() => {
            await check2("cmh610sum0005wf206rz9j1eg")
            console.log("Done");
        }
        theGot();
    })
  return (
    <div>page</div>
  )
}

export default page