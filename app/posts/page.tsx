import type { Metadata } from "next"
import Link from "next/link"
import { getPosts, getCategories } from "@/lib/blog"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"
import { formatDate } from "@/lib/blog"

export const metadata: Metadata = {
  title: "All Posts - Growth Hub",
  description: "Explore all our articles on technology, wellness, lifestyle, and personal development.",
}

export default async function PostsPage() {
  const posts = await getPosts()
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-gray-900 mb-4">All Posts</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover insights across technology, wellness, lifestyle, and personal development.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link href="/posts">
            <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-gray-100">
              All Categories
            </Badge>
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm hover:bg-gray-100"
                style={{ borderColor: category.color, color: category.color }}
              >
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white h-full">
                {post.featured_image_url && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={post.featured_image_url || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
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

                  <h2 className="font-heading font-semibold text-xl text-gray-900 mb-3 line-clamp-2 flex-grow">
                    {post.title}
                  </h2>

                  {post.excerpt && <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>}

                  <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                    </span>
                    <span>By {post.author_name}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found. Check back soon for new content!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
