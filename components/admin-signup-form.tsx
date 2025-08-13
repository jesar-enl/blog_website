"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, UserPlus } from "lucide-react"
import Link from "next/link"
import { adminSignUp } from "@/lib/actions"
import { useRouter } from "next/navigation"

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
          Creating Account...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Create Admin Account
        </>
      )}
    </Button>
  )
}

export default function AdminSignupForm() {
  const [state, formAction] = useActionState(adminSignUp, null)
  const router = useRouter()

  if (state?.success === true) {
    router.push("/admin")
    return null
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center pb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 mx-auto">
          <UserPlus className="h-8 w-8 text-emerald-primary" />
        </div>
        <CardTitle className="font-heading text-2xl text-gray-900">Create Admin Account</CardTitle>
        <p className="text-gray-600">Set up your blog administration account</p>
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
              {state.success}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                required
                className="h-12 text-base"
              />
            </div>
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
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Choose a strong password"
                required
                className="h-12 text-base"
              />
            </div>
          </div>

          <SubmitButton />

          <div className="text-center text-gray-500 text-sm">
            Already have an admin account?{" "}
            <Link href="/admin/login" className="text-emerald-primary hover:text-emerald-600 font-medium">
              Sign in here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
