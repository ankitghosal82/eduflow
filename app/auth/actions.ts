"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign-in error:", error.message)
    return redirect("/auth/login?message=Could not authenticate user")
  }

  return redirect("/")
}

export async function signUp(formData: FormData) {
  const origin = headers().get("origin")
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Sign-up error:", error.message)
    return redirect("/auth/register?message=Could not authenticate user")
  }

  return redirect("/auth/login?message=Check email to verify account")
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Sign-out error:", error.message)
  }

  return redirect("/auth/login")
}

export async function updateProfile(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  const fullName = formData.get("fullName") as string
  const avatarUrl = formData.get("avatarUrl") as string

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  )

  if (error) {
    console.error("Profile update error:", error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}
