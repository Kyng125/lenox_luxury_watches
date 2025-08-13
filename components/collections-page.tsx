"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

const collections = [
  {
    id: 1,
    name: "Dress Watches",
    description: "Elegant timepieces perfect for formal occasions and sophisticated style",
    image: "/placeholder-oymne.png",
    productCount: 24,
    priceRange: "$5,000 - $50,000",
    features: ["Ultra-thin cases", "Precious metals", "Leather straps", "Classic designs"],
  },
  {
    id: 2,
    name: "Sport Watches",
    description: "Robust timepieces designed for active lifestyles and athletic pursuits",
    image: "/luxury-sport-watch-collection.png",
    productCount: 32,
    priceRange: "$3,000 - $25,000",
    features: ["Shock resistance", "Water resistance", "Durable materials", "Precision timing"],
  },
  {
    id: 3,
    name: "Diving Watches",
    description: "Professional diving instruments built for underwater exploration",
    image: "/luxury-diving-watch-collection.png",
    productCount: 18,
    priceRange: "$4,000 - $30,000",
    features: ["300m+ water resistance", "Rotating bezels", "Luminous markers", "Helium escape valves"],
  },
  {
    id: 4,
    name: "Chronographs",
    description: "Precision timepieces with stopwatch functionality for timing events",
    image: "/placeholder-uf8op.png",
    productCount: 28,
    priceRange: "$6,000 - $40,000",
    features: ["Stopwatch function", "Multiple subdials", "Tachymeter scales", "Racing heritage"],
  },
  {
    id: 5,
    name: "GMT Watches",
    description: "Multi-timezone watches perfect for world travelers and pilots",
    image: "/placeholder.svg?height=400&width=600",
    productCount: 16,
    priceRange: "$8,000 - $35,000",
    features: ["Dual time zones", "24-hour bezels", "GMT hands", "Travel complications"],
  },
  {
    id: 6,
    name: "Limited Editions",
    description: "Exclusive timepieces with limited production runs and unique designs",
    image: "/placeholder.svg?height=400&width=600",
    productCount: 12,
    priceRange: "$15,000 - $100,000+",
    features: ["Limited production", "Unique designs", "Collector value", "Certificate of authenticity"],
  },
]

export function CollectionsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 gold-gradient">Curated Collections</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our carefully curated watch collections, each representing a different aspect of horological
            excellence and craftsmanship.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="group bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-yellow-600/30"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="font-serif text-2xl font-bold mb-1 gold-gradient">{collection.name}</h3>
                        <p className="text-sm text-gray-300">{collection.productCount} timepieces</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-yellow-400 font-semibold">{collection.priceRange}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-300 mb-4">{collection.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-yellow-400 mb-2">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {collection.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-300">
                          <div className="w-1 h-1 bg-yellow-400 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={`/watches?collection=${collection.name.toLowerCase().replace(" ", "-")}`}>
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold">
                      Explore Collection
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
