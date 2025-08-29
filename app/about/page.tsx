import type { Metadata } from "next"
import { AboutPage } from "@/components/about-page"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About Us | Lenox Luxury Watches",
  description:
    "Learn about Lenox Luxury Watches - your premier destination for the world's finest timepieces with over 50 years of horological expertise.",
}

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <AboutPage />
      <Footer />
    </div>
  )
}
