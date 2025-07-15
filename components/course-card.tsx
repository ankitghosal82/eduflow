import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { CourseItem } from "@/lib/data"
import type { ReactNode } from "react"

interface CourseCardProps {
  item: CourseItem
  isCompleted: boolean
  onToggleComplete: () => void
  getIconForType: (type: CourseItem["type"]) => ReactNode
}

export function CourseCard({ item, isCompleted, onToggleComplete, getIconForType }: CourseCardProps) {
  return (
    <Card
      className={cn(
        "flex items-center justify-between p-4 bg-gray-700 border-gray-600 transition-all duration-200",
        isCompleted ? "opacity-70 border-green-500" : "hover:border-purple-500",
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          id={`item-${item.id}`}
          checked={isCompleted}
          onCheckedChange={onToggleComplete}
          className="h-5 w-5 border-gray-400 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white"
        />
        <div className="flex flex-col">
          <label
            htmlFor={`item-${item.id}`}
            className={cn("text-lg font-medium cursor-pointer", isCompleted && "line-through text-gray-400")}
          >
            {item.name}
          </label>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            {getIconForType(item.type)}
            {item.type}
          </p>
        </div>
      </div>
      <span className="text-sm text-yellow-400 font-semibold">{item.points} pts</span>
    </Card>
  )
}
