"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Admin sign in function
export async function adminSignIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Check if user is an admin
    const dbSupabase = createClient()
    const { data: adminUser, error: adminError } = await dbSupabase
      .from("admin_users")
      .select("*")
      .eq("email", email.toString())
      .eq("is_active", true)
      .single()

    if (adminError || !adminUser) {
      // Sign out the user if they're not an admin
      await supabase.auth.signOut()
      return { error: "Access denied. Admin privileges required." }
    }

    // Update last login
    await dbSupabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", adminUser.id)

    return { success: true }
  } catch (error) {
    console.error("Admin login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Admin sign up function (for initial setup)
export async function adminSignUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const name = formData.get("name")

  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Add to admin_users table
    const dbSupabase = createClient()
    const { error: dbError } = await dbSupabase.from("admin_users").insert({
      email: email.toString(),
      name: name.toString(),
      role: "admin",
      is_active: true,
    })

    if (dbError) {
      console.error("Error adding admin user:", dbError)
      return { error: "Failed to create admin account. Please try again." }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (signInError) {
      return { success: "Admin account created! Please sign in to continue." }
    }

    return { success: true }
  } catch (error) {
    console.error("Admin sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Admin sign out function
export async function adminSignOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/admin/login")
}
