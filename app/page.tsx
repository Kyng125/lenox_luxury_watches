import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedWatches } from "@/components/featured-watches"
import { LuxuryBrands } from "@/components/luxury-brands"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <FeaturedWatches />
        <LuxuryBrands />
      </main>
      <Footer />
    </div>
  )
}
