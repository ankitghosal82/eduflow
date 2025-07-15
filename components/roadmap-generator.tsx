"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

export function RoadmapGenerator() {
  const [topic, setTopic] = useState("")
  const [roadmap, setRoadmap] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateRoadmap = async () => {
    setIsLoading(true)
    setError(null)
    setRoadmap("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2500))

      if (topic.toLowerCase().includes("fail")) {
        throw new Error("Roadmap generation failed. Try a different topic.")
      }

      const dummyRoadmap = `Detailed roadmap for "${topic}":\n\nPhase 1: Fundamentals\n- Understand basic concepts\n- Key terminology\n\nPhase 2: Intermediate Skills\n- Practical applications\n- Common patterns\n\nPhase 3: Advanced Topics\n- Deep dive into complex areas\n- Best practices\n\nPhase 4: Project Work\n- Build a portfolio project\n- Review and refine`
      setRoadmap(dummyRoadmap)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 text-gray-100 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Sparkles className="h-6 w-6" /> Roadmap Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="topic" className="text-gray-300">
            Enter the topic for your roadmap:
          </label>
          <Input
            id="topic"
            placeholder="e.g., Full-stack Development, Machine Learning"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500"
          />
        </div>
        <Button
          onClick={handleGenerateRoadmap}
          disabled={isLoading || !topic.trim()}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Generate Roadmap
            </>
          )}
        </Button>
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        {roadmap && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-green-300">Generated Roadmap:</h3>
            <Textarea
              value={roadmap}
              readOnly
              rows={10}
              className="bg-gray-700 border-gray-600 text-gray-100 font-mono resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
