import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AdminNavigation from "@/components/admin-navigation"
import { getAdminStats } from "@/lib/admin"
import { FileText, MessageSquare, Users, Mail, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Get current admin user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session?.user.email).single()

  // Get stats
  const stats = await getAdminStats()

  const statCards = [
    {
      title: "Published Posts",
      value: stats.publishedPosts,
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/admin/posts?filter=published",
    },
    {
      title: "Draft Posts",
      value: stats.draftPosts,
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/admin/posts?filter=drafts",
    },
    {
      title: "Pending Comments",
      value: stats.pendingComments,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/comments?filter=pending",
    },
    {
      title: "Newsletter Subscribers",
      value: stats.subscribers,
      icon: Mail,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/admin/newsletter",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: TrendingUp,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      href: "/admin/analytics",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation adminName={adminUser?.name || "Admin"} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your blog's performance and content.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <IconComponent className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full bg-emerald-primary hover:bg-emerald-600 text-white h-12">
                  <Link href="/admin/posts/new">
                    <FileText className="h-4 w-4 mr-2" />
                    Create New Post
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-12 bg-transparent">
                  <Link href="/admin/comments?filter=pending">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Moderate Comments ({stats.pendingComments})
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-12 bg-transparent">
                  <Link href="/admin/categories">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Categories
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-600">Blog system initialized</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Sample posts created</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Categories configured</span>
                </div>
                <div className="text-center pt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/analytics">View Full Analytics</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
