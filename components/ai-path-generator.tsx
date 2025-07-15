"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

export function AIPathGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generatedPath, setGeneratedPath] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGeneratePath = async () => {
    setIsLoading(true)
    setError(null)
    setGeneratedPath("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (prompt.toLowerCase().includes("error")) {
        throw new Error("Failed to generate path. Please try again.")
      }

      const dummyPath = `Generated learning path for "${prompt}":\n\n1. Introduction to ${prompt} (Article)\n2. Core Concepts of ${prompt} (Video)\n3. Advanced ${prompt} Techniques (GitHub Repo)\n4. Project: Building with ${prompt} (Practical)`
      setGeneratedPath(dummyPath)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 text-gray-100 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-400 flex items-center gap-2">
          <Sparkles className="h-6 w-6" /> AI Path Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-gray-300">
            Enter your learning goal or topic:
          </label>
          <Input
            id="prompt"
            placeholder="e.g., Learn React Hooks, Master Data Science"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500"
          />
        </div>
        <Button
          onClick={handleGeneratePath}
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Generate Path
            </>
          )}
        </Button>
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        {generatedPath && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-300">Generated Path:</h3>
            <Textarea
              value={generatedPath}
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
