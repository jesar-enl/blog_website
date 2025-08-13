import { createClient } from "@/lib/supabase/server"

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  category_id: number | null
  author_name: string
  author_email: string | null
  is_published: boolean
  is_featured: boolean
  meta_title: string | null
  meta_description: string | null
  reading_time: number
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
  categories?: Category
}

export interface Comment {
  id: number
  post_id: number
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  parent_id: number | null
  created_at: string
  updated_at: string
}

// Get all published posts
export async function getPosts(limit?: number) {
  const supabase = createClient()

  try {
    let query = supabase
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
      .order("published_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
        console.warn("Database tables not yet created. Please run the SQL scripts first.")
        return []
      }
      console.error("Error fetching posts:", error)
      return []
    }

    return data as Post[]
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

// Get featured posts
export async function getFeaturedPosts() {
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
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(6)

    if (error) {
      if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
        console.warn("Database tables not yet created. Please run the SQL scripts first.")
        return []
      }
      console.error("Error fetching featured posts:", error)
      return []
    }

    return data as Post[]
  } catch (error) {
    console.error("Error fetching featured posts:", error)
    return []
  }
}

// Get single post by slug
export async function getPostBySlug(slug: string) {
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
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error) {
      if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
        console.warn("Database tables not yet created. Please run the SQL scripts first.")
        return null
      }
      console.error("Error fetching post:", error)
      return null
    }

    return data as Post
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string, limit?: number) {
  const supabase = createClient()

  try {
    let query = supabase
      .from("posts")
      .select(`
        *,
        categories!inner (
          id,
          name,
          slug,
          color
        )
      `)
      .eq("is_published", true)
      .eq("categories.slug", categorySlug)
      .order("published_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
        console.warn("Database tables not yet created. Please run the SQL scripts first.")
        return []
      }
      console.error("Error fetching posts by category:", error)
      return []
    }

    return data as Post[]
  } catch (error) {
    console.error("Error fetching posts by category:", error)
    return []
  }
}

// Get all categories
export async function getCategories() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
        console.warn("Database tables not yet created. Please run the SQL scripts first.")
        return []
      }
      console.error("Error fetching categories:", error)
      return []
    }

    return data as Category[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

    if (error) {
      if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
        console.warn("Database tables not yet created. Please run the SQL scripts first.")
        return null
      }
      console.error("Error fetching category:", error)
      return null
    }

    return data as Category
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

// Get approved comments for a post
export async function getCommentsByPostId(postId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .eq("is_approved", true)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching comments:", error)
    return []
  }

  return data as Comment[]
}

// Increment view count for a post
export async function incrementViewCount(postId: number) {
  const supabase = createClient()

  const { error } = await supabase.rpc("increment_view_count", { post_id: postId })

  if (error) {
    console.error("Error incrementing view count:", error)
  }
}

// Format date for display
export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Calculate reading time
export function calculateReadingTime(content: string) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const readingTime = Math.ceil(words / wordsPerMinute)
  return readingTime
}
