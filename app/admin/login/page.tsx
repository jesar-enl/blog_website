import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLoginForm from "@/components/admin-login-form"

export default async function AdminLoginPage() {
  // If Supabase is not configured, show setup message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
          <p className="text-gray-600">Please configure your Supabase integration to use admin authentication.</p>
        </div>
      </div>
    )
  }

  // Check if user is already logged in
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, check if they're an admin and redirect
  if (session) {
    try {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", session.user.email)
        .eq("is_active", true)
        .single()

      if (adminUser) {
        redirect("/admin")
      }
    } catch (error) {
      // User is logged in but not an admin, continue to login form
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 px-4 py-12 sm:px-6 lg:px-8">
      <AdminLoginForm />
    </div>
  )
}
