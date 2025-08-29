import type { Metadata } from "next"
import { ContactPage } from "@/components/contact-page"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Contact Us | Lenox Luxury Watches",
  description:
    "Get in touch with Lenox Luxury Watches. Visit our showroom, call us, or send us a message for expert advice on luxury timepieces.",
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-black">
      <ContactPage />
      <Footer />
    </div>
  )
}
