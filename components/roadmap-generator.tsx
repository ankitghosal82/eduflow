"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Topic, CourseItem } from "@/lib/data"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, CalendarDays } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/use-translation" // Add this import

interface RoadmapGeneratorProps {
  selectedTopic: Topic | undefined
}

interface DailyPlan {
  day: number
  items: CourseItem[]
}

export default function RoadmapGenerator({ selectedTopic }: RoadmapGeneratorProps) {
  const [duration, setDuration] = useState<number | undefined>(undefined)
  const [roadmap, setRoadmap] = useState<DailyPlan[] | null>(null)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation() // Use translation hook

  const generateRoadmap = () => {
    if (!selectedTopic || !duration) {
      alert(t("alert_select_topic_duration")) // Translated alert
      return
    }

    setLoading(true)
    const totalItems = selectedTopic.items.length
    const itemsPerDay = Math.ceil(totalItems / duration) // Distribute items as evenly as possible

    const newRoadmap: DailyPlan[] = []
    let itemIndex = 0

    for (let day = 1; day <= duration; day++) {
      const dailyItems: CourseItem[] = []
      for (let i = 0; i < itemsPerDay && itemIndex < totalItems; i++) {
        dailyItems.push(selectedTopic.items[itemIndex])
        itemIndex++
      }
      newRoadmap.push({ day, items: dailyItems })
    }

    // If there are remaining items due to rounding, add them to the last day
    while (itemIndex < totalItems) {
      newRoadmap[newRoadmap.length - 1].items.push(selectedTopic.items[itemIndex])
      itemIndex++
    }

    setTimeout(() => {
      setRoadmap(newRoadmap)
      setLoading(false)
    }, 700) // Simulate a short loading time
  }

  return (
    <Card className="w-full bg-gray-800 text-gray-100 border-gray-700 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-400">{t("roadmap_title")}</CardTitle>
        <CardDescription className="text-gray-300">{t("roadmap_description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Select onValueChange={(value) => setDuration(Number(value))} value={duration?.toString()}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder={t("select_duration")} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
              <SelectItem value="15">{t("days_15")}</SelectItem>
              <SelectItem value="30">{t("days_30")}</SelectItem>
              <SelectItem value="60">{t("days_60")}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={generateRoadmap}
            disabled={loading || !selectedTopic || !duration}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white"
          >
            {loading ? t("generating") : t("generate_roadmap")}
          </Button>
        </div>

        {roadmap && roadmap.length > 0 && (
          <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <h3 className="text-xl font-semibold text-green-400 text-center">
              {t("roadmap_for", { topicName: selectedTopic?.name || "", duration: duration || "" })}
            </h3>
            {roadmap.map((dayPlan) => (
              <Card key={dayPlan.day} className="bg-gray-700 border-gray-600">
                <Collapsible defaultOpen={dayPlan.items.length > 0}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-gray-400" /> {t("day", { dayNumber: dayPlan.day })}
                    </CardTitle>
                    <CollapsibleTrigger asChild>
                      <ChevronDown className="h-5 w-5 text-gray-400 transition-transform data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-2 space-y-2">
                      {dayPlan.items.length > 0 ? (
                        dayPlan.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="h-2 w-2 rounded-full bg-purple-400" />
                            <Link
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-purple-300 hover:text-purple-200"
                            >
                              {item.title} ({item.type})
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm italic">{t("no_items_planned")}</p>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
