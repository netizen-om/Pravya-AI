"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Upload,
  ChevronDown,
  ChevronRight,
  User,
  Code,
  Zap,
  AlertTriangle,
  SpellCheckIcon as Spell,
  Award,
  Tag,
  FileText,
  Briefcase,
  ExternalLink,
  Mail,
  Phone,
  Github,
  Linkedin,
} from "lucide-react"
import { cn } from "@/lib/utils"

const mockAnalysisData = {
  status: "completed",
  resumeUrl: "https://res.cloudinary.com/ddojayhow/raw/upload/v1755424234/resumes/cmdtwaovc0000wfagrbld46w3-1755424234156-18-om_resume",
  analysis: {
    contactInformation: {
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      portfolio: "https://johndoe.dev",
    },
    skills: {
      languages: ["JavaScript", "TypeScript", "Python", "Java", "Go"],
      databases: ["PostgreSQL", "MongoDB", "Redis", "MySQL"],
      frameworks: ["React", "Next.js", "Node.js", "Express", "Django", "Spring Boot"],
      tools: ["Git", "Docker", "AWS", "Kubernetes", "Jenkins", "Terraform"],
    },
    impactWords: [
      "Developed",
      "Implemented",
      "Optimized",
      "Led",
      "Architected",
      "Delivered",
      "Improved",
      "Managed",
      "Created",
      "Designed",
    ],
    grammarErrors: [
      {
        error: "I have experience in developing applications",
        suggestion: "I have experience developing applications",
        type: "Unnecessary preposition",
      },
      {
        error: "Responsible for managing team of 5 developers",
        suggestion: "Responsible for managing a team of 5 developers",
        type: "Missing article",
      },
    ],
    spellingErrors: [
      {
        word: "developement",
        correction: "development",
      },
      {
        word: "managment",
        correction: "management",
      },
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "Google Cloud Professional Developer",
      "Certified Kubernetes Administrator",
    ],
    missingKeywords: [
      "Agile",
      "Scrum",
      "CI/CD",
      "Microservices",
      "REST API",
      "GraphQL",
      "Testing",
      "DevOps",
      "Cloud Computing",
    ],
    formattingIssues: [
      {
        issue: "Inconsistent date formatting",
        suggestion: "Use consistent MM/YYYY format throughout",
      },
      {
        issue: "Mixed bullet point styles",
        suggestion: "Use consistent bullet points (• or -)",
      },
      {
        issue: "Inconsistent font sizes in headers",
        suggestion: "Maintain uniform header hierarchy",
      },
    ],
    workExperience: [
      {
        company: "Tech Corp",
        position: "Senior Software Engineer",
        duration: "2021 - Present",
        responsibilities: [
          "Led development of React applications",
          "Architected microservices infrastructure",
          "Mentored junior developers",
        ],
      },
    ],
  },
}

const AccordionSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-white/70" />
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-white/50 transition-transform" />
        ) : (
          <ChevronRight className="w-5 h-5 text-white/50 transition-transform" />
        )}
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="p-4 pt-0 border-t border-white/10">{children}</div>
      </div>
    </Card>
  )
}

const SkillPill = ({ skill, tooltip }: { skill: string; tooltip?: string }) => (
  <div className="group relative">
    <Badge
      variant="secondary"
      className="bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer"
    >
      {skill}
    </Badge>
    {tooltip && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white/90 text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
        {tooltip}
      </div>
    )}
  </div>
)

const ErrorSuggestion = ({ error, suggestion, type }: { error: string; suggestion: string; type?: string }) => (
  <div className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-start space-x-2">
      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-red-300 font-medium">{error}</p>
        {type && <p className="text-xs text-white/50 mt-1">{type}</p>}
      </div>
    </div>
    <div className="flex items-start space-x-2 ml-6">
      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-green-300">{suggestion}</p>
    </div>
  </div>
)

