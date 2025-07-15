import Link from "next/link"
import { signUp } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function Register({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100 border-gray-700 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-400">{t("sign_up")}</CardTitle>
          <CardDescription className="text-gray-400">{t("app_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={signUp}>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("email_placeholder")}
                required
                className="bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t("password_placeholder")}
                required
                className="bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500"
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white">
              {t("sign_up")}
            </Button>
            {searchParams?.message && (
              <p className="mt-4 p-3 text-center text-sm text-red-400 bg-red-900/20 rounded-md">
                {searchParams.message}
              </p>
            )}
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            {t("already_have_account")}{" "}
            <Link href="/auth/login" className="font-medium text-purple-400 hover:underline">
              {t("sign_in")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
