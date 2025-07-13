"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, Youtube, FileText, Github, Download, Award, Clock } from "lucide-react"
import Link from "next/link"
import { topics, type CourseItem } from "@/lib/data"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { cn } from "@/lib/utils"
import AiPathGenerator from "@/components/ai-path-generator"
import RoadmapGenerator from "@/components/roadmap-generator"
import { useToast } from "@/hooks/use-toast"
import { useTranslation, supportedLanguages } from "@/lib/i18n/use-translation" // Add this import

const LEVEL_THRESHOLDS = [
  { level: 1, points: 0, prize: "Newbie Learner" },
  { level: 2, points: 50, prize: "Knowledge Seeker" },
  { level: 3, points: 150, prize: "Pathfinder" },
  { level: 4, points: 300, prize: "Master Explorer" },
  { level: 5, points: 500, prize: "EduFlow Grandmaster" },
]

interface CourseCardProps {
  item: CourseItem
  isCompleted: boolean
  onToggleComplete: (id: string, completed: boolean) => void
}

function CourseCard({ item, isCompleted, onToggleComplete }: CourseCardProps) {
  const { t } = useTranslation() // Use translation hook
  const Icon =
    item.type === "youtube" ? Youtube : item.type === "article" ? FileText : item.type === "github" ? Github : null

  return (
    <Card className="w-full bg-gray-800 text-gray-100 border-gray-700 transition-all duration-200 hover:shadow-lg hover:border-gray-600">
      <Collapsible defaultOpen={false}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Checkbox
              id={`item-${item.id}`}
              checked={isCompleted}
              onCheckedChange={(checked) => onToggleComplete(item.id, Boolean(checked))}
              aria-label={`Mark ${item.title} as complete`}
              className="border-gray-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <CardTitle className={cn("text-lg font-semibold", isCompleted && "line-through text-gray-400")}>
              {item.title}
            </CardTitle>
          </div>
          <CollapsibleTrigger asChild>
            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-2">
            <CardDescription className={cn("text-gray-300", isCompleted && "line-through")}>
              {item.description}
            </CardDescription>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              {Icon && <Icon className="h-4 w-4" />}
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-purple-400 hover:text-purple-300"
              >
                {item.type === "youtube" && t("watch_video")}
                {item.type === "article" && t("read_article")}
                {item.type === "github" && t("view_project")}
              </Link>
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300 border border-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default function LearningPathPage() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined)
  const [completedItems, setCompletedItems] = useLocalStorage<Record<string, boolean>>("learningPathProgress", {})
  const [aiGeneratedSuggestions, setAiGeneratedSuggestions] = useState<{ ids: string[]; narrative: string } | null>(
    null,
  )

  const [userPoints, setUserPoints] = useLocalStorage<number>("userPoints", 0)
  const [userLevel, setUserLevel] = useLocalStorage<number>("userLevel", 1)
  const { toast } = useToast()
  const { lang, setLanguage, t } = useTranslation() // Use translation hook

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    if (topics.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id)
    }
  }, [selectedTopicId])

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId)

  const handleToggleComplete = (itemId: string, completed: boolean) => {
    setCompletedItems((prev) => {
      const newCompletedItems = {
        ...prev,
        [itemId]: completed,
      }

      // Award points only if marking as complete and it was previously incomplete
      if (completed && !prev[itemId]) {
        setUserPoints((currentPoints) => {
          const newPoints = currentPoints + 10 // Award 10 points per item

          // Check for level up
          const currentLevelThreshold = LEVEL_THRESHOLDS.find((level) => userLevel === level.level)
          const nextLevelThreshold = LEVEL_THRESHOLDS.find((level) => level.level === userLevel + 1)

          if (nextLevelThreshold && newPoints >= nextLevelThreshold.points) {
            const newLevel = nextLevelThreshold.level
            setUserLevel(newLevel)
            const prize = nextLevelThreshold.prize
            toast({
              title: t("level_up_title", { level: newLevel }),
              description: prize ? t("level_up_description", { prize }) : t("level_up_description_no_prize"),
              duration: 5000,
            })
          }
          return newPoints
        })
      }
      return newCompletedItems
    })
  }

  const handleExportPDF = async () => {
    if (typeof window === "undefined") return
    const element = document.getElementById("learning-section")
    if (element) {
      const { default: html2pdf } = await import("html2pdf.js")
      html2pdf().from(element).save("learning-path.pdf")
    }
  }

  const getProgress = () => {
    if (!selectedTopic) return { completed: 0, total: 0, percentage: 0 }
    const total = selectedTopic.items.length
    const completed = selectedTopic.items.filter((item) => completedItems[item.id]).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }

  const { completed, total, percentage } = getProgress()

  const allTagsForSelectedTopic = Array.from(new Set(selectedTopic?.items.flatMap((item) => item.tags) || [])).sort()

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredItems =
    selectedTopic?.items.filter((item) => {
      if (activeFilters.length === 0) return true // Show all if no filters active
      return activeFilters.some((filterTag) => item.tags.includes(filterTag))
    }) || []

  const getDifficultyEmoji = (difficulty: "easy" | "medium" | "hard") => {
    switch (difficulty) {
      case "easy":
        return "🟢"
      case "medium":
        return "🟡"
      case "hard":
        return "🔴"
      default:
        return ""
    }
  }

  const getTranslatedDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    switch (difficulty) {
      case "easy":
        return t("difficulty_easy")
      case "medium":
        return t("difficulty_medium")
      case "hard":
        return t("difficulty_hard")
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 lg:p-8 text-gray-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-extrabold text-purple-400 drop-shadow-lg">{t("app_title")}</h1>
          <div className="flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1 text-yellow-400">
              <Award className="h-5 w-5" /> {userPoints} {t("points")}
            </span>
            <span className="text-lg font-medium">
              {t("level")} {userLevel}
            </span>
            {/* Add this Link to Profile */}
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                {t("my_profile")}
              </Button>
            </Link>
            {/* Language Selector */}
            <Select onValueChange={setLanguage} value={lang}>
              <SelectTrigger className="w-[150px] bg-gray-800 text-gray-100 border-gray-700 shadow-md hover:shadow-lg transition-shadow hover:border-purple-500">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto bg-gray-800 text-gray-100 border-gray-700">
                {supportedLanguages.map((l) => (
                  <SelectItem key={l.code} value={l.code} className="py-2 hover:bg-gray-700 focus:bg-gray-700">
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">{t("app_description")}</p>

        <AiPathGenerator
          onPathGenerated={(ids, narrative) => {
            setAiGeneratedSuggestions({ ids, narrative })
            if (ids.length > 0) {
              setSelectedTopicId(ids[0]) // Auto-select the first suggested topic
            }
          }}
        />

        {aiGeneratedSuggestions && (
          <Card className="p-6 shadow-xl border-none bg-gray-800">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-green-400">{t("your_personalized_path")}</CardTitle>
              <CardDescription className="text-gray-300">{aiGeneratedSuggestions.narrative}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-3">
              {aiGeneratedSuggestions.ids.map((id) => {
                const topic = topics.find((t) => t.id === id)
                return (
                  topic && (
                    <Button
                      key={topic.id}
                      variant="outline"
                      className={cn(
                        "bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600 hover:text-white",
                        topic.colorDot.replace("bg-", "hover:bg-"), // Apply hover color based on topic color
                      )}
                      onClick={() => setSelectedTopicId(topic.id)}
                    >
                      <span className={cn("h-3 w-3 rounded-full mr-2", topic.colorDot)} aria-hidden="true" />
                      {topic.name}
                    </Button>
                  )
                )
              })}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center mb-4">
          <Select onValueChange={setSelectedTopicId} value={selectedTopicId}>
            <SelectTrigger className="w-[280px] bg-gray-800 text-gray-100 border-gray-700 shadow-md hover:shadow-lg transition-shadow hover:border-purple-500">
              <SelectValue placeholder={t("select_a_topic")} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto bg-gray-800 text-gray-100 border-gray-700">
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id} className="py-2 hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <span className={cn("h-3 w-3 rounded-full", topic.colorDot)} aria-hidden="true" />
                    {topic.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTopic ? (
          <>
            <RoadmapGenerator selectedTopic={selectedTopic} /> {/* New Roadmap Generator */}
            <Card className="p-6 shadow-xl border-none bg-gray-800" id="learning-section">
              <div
                className={cn(
                  "rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center gap-4",
                  selectedTopic.headerBg,
                  selectedTopic.headerText,
                )}
              >
                <Image
                  src={selectedTopic.image || "/placeholder.svg"}
                  alt={`${selectedTopic.name} icon`}
                  width={100}
                  height={100}
                  className="rounded-full bg-white p-2 shadow-md object-cover"
                />
                <div className="flex flex-col items-center sm:items-start">
                  <h2 className="text-2xl font-bold text-center sm:text-left">{selectedTopic.name} Course Flow</h2>
                  <div className="flex items-center gap-3 mt-1 text-lg font-medium">
                    <span className="flex items-center gap-1">
                      {getDifficultyEmoji(selectedTopic.difficulty)} {getTranslatedDifficulty(selectedTopic.difficulty)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {selectedTopic.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Here's a curated list of resources for your {selectedTopic.name} learning path:
              </p>

              {/* Tag Filters */}
              {allTagsForSelectedTopic.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="text-gray-400 text-sm mr-1">{t("filter_by")}</span>
                  {allTagsForSelectedTopic.map((tag) => (
                    <Button
                      key={tag}
                      variant={activeFilters.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter(tag)}
                      className={cn(
                        "capitalize",
                        activeFilters.includes(tag)
                          ? "bg-purple-600 hover:bg-purple-500 text-white"
                          : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white",
                      )}
                    >
                      {tag}
                    </Button>
                  ))}
                  {activeFilters.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveFilters([])}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {t("clear_filters")}
                    </Button>
                  )}
                </div>
              )}

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{t("progress", { completed, total })}</span>
                  <span>{percentage}%</span>
                </div>
                <Progress value={percentage} className="w-full h-2 bg-gray-700 [&>*]:bg-purple-500" />
              </div>
              <div className="space-y-4">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <CourseCard
                      key={item.id}
                      item={item}
                      isCompleted={completedItems[item.id] || false}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-400 italic">{t("no_items_match_filters")}</p>
                )}
              </div>
              <Button className="mt-6 bg-purple-600 hover:bg-purple-500 text-white" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" /> {t("export_as_pdf")}
              </Button>
            </Card>
          </>
        ) : (
          <Card className="p-6 text-center bg-gray-800 text-gray-100 shadow-md border-gray-700">
            <CardTitle className="mb-2 text-purple-400">{t("welcome_to_eduflow")}</CardTitle>
            <CardDescription className="text-gray-300">{t("select_topic_to_begin")}</CardDescription>
          </Card>
        )}
      </div>
    </div>
  )
}
