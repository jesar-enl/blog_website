"use client"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { subscribeToNewsletter } from "@/lib/user-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-emerald-primary hover:bg-emerald-600 text-white h-12 px-8 text-lg font-medium"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Subscribing...
        </>
      ) : (
        "Subscribe"
      )}
    </Button>
  )
}

export default function NewsletterSignup() {
  const [state, formAction] = useActionState(subscribeToNewsletter, null)

  return (
    <section className="py-16 lg:py-24 bg-emerald-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-2xl">
          <CardContent className="p-8 lg:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                <Mail className="h-8 w-8 text-emerald-primary" />
              </div>

              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mb-4">Stay in the Loop</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Get the latest insights on tech, wellness, lifestyle, and personal growth delivered straight to your
                inbox. No spam, just valuable content.
              </p>

              {state?.success ? (
                <div className="flex items-center justify-center space-x-2 text-emerald-600">
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-medium text-lg">{state.success}</span>
                </div>
              ) : (
                <form action={formAction} className="max-w-md mx-auto">
                  {state?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                      {state.error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="flex-1 h-12 text-lg"
                    />
                    <SubmitButton />
                  </div>
                </form>
              )}

              <p className="text-sm text-gray-500 mt-4">Join 1,000+ readers who trust us with their inbox.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
