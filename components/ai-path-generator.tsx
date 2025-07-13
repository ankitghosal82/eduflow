"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n/use-translation" // Add this import

interface AiPathGeneratorProps {
  onPathGenerated: (suggestedTopicIds: string[], narrative: string) => void
}

type Goal = "sde" | "mle" | "web-dev" | "data-scientist" | "cybersecurity"
type Level = "beginner" | "intermediate" | "advanced"

export default function AiPathGenerator({ onPathGenerated }: AiPathGeneratorProps) {
  const [goal, setGoal] = useState<Goal | undefined>(undefined)
  const [level, setLevel] = useState<Level | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation() // Use translation hook

  const generateLearningPath = () => {
    if (!goal || !level) {
      alert(t("alert_select_goal_level")) // Translated alert
      return
    }

    setLoading(true)
    let suggestedTopicIds: string[] = []
    let narrative = ""

    // Simulate AI thinking time
    setTimeout(() => {
      switch (goal) {
        case "sde":
          narrative = `Based on your goal as a Software Development Engineer and your ${level} level, I've curated a path to strengthen your foundational and advanced programming skills.`
          if (level === "beginner") {
            suggestedTopicIds = ["python-foundations", "dsa", "fullstack"]
          } else if (level === "intermediate") {
            suggestedTopicIds = ["fullstack", "system-design", "dsa"]
          } else {
            suggestedTopicIds = ["system-design", "cloud-computing", "dsa"]
          }
          break
        case "mle":
          narrative = `For an aspiring Machine Learning Engineer at a ${level} level, this path focuses on core ML concepts, deep learning, and data handling.`
          if (level === "beginner") {
            suggestedTopicIds = ["python-foundations", "data-analysis", "ml"]
          } else if (level === "intermediate") {
            suggestedTopicIds = ["ml", "dl", "data-analysis"]
          } else {
            suggestedTopicIds = ["dl", "ml", "system-design"]
          }
          break
        case "web-dev":
          narrative = `As a Web Developer at a ${level} level, your path emphasizes full-stack development, modern frameworks, and scalable architecture.`
          if (level === "beginner") {
            suggestedTopicIds = ["python-foundations", "fullstack"]
          } else if (level === "intermediate") {
            suggestedTopicIds = ["fullstack", "system-design"]
          } else {
            suggestedTopicIds = ["fullstack", "cloud-computing", "system-design"]
          }
          break
        case "data-scientist":
          narrative = `To excel as a Data Scientist at a ${level} level, this path highlights data analysis, machine learning, and database systems.`
          if (level === "beginner") {
            suggestedTopicIds = ["python-foundations", "data-analysis", "ml"]
          } else if (level === "intermediate") {
            suggestedTopicIds = ["data-analysis", "ml", "dl"]
          } else {
            suggestedTopicIds = ["ml", "dl", "dbms"]
          }
          break
        case "cybersecurity":
          narrative = `For a Cybersecurity Analyst at a ${level} level, this path focuses on security fundamentals, operating systems, and system design.`
          if (level === "beginner") {
            suggestedTopicIds = ["cybersecurity", "os"]
          } else if (level === "intermediate") {
            suggestedTopicIds = ["cybersecurity", "system-design", "os"]
          } else {
            suggestedTopicIds = ["cybersecurity", "cloud-computing", "system-design"]
          }
          break
        default:
          narrative = "Please select a valid goal and level to generate a path." // Fallback, should be caught by alert
          suggestedTopicIds = []
      }

      onPathGenerated(suggestedTopicIds, narrative)
      setLoading(false)
    }, 1000) // Simulate a short loading time
  }

  return (
    <Card className="w-full bg-gray-800 text-gray-100 border-gray-700 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-400">{t("ai_generator_title")}</CardTitle>
        <CardDescription className="text-gray-300">{t("ai_generator_description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select onValueChange={(value) => setGoal(value as Goal)} value={goal}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder={t("select_your_goal")} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
              <SelectItem value="sde">{t("goal_sde")}</SelectItem>
              <SelectItem value="mle">{t("goal_mle")}</SelectItem>
              <SelectItem value="web-dev">{t("goal_web_dev")}</SelectItem>
              <SelectItem value="data-scientist">{t("goal_data_scientist")}</SelectItem>
              <SelectItem value="cybersecurity">{t("goal_cybersecurity")}</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setLevel(value as Level)} value={level}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder={t("select_your_level")} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
              <SelectItem value="beginner">{t("level_beginner")}</SelectItem>
              <SelectItem value="intermediate">{t("level_intermediate")}</SelectItem>
              <SelectItem value="advanced">{t("level_advanced")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={generateLearningPath}
          disabled={loading || !goal || !level}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white"
        >
          {loading ? t("generating_path") : t("generate_my_path")}
        </Button>
      </CardContent>
    </Card>
  )
}
