"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StartSessionDialog } from "./start-session-dialog"

interface Template {
  id: string
  title: string
  description: string
  tags: string[]
}

export function InterviewTemplateCard({ template }: { template: Template }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Card className="h-full border-zinc-800 bg-zinc-900 text-white hover:border-zinc-700 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{template.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <CardDescription className="text-zinc-400">{template.description}</CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 w-full">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button onClick={() => setIsDialogOpen(true)} className="w-full bg-white text-zinc-950 hover:bg-zinc-100">
              Start Session
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <StartSessionDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} templateTitle={template.title} />
    </>
  )
}
