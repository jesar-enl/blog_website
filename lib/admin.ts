import { createClient } from "@/lib/supabase/server"
import type { Post } from "@/lib/blog"

// Admin-specific database functions

// Get all posts (including drafts) for admin
export async function getAdminPosts() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      categories (
        id,
        name,
        slug,
        color
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching admin posts:", error)
    return []
  }

  return data as Post[]
}

// Create new post
export async function createPost(postData: {
  title: string
  slug: string
  excerpt?: string
  content: string
  category_id?: number
  author_name: string
  is_published: boolean
  is_featured: boolean
  featured_image_url?: string
  meta_title?: string
  meta_description?: string
}) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...postData,
      reading_time: calculateReadingTime(postData.content),
      published_at: postData.is_published ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating post:", error)
    throw new Error("Failed to create post")
  }

  return data as Post
}

// Update post
export async function updatePost(id: number, postData: Partial<Post>) {
  const supabase = createClient()

  const updateData = {
    ...postData,
    updated_at: new Date().toISOString(),
  }

  // If publishing for the first time, set published_at
  if (postData.is_published && !postData.published_at) {
    updateData.published_at = new Date().toISOString()
  }

  // Recalculate reading time if content changed
  if (postData.content) {
    updateData.reading_time = calculateReadingTime(postData.content)
  }

  const { data, error } = await supabase.from("posts").update(updateData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating post:", error)
    throw new Error("Failed to update post")
  }

  return data as Post
}

// Delete post
export async function deletePost(id: number) {
  const supabase = createClient()

  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting post:", error)
    throw new Error("Failed to delete post")
  }
}

// Get all comments for admin (including unapproved)
export async function getAdminComments() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      posts (
        id,
        title,
        slug
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching admin comments:", error)
    return []
  }

  return data
}

// Approve/reject comment
export async function updateCommentStatus(id: number, isApproved: boolean) {
  const supabase = createClient()

  const { error } = await supabase.from("comments").update({ is_approved: isApproved }).eq("id", id)

  if (error) {
    console.error("Error updating comment status:", error)
    throw new Error("Failed to update comment status")
  }
}

// Delete comment
export async function deleteComment(id: number) {
  const supabase = createClient()

  const { error } = await supabase.from("comments").delete().eq("id", id)

  if (error) {
    console.error("Error deleting comment:", error)
    throw new Error("Failed to delete comment")
  }
}

// Get newsletter subscribers
export async function getNewsletterSubscribers() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("newsletter_subscriptions")
    .select("*")
    .order("subscribed_at", { ascending: false })

  if (error) {
    console.error("Error fetching newsletter subscribers:", error)
    return []
  }

  return data
}

// Get admin stats
export async function getAdminStats() {
  const supabase = createClient()

  const [
    { data: publishedPosts },
    { data: draftPosts },
    { data: pendingComments },
    { data: subscribers },
    { data: totalViews },
  ] = await Promise.all([
    supabase.from("posts").select("id").eq("is_published", true),
    supabase.from("posts").select("id").eq("is_published", false),
    supabase.from("comments").select("id").eq("is_approved", false),
    supabase.from("newsletter_subscriptions").select("id").eq("is_active", true),
    supabase.from("posts").select("view_count").eq("is_published", true),
  ])

  const totalViewCount = totalViews?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0

  return {
    publishedPosts: publishedPosts?.length || 0,
    draftPosts: draftPosts?.length || 0,
    pendingComments: pendingComments?.length || 0,
    subscribers: subscribers?.length || 0,
    totalViews: totalViewCount,
  }
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
