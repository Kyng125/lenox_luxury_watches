import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCatalog } from "@/components/product-catalog"
import { Suspense } from "react"

export default function WatchesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gold-gradient">Collection</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover exceptional timepieces from the world's most prestigious watchmakers
            </p>
          </div>
          <Suspense fallback={<div className="text-center py-12">Loading watches...</div>}>
            <ProductCatalog />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
