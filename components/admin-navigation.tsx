"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { adminSignOut } from "@/lib/actions"
import { LayoutDashboard, FileText, MessageSquare, Tags, Mail, BarChart3, LogOut, Plus } from "lucide-react"

interface AdminNavigationProps {
  adminName: string
}

export default function AdminNavigation({ adminName }: AdminNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Comments", href: "/admin/comments", icon: MessageSquare },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">G</span>
              </div>
              <span className="font-heading font-bold text-xl text-gray-900">Growth Hub Admin</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                const IconComponent = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-primary"
                        : "text-gray-600 hover:text-emerald-primary hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild size="sm" className="bg-emerald-primary hover:bg-emerald-600 text-white">
              <Link href="/admin/posts/new">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Link>
            </Button>
            <span className="text-gray-600 hidden sm:block">Welcome, {adminName}</span>
            <form action={adminSignOut}>
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
