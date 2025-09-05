"use client"
import React from 'react'
import { Appbar } from '@/components/Appbar'
import axios from 'axios';
import HeroSection from '@/components/HeroSection';
import { Drawer } from '@/components/ui/drawer';
import { Card } from '@/components/ui/card';

function page() {


  return (
    <div>
      {/* page
      <Appbar/> */}
      <HeroSection />
        
    </div>
  )
}
export default page