import type { Metadata } from "next"
import Link from "next/link"
import { getCategoryBySlug, getPostsByCategory, formatDate } from "@/lib/blog"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, ArrowLeft } from "lucide-react"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const category = await getCategoryBySlug(params.slug)

    if (!category) {
      return {
        title: "Category Not Found - Growth Hub",
      }
    }

    return {
      title: `${category.name} - Growth Hub`,
      description: category.description || `Explore articles in ${category.name} on Growth Hub`,
    }
  } catch (error) {
    return {
      title: "Category - Growth Hub",
      description: "Blog category page",
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let category = null
  let posts: any[] = []
  let hasError = false

  try {
    category = await getCategoryBySlug(params.slug)
    if (category) {
      posts = await getPostsByCategory(params.slug)
    }
  } catch (error) {
    hasError = true
  }

  if (hasError || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center text-emerald-primary hover:text-emerald-600 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <h1 className="font-heading font-bold text-3xl text-gray-900 mb-4">
                {hasError ? "Database Setup Required" : "Category Not Found"}
              </h1>
              {hasError ? (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-6">
                    The database tables haven't been created yet. Please run the setup scripts to initialize the blog
                    database.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <p className="font-medium text-gray-900 mb-2">Run these scripts in order:</p>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                      <li>scripts/01-create-categories.sql</li>
                      <li>scripts/02-create-posts.sql</li>
                      <li>scripts/03-create-comments.sql</li>
                      <li>scripts/04-create-likes.sql</li>
                      <li>scripts/05-create-newsletter.sql</li>
                      <li>scripts/06-create-admin-users.sql</li>
                      <li>scripts/07-create-functions.sql</li>
                      <li>scripts/08-seed-sample-data.sql</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  The category "{params.slug}" doesn't exist. Please check the URL or browse our available categories.
                </p>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/posts" className="inline-flex items-center text-emerald-primary hover:text-emerald-600 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Posts
        </Link>

        {/* Category Header */}
        <div className="text-center mb-12">
          <Badge className="text-white mb-4 px-6 py-2 text-lg" style={{ backgroundColor: category.color }}>
            {category.name}
          </Badge>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-gray-900 mb-4">{category.name}</h1>
          {category.description && <p className="text-xl text-gray-600 max-w-2xl mx-auto">{category.description}</p>}
          <p className="text-gray-500 mt-4">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
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

        {posts.length === 0 && !hasError && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No posts found in this category yet. Check back soon for new content!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
