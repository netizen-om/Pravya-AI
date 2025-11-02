"use client"
import { check2 } from '@/actions/interview-action'
import React, { useEffect } from 'react'

const page = () => {
    useEffect(() => {
        let theGot = async() => {
            await check2("85280e51-063f-4119-b0d7-67893d66d3e0")
            console.log("Done");
        }
        theGot();
    })
  return (
    <div>page</div>
  )
}

export default page