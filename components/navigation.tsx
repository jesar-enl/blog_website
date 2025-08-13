"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import SearchDialog from "@/components/search-dialog"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const categories = [
    { name: "Tech", href: "/category/tech", color: "text-blue-600" },
    { name: "Mental Health & Wellness", href: "/category/mental-health-wellness", color: "text-emerald-accent" },
    { name: "Lifestyle", href: "/category/lifestyle", color: "text-amber-600" },
    { name: "Personal Growth", href: "/category/personal-growth", color: "text-purple-600" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">G</span>
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">Growth Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`${category.color} hover:text-emerald-primary transition-colors duration-200 font-medium`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <SearchDialog />

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`${category.color} hover:text-emerald-primary transition-colors duration-200 font-medium py-2`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
