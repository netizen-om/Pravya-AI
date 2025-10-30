"use client"

import { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Brain,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  ChevronRight,
  Star,
  Calendar,
  Award,
  LogOut,
  Loader2,
  Link,
} from "lucide-react"
import PravyaLogo from "@/components/PravyaLogo"
import { useRouter } from "next/navigation"
import Loader from "../loader/loader"

export default function Dashboard() {
  const { data: session, status } = useSession()
   const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard")

  useEffect(() => {
    if(activeTab === "Resume") {
      router.push("/resume/upload")
    }
    
    if(activeTab === "Settings") {
      router.push("/user/settings")
    }
    
  }, [activeTab])

  const practiceTopics = [
    { name: "Data Structures & Algorithms", progress: 78, color: "bg-blue-500" },
    { name: "System Design", progress: 45, color: "bg-purple-500" },
    { name: "Behavioral Questions", progress: 92, color: "bg-green-500" },
    { name: "JavaScript Fundamentals", progress: 67, color: "bg-orange-500" },
  ]

  const recentFeedback = [
    {
      session: "Mock Interview #23",
      date: "2 hours ago",
      score: 89,
      feedback: "Excellent problem-solving approach. Work on explaining your thought process more clearly.",
      type: "Technical",
    },
    {
      session: "Behavioral Practice #12",
      date: "1 day ago",
      score: 94,
      feedback: "Great use of STAR method. Your examples were specific and impactful.",
      type: "Behavioral",
    },
    {
      session: "System Design #8",
      date: "2 days ago",
      score: 76,
      feedback: "Good high-level design. Consider discussing scalability trade-offs in more detail.",
      type: "System Design",
    },
  ]

  // Loading state
  if (status === "loading") {
    return (
      <Loader title="Loading your Dashboard"/>
    )
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <style jsx global>{`
          * {
            transition: all 0.2s ease-in-out;
          }
          body {
            background: black;
            color: white;
          }
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #1f1f1f;
          }
          ::-webkit-scrollbar-thumb {
            background: #404040;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">Pravya AI</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Pravya AI</h1>
            <p className="text-gray-400 mb-6">Sign in to access your interview preparation dashboard</p>
            <Button
              onClick={() => signIn()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              Sign In to Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Get user name from session
  const userName = session.user?.name?.split(" ")[0] || "User"

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        * {
          transition: all 0.2s ease-in-out;
        }
        body {
          background: black;
          color: white;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1f1f1f;
        }
        ::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
        }
        .glassmorphism {
          background: rgba(17, 17, 17, 0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          background: rgba(17, 17, 17, 0.7);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-gray-800 glassmorphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <PravyaLogo />
              <span className="text-xl font-bold">Pravya AI</span>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              {["Dashboard", "Practice", "Resume", "Settings"].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item
                      ? "text-white bg-gray-800"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* User Info & Sign Out */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                {/* {session.user?.image && (
                  <img src={session.user.image || "/placeholder.svg"} className="w-8 h-8 rounded-full" />
                )} */}
                <span className="text-sm text-gray-300">{session.user?.name}</span>
              </div>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="border-gray-700 bg-transparent hover:bg-gray-800 text-white flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="glassmorphism rounded-2xl p-6">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName} 👋</h1>
            <p className="text-gray-400 text-lg">Ready to ace your next interview?</p>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glassmorphism card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Interviews Taken</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">24</div>
              <p className="text-xs text-gray-500 mt-1">+3 from last week</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average Score</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">87%</div>
              <p className="text-xs text-green-500 mt-1">Above average</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">+12%</div>
              <p className="text-xs text-purple-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ongoing Practice Section */}
          <div className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Ongoing Practice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {practiceTopics.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300">{topic.name}</span>
                      <span className="text-sm text-gray-400">{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-2 bg-gray-800" />
                  </div>
                ))}
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Continue Practice
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Daily Tip Widget */}
              <Card
                className="glassmorphism"
                style={{
                  background: "linear-gradient(135deg, rgba(180, 83, 9, 0.2) 0%, rgba(146, 64, 14, 0.2) 100%)",
                  borderColor: "rgba(180, 83, 9, 0.5)",
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Lightbulb className="h-5 w-5" />
                    Today's Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Structure your answers using the STAR method: Situation, Task, Action, Result. This helps you provide
                    comprehensive and organized responses.
                  </p>
                </CardContent>
              </Card>
          </div>

          {/* Recent Feedback Panel */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Award className="h-5 w-5 text-green-500" />
                Recent Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentFeedback.map((feedback, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-white">{feedback.session}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {feedback.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {feedback.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-white">{feedback.score}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{feedback.feedback}</p>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                View All Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}