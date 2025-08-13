import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight, Database } from "lucide-react"
import { getFeaturedPosts } from "@/lib/blog"

export default async function FeaturedPosts() {
  const featuredPosts = await getFeaturedPosts()

  if (featuredPosts.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mb-4">Featured Insights</h2>
            <p className="text-lg text-gray-600 mb-8">Handpicked articles that are making waves in our community.</p>

            <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-3">Database Setup Required</h3>
                <p className="text-gray-600 mb-4">
                  To see featured posts, please run the SQL scripts to set up your database tables.
                </p>
                <div className="bg-white rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-700 font-medium mb-2">Run these scripts in order:</p>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. scripts/01-create-categories.sql</li>
                    <li>2. scripts/02-create-posts.sql</li>
                    <li>3. scripts/03-create-comments.sql</li>
                    <li>4. scripts/04-create-likes.sql</li>
                    <li>5. scripts/05-create-newsletter.sql</li>
                    <li>6. scripts/06-create-admin-users.sql</li>
                    <li>7. scripts/07-create-functions.sql</li>
                    <li>8. scripts/08-seed-sample-data.sql</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mb-4">Featured Insights</h2>
            <p className="text-lg text-gray-600">Handpicked articles that are making waves in our community.</p>
          </div>
          <Link
            href="/posts"
            className="hidden sm:flex items-center text-emerald-primary hover:text-emerald-600 font-medium transition-colors"
          >
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredPosts.slice(0, 2).map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white">
                {post.featured_image_url && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={post.featured_image_url || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {post.categories && (
                      <Badge className="text-white" style={{ backgroundColor: post.categories.color }}>
                        {post.categories.name}
                      </Badge>
                    )}
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.reading_time} min read
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  {post.excerpt && <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>}
                  <div className="text-sm text-gray-500">By {post.author_name}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/posts"
            className="inline-flex items-center text-emerald-primary hover:text-emerald-600 font-medium transition-colors"
          >
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
