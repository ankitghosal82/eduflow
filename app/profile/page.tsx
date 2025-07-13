"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTranslation } from "@/lib/i18n/use-translation"
import { topics, type CourseItem } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Award, ChevronDown, Home, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { t } = useTranslation()
  const [completedItems, setCompletedItems] = useLocalStorage<Record<string, boolean>>("learningPathProgress", {})
  const [userPoints, setUserPoints] = useLocalStorage<number>("userPoints", 0)
  const [userLevel, setUserLevel] = useLocalStorage<number>("userLevel", 1)
  const { toast } = useToast()

  const [overallProgress, setOverallProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  const [completedItemsByTopic, setCompletedItemsByTopic] = useState<Record<string, CourseItem[]>>({})

  useEffect(() => {
    let totalCompleted = 0
    let totalAvailable = 0
    const groupedCompleted: Record<string, CourseItem[]> = {}

    topics.forEach((topic) => {
      totalAvailable += topic.items.length
      const completedInTopic = topic.items.filter((item) => completedItems[item.id])
      if (completedInTopic.length > 0) {
        groupedCompleted[topic.id] = completedInTopic
      }
      totalCompleted += completedInTopic.length
    })

    setOverallProgress({
      completed: totalCompleted,
      total: totalAvailable,
      percentage: totalAvailable > 0 ? Math.round((totalCompleted / totalAvailable) * 100) : 0,
    })
    setCompletedItemsByTopic(groupedCompleted)
  }, [completedItems])

  const handleResetAllProgress = () => {
    if (window.confirm("Are you sure you want to reset all your progress, points, and level? This cannot be undone.")) {
      setCompletedItems({})
      setUserPoints(0)
      setUserLevel(1)
      toast({
        title: "Progress Reset!",
        description: "All your learning progress, points, and level have been reset.",
        duration: 3000,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 lg:p-8 text-gray-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-purple-400 drop-shadow-lg">{t("my_profile")}</h1>
          <div className="flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1 text-yellow-400">
              <Award className="h-5 w-5" /> {userPoints} {t("points")}
            </span>
            <span className="text-lg font-medium">
              {t("level")} {userLevel}
            </span>
          </div>
        </div>

        <Card className="p-6 shadow-xl border-none bg-gray-800">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-green-400">{t("overall_progress")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>{t("progress", { completed: overallProgress.completed, total: overallProgress.total })}</span>
                <span>{overallProgress.percentage}%</span>
              </div>
              <Progress value={overallProgress.percentage} className="w-full h-2 bg-gray-700 [&>*]:bg-purple-500" />
            </div>
            <Button onClick={handleResetAllProgress} className="w-full bg-red-600 hover:bg-red-500 text-white mt-4">
              <RefreshCcw className="mr-2 h-4 w-4" /> {t("reset_all_progress")}
            </Button>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-xl border-none bg-gray-800">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-blue-400">{t("completed_courses")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(completedItemsByTopic).length > 0 ? (
              Object.entries(completedItemsByTopic).map(([topicId, items]) => {
                const topic = topics.find((t) => t.id === topicId)
                if (!topic) return null
                return (
                  <Collapsible key={topic.id} defaultOpen={true}>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <span className={cn("h-3 w-3 rounded-full", topic.colorDot)} aria-hidden="true" />
                          {topic.name}
                        </CardTitle>
                        <CollapsibleTrigger asChild>
                          <ChevronDown className="h-5 w-5 text-gray-400 transition-transform data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="pt-2 space-y-2">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="h-2 w-2 rounded-full bg-green-400" />
                              <Link
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-purple-300 hover:text-purple-200"
                              >
                                {item.title}
                              </Link>
                            </div>
                          ))}
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                )
              })
            ) : (
              <CardDescription className="text-center text-gray-400 italic">{t("no_completed_items")}</CardDescription>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6">
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-500 text-white">
              <Home className="mr-2 h-4 w-4" /> {t("app_title")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
