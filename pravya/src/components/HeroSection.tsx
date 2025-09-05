"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Brain, MessageCircle, Target, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { LandingFooter } from "./Footer"

export default function HeroSection() {
    
    const router = useRouter();
    const { data: session, status } = useSession()

  return (
    <>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes pulse-line {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-marquee {
          animation: marquee 10s linear infinite;
        }

        .ai-brain-container {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .central-brain {
          position: relative;
          z-index: 10;
          animation: pulse 3s ease-in-out infinite;
        }

        .floating-element {
          position: absolute;
          animation: float 4s ease-in-out infinite;
        }

        .element-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .element-2 { top: 15%; right: 20%; animation-delay: 1s; }
        .element-3 { bottom: 25%; left: 15%; animation-delay: 2s; }
        .element-4 { bottom: 20%; right: 10%; animation-delay: 3s; }

        .neural-line {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.4), transparent);
          height: 1px;
          animation: pulse-line 2s ease-in-out infinite;
        }

        .line-1 { top: 30%; left: 20%; width: 60px; transform: rotate(45deg); animation-delay: 0.5s; }
        .line-2 { top: 25%; right: 25%; width: 50px; transform: rotate(-30deg); animation-delay: 1.5s; }
        .line-3 { bottom: 35%; left: 25%; width: 45px; transform: rotate(-45deg); animation-delay: 2.5s; }
        .line-4 { bottom: 30%; right: 20%; width: 55px; transform: rotate(30deg); animation-delay: 3.5s; }

        .silver-gradient-bg {
          background: 
            radial-gradient(circle at 20% 20%, rgba(192, 192, 192, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(169, 169, 169, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(211, 211, 211, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, rgba(192, 192, 192, 0.05) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 70%, rgba(169, 169, 169, 0.05) 100%),
            #000000;
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(192, 192, 192, 0.1) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .silver-border {
          border: 1px solid rgba(192, 192, 192, 0.2);
          box-shadow: 0 0 20px rgba(192, 192, 192, 0.1);
        }

        .glass-effect {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(192, 192, 192, 0.1);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(192, 192, 192, 0.3);
        }
      `}</style>

      <div className="min-h-screen text-white overflow-hidden relative silver-gradient-bg">
        {/* Enhanced Silver Gradient Overlays */}
        <div className="absolute inset-0 opacity-60">
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at top left, rgba(192, 192, 192, 0.2) 0%, transparent 60%),
                radial-gradient(ellipse at bottom right, rgba(169, 169, 169, 0.15) 0%, transparent 60%),
                radial-gradient(ellipse at center, rgba(211, 211, 211, 0.05) 0%, transparent 70%)
              `
            }}
          />
        </div>

        {/* Animated Silver Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-silver-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-silver-300 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-silver-500 rounded-full animate-bounce opacity-50"></div>
        </div>

        {/* Development Mode Banner */}
        <div className="relative z-10 glass-effect text-white py-2 overflow-hidden silver-border">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-sm font-semibold px-4">
              🚧 Currently in Development Mode - Stay tuned for amazing features! 🚧
            </span>
          </div>
        </div>

        {/* Sticky Navigation with NextAuth */}
        <nav className="relative z-50 sticky top-0 glass-effect silver-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-2 ">
                <Image 
                  src="/logo/pravya-logo1.png" 
                  alt="PRAVYA AI" 
                  width={32} 
                  height={32} 
                  className="" 
                />
                <span className="text-2xl font-bold text-white">Pravya AI</span>
              </div>

              {/* NextAuth Integration - SSR Compatible */}
              <div className="flex items-center space-x-4">
                {status === "loading" ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-8 bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-20 h-8 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ) : session ? (
                  <div className="flex items-center space-x-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-2">
                      {/* {session.user?.image && (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={32}
                          height={32}
                          className="user-avatar"
                        />
                      )} */}
                      {/* <span className="text-silver-300 text-sm hidden sm:block">
                        {session.user?.name || session.user?.email}
                      </span> */}
                    </div>
                    
                    {/* Sign Out Button */}
                    <Button
                      onClick={() => signOut()}
                      variant="ghost"
                      className="text-silver-300 hover:text-black hover:bg-white hover:shadow-lg hover:shadow-silver-500/20 transition-all duration-300 ease-in-out transform hover:scale-105 border border-silver-600/30"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Sign In Button */}
                    <Button
                      onClick={() => signIn()}
                      variant="ghost"
                      className="text-silver-300 hover:text-black hover:bg-white hover:shadow-lg hover:shadow-silver-500/20 transition-all duration-300 ease-in-out transform hover:scale-105 border border-silver-600/30"
                    >
                      Sign In
                    </Button>
                    
                    {/* Sign Up Button */}
                    <Button 
                      onClick={() => router.push('/auth/sign-up')}
                      className="bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-white hover:to-silver-100 hover:text-black text-white border border-silver-600/30 hover:shadow-lg hover:shadow-silver-500/20 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="text-white drop-shadow-lg">Ace Every Interview</span>
                    <br />
                    <span 
                      className="text-transparent bg-clip-text"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 50%, #D3D3D3 100%)'
                      }}
                    >
                      with PRAVYA AI
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-silver-300 max-w-2xl leading-relaxed drop-shadow-sm">
                    Your smart companion for interview preparation, practice, and performance tracking.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => {
                      if (session) {
                        // Navigate to practice page
                        window.location.href = '/dashboard'
                      } else {
                        // Sign in first
                        signIn()
                      }
                    }}
                    className="bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-white hover:to-silver-100 hover:text-black text-white border border-silver-600/30 rounded-xl px-8 py-6 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-silver-500/20"
                  >
                    {session ? 'Start Practicing' : 'Get Started'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = '/demo'}
                    className="border-2 border-silver-600/50 glass-effect hover:bg-white hover:text-black hover:border-white text-white rounded-xl px-8 py-6 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-silver-500/20"
                  >
                    Watch Demo
                  </Button>
                </div>

                {/* Enhanced Stats */}
                <div className="flex flex-wrap gap-8 pt-8">
                  <div className="text-center p-4 rounded-lg glass-effect silver-border">
                    <div className="text-2xl font-bold text-silver-200">10K+</div>
                    <div className="text-sm text-silver-400">Practice Sessions</div>
                  </div>
                  <div className="text-center p-4 rounded-lg glass-effect silver-border">
                    <div className="text-2xl font-bold text-silver-200">95%</div>
                    <div className="text-sm text-silver-400">Success Rate</div>
                  </div>
                  <div className="text-center p-4 rounded-lg glass-effect silver-border">
                    <div className="text-2xl font-bold text-silver-200">500+</div>
                    <div className="text-sm text-silver-400">Questions</div>
                  </div>
                </div>
              </div>

              {/* Enhanced AI Brain Visualization */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="ai-brain-container">
                    {/* Glowing Background Circle */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-20"
                      style={{
                        background: 'radial-gradient(circle, rgba(192, 192, 192, 0.3) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                      }}
                    />
                    
                    <div className="central-brain">
                      <Brain size={120} className="text-silver-300 drop-shadow-lg" />
                    </div>

                    {/* Enhanced Floating Elements */}
                    <div className="floating-element element-1">
                      <div className="p-2 rounded-full glass-effect silver-border">
                        <MessageCircle size={24} className="text-silver-400" />
                      </div>
                    </div>
                    <div className="floating-element element-2">
                      <div className="p-2 rounded-full glass-effect silver-border">
                        <Target size={20} className="text-silver-500" />
                      </div>
                    </div>
                    <div className="floating-element element-3">
                      <div className="p-2 rounded-full glass-effect silver-border">
                        <Zap size={18} className="text-silver-400" />
                      </div>
                    </div>
                    <div className="floating-element element-4">
                      <div className="p-2 rounded-full glass-effect silver-border">
                        <MessageCircle size={16} className="text-silver-600" />
                      </div>
                    </div>

                    {/* Enhanced Neural Lines */}
                    <div className="neural-line line-1"></div>
                    <div className="neural-line line-2"></div>
                    <div className="neural-line line-3"></div>
                    <div className="neural-line line-4"></div>
                  </div>

                  {/* Enhanced Ambient Particles */}
                  <div className="absolute -top-8 -left-8 w-3 h-3 bg-silver-400 rounded-full animate-pulse opacity-60 shadow-lg shadow-silver-400/50"></div>
                  <div className="absolute -bottom-6 -right-6 w-2 h-2 bg-silver-300 rounded-full animate-ping opacity-50 shadow-lg shadow-silver-300/50"></div>
                  <div className="absolute top-1/3 -right-12 w-2 h-2 bg-silver-500 rounded-full animate-bounce opacity-40 shadow-lg shadow-silver-500/50"></div>
                  <div className="absolute bottom-1/3 -left-10 w-2 h-2 bg-silver-400 rounded-full animate-pulse opacity-50 shadow-lg shadow-silver-400/50"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Silver Gradient Overlay for Hero */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `
                linear-gradient(45deg, transparent 0%, rgba(192, 192, 192, 0.1) 25%, transparent 50%, rgba(169, 169, 169, 0.1) 75%, transparent 100%)
              `
            }}
          />
        </section>
        {/* <LandingFooter /> */}
      </div>
    </>
  )
}