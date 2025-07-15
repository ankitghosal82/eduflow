"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { updateProfile } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, UserIcon, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTranslation } from "@/lib/i18n/use-translation"
import Link from "next/link"
import Image from "next/image"

const LEVEL_THRESHOLDS = [
  { level: 1, points: 0, prize: "Newbie Learner" },
  { level: 2, points: 50, prize: "Knowledge Seeker" },
  { level: 3, points: 150, prize: "Pathfinder" },
  { level: 4, points: 300, prize: "Master Explorer" },
  { level: 5, points: 500, prize: "EduFlow Grandmaster" },
]

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  const { toast } = useToast()
  const { t } = useTranslation()

  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [profileLoading, setProfileLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const [userPoints] = useLocalStorage<number>("userPoints", 0)
  const [userLevel] = useLocalStorage<number>("userLevel", 1)

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        setProfileLoading(true)
        const { data, error } = await supabase
          .from("profiles")
          .select(`full_name, avatar_url`)
          .eq("id", user.id)
          .single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 means no rows found, which is fine for new users
          console.error("Error fetching profile:", error.message)
          toast({
            title: t("error_loading_profile"),
            description: error.message,
            variant: "destructive",
          })
        } else if (data) {
          setFullName(data.full_name || "")
          setAvatarUrl(data.avatar_url || "")
        }
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [user, supabase, toast, t])

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsUpdating(true)
    const formData = new FormData(event.currentTarget)
    const result = await updateProfile(formData)

    if (result.success) {
      toast({
        title: t("profile_updated_success"),
        description: "Your profile has been updated.",
      })
    } else {
      toast({
        title: t("profile_update_error"),
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
    setIsUpdating(false)
  }

  const currentLevelThreshold = LEVEL_THRESHOLDS.find((level) => userLevel === level.level)
  const nextLevelThreshold = LEVEL_THRESHOLDS.find((level) => level.level === userLevel + 1)

  const pointsToNextLevel = nextLevelThreshold ? nextLevelThreshold.points - userPoints : 0
  const progressToNextLevel = nextLevelThreshold
    ? Math.min(
        100,
        ((userPoints - (currentLevelThreshold?.points || 0)) /
          (nextLevelThreshold.points - (currentLevelThreshold?.points || 0))) *
          100,
      )
    : 100

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-100">
        <p className="text-lg flex items-center gap-2">
          <Sparkles className="animate-pulse" /> {t("loading_profile")}
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4">
        <Card className="w-full max-w-md bg-gray-800 text-gray-100 border-gray-700 shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-400">{t("profile_page_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{t("login_to_view_profile")}</p>
            <Link href="/auth/login">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white">{t("login")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="sticky top-0 z-40 w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 mb-8 rounded-b-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-purple-400">
            <Sparkles className="h-7 w-7" />
            EduFlow
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-300 hover:text-purple-400 transition-colors">
              {t("home")}
            </Link>
            <Button
              onClick={() => updateProfile(new FormData())}
              variant="ghost"
              className="text-gray-300 hover:text-purple-400"
            >
              {t("logout")}
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto">
        <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">{t("profile_page_title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Info Card */}
          <Card className="bg-gray-800 text-gray-100 border-gray-700 shadow-lg p-6">
            <CardHeader className="flex flex-col items-center text-center pb-4">
              <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-purple-500 shadow-md">
                <Image src={avatarUrl || "/placeholder-user.jpg"} alt="User Avatar" layout="fill" objectFit="cover" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">{fullName || user.email}</CardTitle>
              {fullName && <p className="text-gray-400 text-lg">{user.email}</p>}
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-lg">
                  <UserIcon className="h-5 w-5 text-purple-400" />
                  <span>
                    {t("current_level")} {userLevel}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span>
                    {t("total_points")} {userPoints}
                  </span>
                </div>
                {nextLevelThreshold && (
                  <div className="mt-4">
                    <p className="text-gray-300 text-sm mb-2">
                      {t("next_level_in")} {pointsToNextLevel} {t("points_needed")}
                    </p>
                    <Progress value={progressToNextLevel} className="w-full h-2 bg-gray-700 [&>*]:bg-purple-500" />
                    {nextLevelThreshold.prize && (
                      <p className="text-sm text-gray-400 mt-2">
                        {t("prize_for_next_level", { prize: nextLevelThreshold.prize })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card className="bg-gray-800 text-gray-100 border-gray-700 shadow-lg p-6">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400">{t("edit_profile")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">{t("full_name")}</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("full_name_placeholder")}
                    className="bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="avatarUrl">{t("avatar_url")}</Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder={t("avatar_url_placeholder")}
                    className="bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500"
                  />
                </div>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white" disabled={isUpdating}>
                  {isUpdating ? t("updating_profile") : t("update_profile")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-900/80 border-t border-gray-700 py-6 text-center text-gray-400 mt-8 rounded-t-lg">
        <p>
          &copy; {new Date().getFullYear()} EduFlow. {t("all_rights_reserved")}.
        </p>
      </footer>
    </div>
  )
}
