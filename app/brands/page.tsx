import type { Metadata } from "next"
import { BrandsPage } from "@/components/brands-page"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Luxury Watch Brands | Lenox Luxury Watches",
  description:
    "Discover our curated collection of the world's most prestigious watch brands including Rolex, Omega, Patek Philippe, and more.",
}

export default function Brands() {
  return (
    <div className="min-h-screen bg-black">
      <BrandsPage />
      <Footer />
    </div>
  )
}
