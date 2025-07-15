import { Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <div className="flex flex-col items-center gap-4">
        <Sparkles className="h-16 w-16 animate-pulse text-purple-400" />
        <h1 className="text-3xl font-bold">Loading EduFlow...</h1>
        <p className="text-gray-400">Preparing your learning experience.</p>
      </div>
    </div>
  )
}