export default function ResumeAnalysisPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50))
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Upload
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Resume Insights</h1>
                <p className="text-sm text-white/60">Based on your uploaded resume</p>
              </div>
            </div>

            {!isLoading && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-green-400">Analysis Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Resume Viewer */}
          <Card className="relative overflow-hidden bg-black/60 border-white/10 backdrop-blur-sm">
            {/* Viewer Controls */}
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Resume Preview</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 50}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-white/60 min-w-[60px] text-center">{zoomLevel}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 200}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Resume Content */}
            <div className="flex-1 p-4 overflow-auto">
                
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4 bg-white/10" />
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-5/6 bg-white/10" />
                  <div className="space-y-2 mt-6">
                    <Skeleton className="h-6 w-1/2 bg-white/10" />
                    <Skeleton className="h-4 w-full bg-white/10" />
                    <Skeleton className="h-4 w-4/5 bg-white/10" />
                  </div>
                </div>
              ) : (
                <div
                  className="bg-white rounded-lg shadow-lg p-8 text-black transition-transform duration-300"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top left" }}
                >
                  {/* Mock Resume Content */}
                  <div className="space-y-6">
                    <div className="text-center border-b pb-4">
                      <h1 className="text-3xl font-bold">John Doe</h1>
                      <p className="text-lg text-gray-600">Senior Software Engineer</p>
                      <p className="text-sm text-gray-500">john.doe@email.com | (555) 123-4567</p>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-2">Experience</h2>
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium">Senior Software Engineer - Tech Corp</h3>
                          <p className="text-sm text-gray-600">2021 - Present</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Developed React applications with TypeScript</li>
                            <li>• Built scalable Node.js APIs with PostgreSQL</li>
                            <li>• Implemented CI/CD pipelines using Docker and AWS</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-2">Skills</h2>
                      <p className="text-sm">
                        JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-black/40 border-white/10 p-4">
                    <Skeleton className="h-6 w-1/3 bg-white/10 mb-3" />
                    <Skeleton className="h-4 w-full bg-white/10 mb-2" />
                    <Skeleton className="h-4 w-2/3 bg-white/10" />
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Contact Information */}
                <AccordionSection title="Contact Information" icon={User} defaultOpen>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-white/50" />
                      <a
                        href={`mailto:${mockAnalysisData.analysis.contactInformation.email}`}
                        className="text-white/90 hover:text-white underline underline-offset-2"
                      >
                        {mockAnalysisData.analysis.contactInformation.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-white/50" />
                      <span className="text-white/90">{mockAnalysisData.analysis.contactInformation.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Linkedin className="w-4 h-4 text-white/50" />
                      <a
                        href={mockAnalysisData.analysis.contactInformation.linkedin}
                        className="text-white/90 hover:text-white underline underline-offset-2 flex items-center"
                      >
                        LinkedIn Profile <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Github className="w-4 h-4 text-white/50" />
                      <a
                        href={mockAnalysisData.analysis.contactInformation.github}
                        className="text-white/90 hover:text-white underline underline-offset-2 flex items-center"
                      >
                        GitHub Profile <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </AccordionSection>

                {/* Skills */}
                <AccordionSection title="Skills" icon={Code} defaultOpen>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {mockAnalysisData.analysis.skills.languages.map((skill) => (
                          <SkillPill key={skill} skill={skill} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-2">Databases</h4>
                      <div className="flex flex-wrap gap-2">
                        {mockAnalysisData.analysis.skills.databases.map((skill) => (
                          <SkillPill key={skill} skill={skill} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-2">Frameworks & Libraries</h4>
                      <div className="flex flex-wrap gap-2">
                        {mockAnalysisData.analysis.skills.frameworks.map((skill) => (
                          <SkillPill key={skill} skill={skill} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-2">Tools & Platforms</h4>
                      <div className="flex flex-wrap gap-2">
                        {mockAnalysisData.analysis.skills.tools.map((skill) => (
                          <SkillPill key={skill} skill={skill} />
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* Impact Words */}
                <AccordionSection title="Impact Words" icon={Zap}>
                  <div className="flex flex-wrap gap-2">
                    {mockAnalysisData.analysis.impactWords.map((word) => (
                      <SkillPill key={word} skill={word} tooltip="Strong Action Word" />
                    ))}
                  </div>
                </AccordionSection>

                {/* Grammar Errors */}
                <AccordionSection title="Grammar Errors" icon={AlertTriangle}>
                  <div className="space-y-3">
                    {mockAnalysisData.analysis.grammarErrors.map((error, index) => (
                      <ErrorSuggestion
                        key={index}
                        error={error.error}
                        suggestion={error.suggestion}
                        type={error.type}
                      />
                    ))}
                  </div>
                </AccordionSection>

                {/* Spelling Errors */}
                <AccordionSection title="Spelling Errors" icon={Spell}>
                  <div className="space-y-3">
                    {mockAnalysisData.analysis.spellingErrors.map((error, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <span className="text-red-300 font-medium">{error.word}</span>
                        <span className="text-green-300">→ {error.correction}</span>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* Certifications */}
                <AccordionSection title="Certifications" icon={Award}>
                  <div className="space-y-2">
                    {mockAnalysisData.analysis.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                        <span className="text-white/90">{cert}</span>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* Missing Keywords */}
                <AccordionSection title="Missing Keywords" icon={Tag}>
                  <div className="flex flex-wrap gap-2">
                    {mockAnalysisData.analysis.missingKeywords.map((keyword) => (
                      <SkillPill key={keyword} skill={keyword} tooltip="Recommended to add for ATS optimization" />
                    ))}
                  </div>
                </AccordionSection>

                {/* Formatting Issues */}
                <AccordionSection title="Formatting Issues" icon={FileText}>
                  <div className="space-y-3">
                    {mockAnalysisData.analysis.formattingIssues.map((issue, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-white/90 font-medium mb-1">{issue.issue}</p>
                        <p className="text-white/60 text-sm">{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* Work Experience */}
                <AccordionSection title="Work Experience" icon={Briefcase}>
                  {mockAnalysisData.analysis.workExperience.length > 0 ? (
                    <div className="space-y-4">
                      {mockAnalysisData.analysis.workExperience.map((exp, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <h4 className="text-white font-medium">{exp.position}</h4>
                          <p className="text-white/70 text-sm">
                            {exp.company} • {exp.duration}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {exp.responsibilities.map((resp, i) => (
                              <li key={i} className="text-white/60 text-sm flex items-start">
                                <span className="mr-2">•</span>
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/60 italic">No work experience details detected.</p>
                  )}
                </AccordionSection>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    onClick={() => (window.location.href = "/chatbot")}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Chat With Your Resume
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full h-12 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Resume
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
