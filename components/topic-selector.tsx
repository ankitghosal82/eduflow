"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

const predefinedTopics = [
  { id: "react", name: "React Development", description: "Build modern user interfaces with React." },
  { id: "nextjs", name: "Next.js Fundamentals", description: "Learn the basics of Next.js for full-stack apps." },
  { id: "typescript", name: "TypeScript Mastery", description: "Add type safety to your JavaScript projects." },
  {
    id: "datascience",
    name: "Introduction to Data Science",
    description: "Explore data analysis and machine learning.",
  },
  { id: "python", name: "Python Programming", description: "Learn Python for scripting, web, and data." },
]

export function TopicSelector() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const handleTopicChange = (topicId: string, checked: boolean) => {
    setSelectedTopics((prev) => (checked ? [...prev, topicId] : prev.filter((id) => id !== topicId)))
  }

  const handleStartLearning = () => {
    alert(
      `Starting learning for: ${selectedTopics.map((id) => predefinedTopics.find((t) => t.id === id)?.name).join(", ")}`,
    )
    // In a real app, you'd navigate or trigger a learning path generation
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 text-gray-100 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <Sparkles className="h-6 w-6" /> Select Your Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-300">
          Choose the topics you're interested in to start your personalized learning journey:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predefinedTopics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-start space-x-3 p-4 bg-gray-700 rounded-md border border-gray-600"
            >
              <Checkbox
                id={topic.id}
                checked={selectedTopics.includes(topic.id)}
                onCheckedChange={(checked) => handleTopicChange(topic.id, checked as boolean)}
                className="mt-1 border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor={topic.id} className="text-lg font-medium text-gray-100 cursor-pointer">
                  {topic.name}
                </Label>
                <p className="text-sm text-gray-400">{topic.description}</p>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={handleStartLearning}
          disabled={selectedTopics.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2"
        >
          Start Learning Path ({selectedTopics.length} selected)
        </Button>
      </CardContent>
    </Card>
  )
}
