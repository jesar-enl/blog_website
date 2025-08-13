"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MessageSquare } from "lucide-react"
import { addComment } from "@/lib/user-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-emerald-primary hover:bg-emerald-600 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <MessageSquare className="mr-2 h-4 w-4" />
          Post Comment
        </>
      )}
    </Button>
  )
}

interface CommentFormProps {
  postId: number
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [state, formAction] = useActionState(addComment, null)

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-heading">Leave a Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="postId" value={postId} />

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <Input
                id="authorName"
                name="authorName"
                type="text"
                required
                placeholder="Your name"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                id="authorEmail"
                name="authorEmail"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Comment *
            </label>
            <Textarea
              id="content"
              name="content"
              required
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full"
            />
          </div>

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
