"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share2, MessageCircle } from "lucide-react"
import { togglePostLike, getPostLikes } from "@/lib/user-actions"

interface PostInteractionsProps {
  postId: number
  postTitle: string
  postUrl: string
  commentCount: number
}

export default function PostInteractions({ postId, postTitle, postUrl, commentCount }: PostInteractionsProps) {
  const [likes, setLikes] = useState({ count: 0, userLiked: false })
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    // Get user IP and user agent for like tracking
    const userAgent = navigator.userAgent

    // Fetch initial like data
    fetch("/api/get-client-ip")
      .then((res) => res.json())
      .then((data) => {
        getPostLikes(postId, data.ip, userAgent).then(setLikes)
      })
      .catch(() => {
        // Fallback without IP tracking
        getPostLikes(postId).then(setLikes)
      })
  }, [postId])

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)

    try {
      const response = await fetch("/api/get-client-ip")
      const { ip } = await response.json()
      const userAgent = navigator.userAgent

      const result = await togglePostLike(postId, ip, userAgent)

      if (result.success) {
        setLikes((prev) => ({
          count: result.liked ? prev.count + 1 : prev.count - 1,
          userLiked: result.liked,
        }))
      }
    } catch (error) {
      console.error("Like error:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          url: postUrl,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(postUrl)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(postUrl)
    }
  }

  return (
    <div className="flex items-center space-x-4 py-6 border-y border-gray-200">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={isLiking}
        className={`flex items-center space-x-2 ${likes.userLiked ? "text-red-600 border-red-200 bg-red-50" : ""}`}
      >
        <Heart className={`h-4 w-4 ${likes.userLiked ? "fill-current" : ""}`} />
        <span>{likes.count}</span>
      </Button>

      <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
        <MessageCircle className="h-4 w-4" />
        <span>{commentCount}</span>
      </Button>

      <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center space-x-2 bg-transparent">
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>
    </div>
  )
}
