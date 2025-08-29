import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedWatches } from "@/components/featured-watches"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <FeaturedWatches />
      </main>
      <Footer />
    </div>
  )
}
