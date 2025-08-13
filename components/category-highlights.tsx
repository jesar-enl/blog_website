import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Heart, Sparkles, TrendingUp } from "lucide-react"

const categories = [
  {
    name: "Tech Trends for Everyday Life",
    description: "Discover how technology shapes our daily experiences and future possibilities.",
    href: "/category/tech",
    icon: Code,
    color: "bg-blue-50 hover:bg-blue-100",
    iconColor: "text-blue-600",
    borderColor: "hover:border-blue-200",
  },
  {
    name: "Mindfulness Practices for a Balanced Mind",
    description: "Explore wellness strategies and mental health insights for a healthier you.",
    href: "/category/mental-health-wellness",
    icon: Heart,
    color: "bg-emerald-50 hover:bg-emerald-100",
    iconColor: "text-emerald-600",
    borderColor: "hover:border-emerald-200",
  },
  {
    name: "Lifestyle Hacks for a Thriving You",
    description: "Practical tips and inspiration for living your best life every day.",
    href: "/category/lifestyle",
    icon: Sparkles,
    color: "bg-amber-50 hover:bg-amber-100",
    iconColor: "text-amber-600",
    borderColor: "hover:border-amber-200",
  },
  {
    name: "Personal Growth Stories to Inspire",
    description: "Transform your mindset and unlock your potential with proven strategies.",
    href: "/category/personal-growth",
    icon: TrendingUp,
    color: "bg-purple-50 hover:bg-purple-100",
    iconColor: "text-purple-600",
    borderColor: "hover:border-purple-200",
  },
]

export default function CategoryHighlights() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mb-4">Discover Your Interests</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated categories designed to inspire and inform your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.name} href={category.href}>
                <Card
                  className={`${category.color} ${category.borderColor} border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg h-full`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-3 rounded-full bg-white shadow-sm`}>
                        <IconComponent className={`h-8 w-8 ${category.iconColor}`} />
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-gray-900">{category.name}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
