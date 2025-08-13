import Link from "next/link"
import { Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Categories: [
      { name: "Tech", href: "/category/tech" },
      { name: "Mental Health & Wellness", href: "/category/mental-health-wellness" },
      { name: "Lifestyle", href: "/category/lifestyle" },
      { name: "Personal Growth", href: "/category/personal-growth" },
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
    Resources: [
      { name: "All Posts", href: "/posts" },
      { name: "Newsletter", href: "#newsletter" },
      { name: "RSS Feed", href: "/rss.xml" },
      { name: "Sitemap", href: "/sitemap.xml" },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">G</span>
              </div>
              <span className="font-heading font-bold text-xl">Growth Hub</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your trusted companion for insights on technology, wellness, lifestyle, and personal development.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading font-semibold text-lg mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-accent transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {currentYear} Growth Hub. All rights reserved.</p>
            <p className="text-gray-400 text-sm flex items-center mt-4 sm:mt-0">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for growth-minded individuals
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
