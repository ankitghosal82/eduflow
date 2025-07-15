import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `cookies().set()` method can only be called from a Server Component or Server Action.
          // This `try/catch` is here to enable your app to render originally, but will throw an error if called in a Client Component with a `track`
          // e.g. `track("login", { status: "success" })`
          console.warn("Cookie set failed:", error)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `cookies().set()` method can only be called from a Server Component or Server Action.
          // This `try/catch` is here to enable your app to render originally, but will throw an error if called in a Client Component with a `track`
          // e.g. `track("login", { status: "success" })`
          console.warn("Cookie remove failed:", error)
        }
      },
    },
  })
}
