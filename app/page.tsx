"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTranslation, supportedLanguages } from "@/lib/i18n/use-translation"
import { topics, type CourseItem } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Video, Code, Award, Share2, Download, Menu, X, Globe, Sparkles, Clock, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CourseCard } from "@/components/course-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Image from "next/image"

type Language = "en" | "es" | "bn" | "hi" | "gu" | "mr" | "pa"
type Difficulty = "all" | "easy" | "medium" | "hard"

const LEVEL_THRESHOLDS = [
  { level: 1, points: 0, prize: "Newbie Learner" },
  { level: 2, points: 50, prize: "Knowledge Seeker" },
  { level: 3, points: 150, prize: "Pathfinder" },
  { level: 4, points: 300, prize: "Master Explorer" },
  { level: 5, points: 500, prize: "EduFlow Grandmaster" },
]

export default function Home() {
  const { t, setLanguage, language } = useTranslation()
  const [completedItems, setCompletedItems] = useLocalStorage<Record<string, boolean>>("learningPathProgress", {})
  const [userPoints, setUserPoints] = useLocalStorage<number>("userPoints", 0)
  const [userLevel, setUserLevel] = useLocalStorage<number>("userLevel", 1)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [overallProgress, setOverallProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>("all")
  const { toast } = useToast()

  useEffect(() => {
    let totalCompleted = 0
    let totalAvailable = 0
    topics.forEach((topic) => {
      totalAvailable += topic.items.length
      totalCompleted += topic.items.filter((item) => completedItems[item.id]).length
    })
    setOverallProgress({
      completed: totalCompleted,
      total: totalAvailable,
      percentage: totalAvailable > 0 ? Math.round((totalCompleted / totalAvailable) * 100) : 0,
    })
  }, [completedItems])

  const handleItemCompletion = (itemId: string, points: number) => {
    setCompletedItems((prev) => {
      const newCompleted = { ...prev, [itemId]: !prev[itemId] }
      if (newCompleted[itemId]) {
        setUserPoints((prevPoints) => prevPoints + points)
        toast({
          title: t("course_item_completed_title"),
          description: t("course_item_completed_description", { points }),
          duration: 2000,
        })
      } else {
        setUserPoints((prevPoints) => Math.max(0, prevPoints - points))
        toast({
          title: t("course_item_unmarked_title"),
          description: t("course_item_unmarked_description", { points }),
          duration: 2000,
        })
      }
      return newCompleted
    })
  }

  useEffect(() => {
    const currentLevelThreshold = LEVEL_THRESHOLDS.find((level) => userLevel === level.level)
    const nextLevelThreshold = LEVEL_THRESHOLDS.find((level) => level.level === userLevel + 1)

    if (nextLevelThreshold && userPoints >= nextLevelThreshold.points) {
      const newLevel = nextLevelThreshold.level
      setUserLevel(newLevel)
      const prize = nextLevelThreshold.prize
      toast({
        title: t("level_up_title", { level: newLevel }),
        description: prize ? t("level_up_description", { prize }) : t("level_up_description_no_prize"),
        duration: 5000,
      })
    }
  }, [userPoints, userLevel, setUserLevel, toast, t])

  const getIconForType = (type: CourseItem["type"]) => {
    switch (type) {
      case "youtube":
        return <Video className="h-4 w-4 text-red-400" />
      case "article":
        return <BookOpen className="h-4 w-4 text-blue-400" />
      case "github":
        return <Code className="h-4 w-4 text-purple-400" />
      default:
        return null
    }
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  const handleExportToPDF = () => {
    toast({
      title: t("export_to_pdf_title"),
      description: t("export_to_pdf_description"),
      duration: 3000,
    })
  }

  const handleSharePublicLink = () => {
    toast({
      title: t("share_public_link_title"),
      description: t("share_public_link_description"),
      duration: 3000,
    })
  }

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || topic.difficulty === difficultyFilter
    return matchesSearch && matchesDifficulty
  })

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <header className="sticky top-0 z-40 w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-purple-400">
            <Sparkles className="h-7 w-7" />
            EduFlow
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-purple-400 transition-colors">
              {t("home")}
            </Link>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="appearance-none bg-gray-800 text-gray-300 py-1 px-2 rounded-md pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-purple-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4 px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-purple-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("home")}
              </Link>
              <div className="relative w-full">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as Language)}
                  className="appearance-none bg-gray-700 text-gray-300 py-2 px-3 rounded-md pr-8 w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Intro Page Section */}
        <section className="text-center mb-12 py-16 md:py-24 bg-gray-800/50 rounded-xl shadow-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg mb-6 leading-tight">
            {t("intro_heading")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 px-4">{t("intro_description")}</p>
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <Button
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-900 px-6 py-3 text-lg shadow-lg bg-transparent"
              onClick={handleExportToPDF}
            >
              <Download className="mr-2 h-5 w-5" /> {t("export_to_pdf")}
            </Button>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-900 px-6 py-3 text-lg shadow-lg bg-transparent"
              onClick={handleSharePublicLink}
            >
              <Share2 className="mr-2 h-5 w-5" /> {t("share_public_link")}
            </Button>
          </div>
          <Card className="p-6 shadow-xl border-none bg-gray-800 max-w-xl mx-auto">
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
              <div className="flex items-center justify-center gap-4 text-gray-300">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Award className="h-5 w-5" /> {userPoints} {t("points")}
                </span>
                <span className="text-lg font-medium">
                  {t("level")} {userLevel}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-4xl font-bold text-purple-400 mb-8 text-center">{t("learning_paths")}</h2>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t("search_topics")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 bg-gray-800 text-gray-100 border-gray-700 shadow-md focus:border-purple-500"
              />
            </div>
            <Select value={difficultyFilter} onValueChange={(value: Difficulty) => setDifficultyFilter(value)}>
              <SelectTrigger className="w-full sm:max-w-[180px] bg-gray-800 text-gray-100 border-gray-700 shadow-md focus:border-purple-500">
                <SelectValue placeholder={t("filter_by_difficulty")} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
                <SelectItem value="all">{t("all_difficulties")}</SelectItem>
                <SelectItem value="easy">{t("difficulty_easy")}</SelectItem>
                <SelectItem value="medium">{t("difficulty_medium")}</SelectItem>
                <SelectItem value="hard">{t("difficulty_hard")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <Card
                  key={topic.id}
                  className="p-6 shadow-xl border-none bg-gray-800 hover:shadow-purple-500/30 transition-shadow"
                >
                  <div
                    className={cn(
                      "rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center gap-4",
                      topic.headerBg,
                      topic.headerText,
                    )}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="rounded-full bg-white p-2 shadow-md overflow-hidden"
                    >
                      <Image
                        src={topic.image || "/placeholder.png"}
                        alt={`${topic.name} icon`}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="flex flex-col items-center sm:items-start">
                      <h3 className="text-2xl font-bold text-center sm:text-left">{topic.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-lg font-medium">
                        <span className="flex items-center gap-1">
                          {getDifficultyEmoji(topic.difficulty)} {getTranslatedDifficulty(topic.difficulty)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {topic.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{topic.description}</p>
                  <h4 className="text-xl font-semibold text-purple-300 mb-4">{t("course_items")}</h4>
                  <div className="space-y-4">
                    {topic.items.map((item) => (
                      <CourseCard
                        key={item.id}
                        item={item}
                        isCompleted={completedItems[item.id] || false}
                        onToggleComplete={() => handleItemCompletion(item.id, item.points)}
                        getIconForType={getIconForType}
                      />
                    ))}
                  </div>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400 italic">{t("no_topics_match_filters")}</p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900/80 border-t border-gray-700 py-6 text-center text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} EduFlow. {t("all_rights_reserved")}.
        </p>
      </footer>
    </div>
  )
}
