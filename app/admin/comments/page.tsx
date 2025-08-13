import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AdminNavigation from "@/components/admin-navigation"
import { getAdminComments } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/blog"
import { Check, X, Trash2, MessageSquare } from "lucide-react"

export default async function AdminCommentsPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session?.user.email).single()

  const comments = await getAdminComments()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation adminName={adminUser?.name || "Admin"} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">Comments</h1>
          <p className="text-gray-600">Moderate and manage user comments on your posts.</p>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <Card key={comment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-emerald-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{comment.author_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{comment.author_name}</p>
                        <p className="text-sm text-gray-500">{comment.author_email}</p>
                      </div>
                      <Badge variant={comment.is_approved ? "default" : "secondary"}>
                        {comment.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>On: {comment.posts?.title}</span>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!comment.is_approved && (
                      <Button size="sm" className="bg-emerald-primary hover:bg-emerald-600 text-white">
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {comment.is_approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700 bg-transparent"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {comments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-sm mx-auto">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">No comments yet</h3>
                <p className="text-gray-600">Comments from your blog posts will appear here for moderation.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
