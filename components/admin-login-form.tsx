"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { adminSignIn } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-emerald-primary hover:bg-emerald-600 text-white py-6 text-lg font-medium rounded-lg h-[60px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <Shield className="mr-2 h-4 w-4" />
          Sign In to Admin
        </>
      )}
    </Button>
  )
}

export default function AdminLoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(adminSignIn, null)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        router.push("/admin")
      }, 100)
    }
  }, [state, router])

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center pb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 mx-auto">
          <Shield className="h-8 w-8 text-emerald-primary" />
        </div>
        <CardTitle className="font-heading text-2xl text-gray-900">Admin Access</CardTitle>
        <p className="text-gray-600">Sign in to manage your blog</p>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              Login successful! Redirecting to admin dashboard...
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input id="password" name="password" type="password" required className="h-12 text-base" />
            </div>
          </div>

          <SubmitButton />

          <div className="text-center text-gray-500 text-sm">
            Need to create an admin account?{" "}
            <Link href="/admin/signup" className="text-emerald-primary hover:text-emerald-600 font-medium">
              Sign up here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
