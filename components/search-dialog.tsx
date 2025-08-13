"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock } from "lucide-react"
import Link from "next/link"
import { searchPosts } from "@/lib/user-actions"
import type { Post } from "@/lib/blog"

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Post[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true)
        try {
          const searchResults = await searchPosts(query)
          setResults(searchResults)
        } catch (error) {
          console.error("Search error:", error)
          setResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [query])

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery("")
    setResults([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading">Search Posts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
              autoFocus
            />
          </div>

          {isSearching && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-primary"></div>
                <span>Searching...</span>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`} onClick={handleResultClick}>
                  <div className="p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{post.title}</h3>
                        {post.excerpt && <p className="text-gray-600 text-sm line-clamp-2 mb-2">{post.excerpt}</p>}
                        <div className="flex items-center space-x-3">
                          {post.categories && (
                            <Badge className="text-white text-xs" style={{ backgroundColor: post.categories.color }}>
                              {post.categories.name}
                            </Badge>
                          )}
                          <div className="flex items-center text-gray-500 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.reading_time} min read
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query.length >= 2 && !isSearching && results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts found for "{query}"</p>
            </div>
          )}

          {query.length < 2 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
