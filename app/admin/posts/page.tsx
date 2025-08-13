import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AdminNavigation from "@/components/admin-navigation"
import { getAdminPosts } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/blog"
import { Edit, Eye, Trash2, Plus, FileText } from "lucide-react"

export default async function AdminPostsPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session?.user.email).single()

  const posts = await getAdminPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation adminName={adminUser?.name || "Admin"} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">Posts</h1>
            <p className="text-gray-600">Manage your blog posts and content.</p>
          </div>
          <Button asChild className="bg-emerald-primary hover:bg-emerald-600 text-white">
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading font-semibold text-lg text-gray-900">{post.title}</h3>
                      <Badge variant={post.is_published ? "default" : "secondary"}>
                        {post.is_published ? "Published" : "Draft"}
                      </Badge>
                      {post.is_featured && <Badge className="bg-amber-100 text-amber-800">Featured</Badge>}
                      {post.categories && (
                        <Badge className="text-white" style={{ backgroundColor: post.categories.color }}>
                          {post.categories.name}
                        </Badge>
                      )}
                    </div>

                    {post.excerpt && <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>}

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>By {post.author_name}</span>
                      <span>{formatDate(post.created_at)}</span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.view_count} views
                      </span>
                      <span>{post.reading_time} min read</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {post.is_published && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/posts/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
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

        {posts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-sm mx-auto">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first blog post.</p>
                <Button asChild className="bg-emerald-primary hover:bg-emerald-600 text-white">
                  <Link href="/admin/posts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
