import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import CategoryHighlights from "@/components/category-highlights"
import FeaturedPosts from "@/components/featured-posts"
import NewsletterSignup from "@/components/newsletter-signup"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CategoryHighlights />
      <FeaturedPosts />
      <NewsletterSignup />
      <Footer />
    </main>
  )
}
