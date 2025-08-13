import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to login (middleware should handle this, but double-check)
  if (!session) {
    redirect("/admin/login")
  }

  // Verify user is an admin
  try {
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .eq("is_active", true)
      .single()

    if (error || !adminUser) {
      redirect("/admin/login")
    }
  } catch (error) {
    redirect("/admin/login")
  }

  return <>{children}</>
}
