import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-emerald-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-6">
            Explore Your Path to <span className="text-emerald-primary">Growth</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
            Dive into insights on technology, wellness, lifestyle, and personal development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-emerald-primary hover:bg-emerald-600 text-white px-8 py-3 text-lg">
              <Link href="/posts">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="px-8 py-3 text-lg bg-transparent">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-100 rounded-full opacity-50"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-100 rounded-full opacity-40"></div>
    </section>
  )
}
