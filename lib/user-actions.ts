"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Newsletter subscription
export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const name = formData.get("name")

  if (!email) {
    return { error: "Email is required" }
  }

  const supabase = createClient()

  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from("newsletter_subscriptions")
      .select("*")
      .eq("email", email.toString())
      .single()

    if (existing) {
      if (existing.is_active) {
        return { error: "You're already subscribed to our newsletter!" }
      } else {
        // Reactivate subscription
        const { error } = await supabase
          .from("newsletter_subscriptions")
          .update({
            is_active: true,
            is_confirmed: true,
            unsubscribed_at: null,
          })
          .eq("email", email.toString())

        if (error) {
          return { error: "Failed to reactivate subscription. Please try again." }
        }

        return { success: "Welcome back! You've been resubscribed to our newsletter." }
      }
    }

    // Create new subscription
    const { error } = await supabase.from("newsletter_subscriptions").insert({
      email: email.toString(),
      name: name?.toString() || null,
      is_active: true,
      is_confirmed: true, // Auto-confirm for simplicity
    })

    if (error) {
      console.error("Newsletter subscription error:", error)
      return { error: "Failed to subscribe. Please try again." }
    }

    return { success: "Thank you for subscribing! You'll receive our latest updates." }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Add comment to post
export async function addComment(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const postId = formData.get("postId")
  const authorName = formData.get("authorName")
  const authorEmail = formData.get("authorEmail")
  const content = formData.get("content")

  if (!postId || !authorName || !authorEmail || !content) {
    return { error: "All fields are required" }
  }

  const supabase = createClient()

  try {
    const { error } = await supabase.from("comments").insert({
      post_id: Number.parseInt(postId.toString()),
      author_name: authorName.toString(),
      author_email: authorEmail.toString(),
      content: content.toString(),
      is_approved: false, // Comments need approval
    })

    if (error) {
      console.error("Comment submission error:", error)
      return { error: "Failed to submit comment. Please try again." }
    }

    revalidatePath(`/posts/[slug]`, "page")
    return { success: "Thank you! Your comment has been submitted and is awaiting approval." }
  } catch (error) {
    console.error("Comment submission error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Like/unlike post
export async function togglePostLike(postId: number, userIp: string, userAgent: string) {
  const supabase = createClient()

  try {
    // Check if user already liked this post
    const { data: existingLike } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_ip", userIp)
      .eq("user_agent", userAgent)
      .single()

    if (existingLike) {
      // Unlike - remove the like
      const { error } = await supabase.from("likes").delete().eq("id", existingLike.id)

      if (error) {
        return { error: "Failed to unlike post" }
      }

      revalidatePath(`/posts/[slug]`, "page")
      return { success: "Post unliked", liked: false }
    } else {
      // Like - add new like
      const { error } = await supabase.from("likes").insert({
        post_id: postId,
        user_ip: userIp,
        user_agent: userAgent,
      })

      if (error) {
        return { error: "Failed to like post" }
      }

      revalidatePath(`/posts/[slug]`, "page")
      return { success: "Post liked", liked: true }
    }
  } catch (error) {
    console.error("Like toggle error:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Get like count and user like status
export async function getPostLikes(postId: number, userIp?: string, userAgent?: string) {
  const supabase = createClient()

  try {
    // Get total like count
    const { data: likes, error: countError } = await supabase.from("likes").select("id").eq("post_id", postId)

    if (countError) {
      return { count: 0, userLiked: false }
    }

    let userLiked = false

    // Check if current user liked this post
    if (userIp && userAgent) {
      const { data: userLike } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_ip", userIp)
        .eq("user_agent", userAgent)
        .single()

      userLiked = !!userLike
    }

    return { count: likes?.length || 0, userLiked }
  } catch (error) {
    console.error("Get likes error:", error)
    return { count: 0, userLiked: false }
  }
}

// Track post view
export async function trackPostView(postId: number) {
  const supabase = createClient()

  try {
    const { error } = await supabase.rpc("increment_view_count", { post_id: postId })

    if (error) {
      console.error("View tracking error:", error)
    }
  } catch (error) {
    console.error("View tracking error:", error)
  }
}

// Search posts
export async function searchPosts(query: string) {
  if (!query || query.trim().length < 2) {
    return []
  }

  const supabase = createClient()

  try {
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
      .eq("is_published", true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order("published_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Search error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Search error:", error)
    return []
  }
}
