import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug, getCommentsByPostId, formatDate } from "@/lib/blog"
import { trackPostView } from "@/lib/user-actions"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import PostInteractions from "@/components/post-interactions"
import CommentForm from "@/components/comment-form"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Eye, ArrowLeft } from "lucide-react"

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found - Growth Hub",
    }
  }

  return {
    title: `${post.title} - Growth Hub`,
    description: post.meta_description || post.excerpt || `Read ${post.title} on Growth Hub`,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || "",
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const comments = await getCommentsByPostId(post.id)

  // Track view (fire and forget)
  trackPostView(post.id).catch(console.error)

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/posts/${post.slug}`

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/posts" className="inline-flex items-center text-emerald-primary hover:text-emerald-600 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Posts
        </Link>

        {/* Post Header */}
        <article className="mb-12">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              {post.categories && (
                <Badge className="text-white" style={{ backgroundColor: post.categories.color }}>
                  {post.categories.name}
                </Badge>
              )}
              <div className="flex items-center text-gray-500 text-sm gap-4">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.reading_time} min read
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.view_count} views
                </span>
              </div>
            </div>

            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && <p className="text-xl text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>}

            <div className="flex items-center justify-between py-6 border-y border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-lg">{post.author_name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author_name}</p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-8">
              <img
                src={post.featured_image_url || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}
            />
          </div>

          <PostInteractions postId={post.id} postTitle={post.title} postUrl={postUrl} commentCount={comments.length} />
        </article>

        {/* Comments Section */}
        {comments.length > 0 && (
          <section className="border-t border-gray-200 pt-12 mb-8">
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-8">Comments ({comments.length})</h2>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{comment.author_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{comment.author_name}</p>
                        <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <CommentForm postId={post.id} />
      </main>

      <Footer />
    </div>
  )
}
