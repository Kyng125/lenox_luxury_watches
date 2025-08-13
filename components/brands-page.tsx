"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const brands = [
  {
    id: 1,
    name: "Rolex",
    description: "Swiss luxury watch manufacturer known for precision and prestige",
    logo: "/luxury-watch-brand.png",
    productCount: 24,
    established: 1905,
    country: "Switzerland",
  },
  {
    id: 2,
    name: "Omega",
    description: "Swiss luxury watchmaker with a rich heritage in precision timekeeping",
    logo: "/omega-luxury-watch.png",
    productCount: 18,
    established: 1848,
    country: "Switzerland",
  },
  {
    id: 3,
    name: "Patek Philippe",
    description: "Swiss luxury watch manufacturer renowned for complicated timepieces",
    logo: "/patek-philippe-luxury-watch.png",
    productCount: 12,
    established: 1839,
    country: "Switzerland",
  },
  {
    id: 4,
    name: "Audemars Piguet",
    description: "Swiss manufacturer of luxury mechanical watches and clocks",
    logo: "/placeholder-sq90p.png",
    productCount: 15,
    established: 1875,
    country: "Switzerland",
  },
  {
    id: 5,
    name: "Breitling",
    description: "Swiss luxury watchmaker specializing in chronometers for aviation",
    logo: "/breitling-luxury-watch.png",
    productCount: 21,
    established: 1884,
    country: "Switzerland",
  },
  {
    id: 6,
    name: "Cartier",
    description: "French luxury goods conglomerate renowned for jewelry and watches",
    logo: "/luxury-watch.png",
    productCount: 16,
    established: 1847,
    country: "France",
  },
]

export function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 gold-gradient">Prestigious Brands</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover the world's most prestigious watchmakers, each with their own unique heritage of craftsmanship,
            innovation, and timeless elegance.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="group bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-yellow-600/30"
              >
                <div className="p-8">
                  <div className="flex items-center justify-center h-24 mb-6 bg-white rounded-lg">
                    <Image
                      src={brand.logo || "/placeholder.svg"}
                      alt={`${brand.name} logo`}
                      width={160}
                      height={80}
                      className="object-contain"
                    />
                  </div>

                  <h3 className="font-serif text-2xl font-bold mb-3 gold-gradient">{brand.name}</h3>

                  <p className="text-gray-300 mb-4 line-clamp-3">{brand.description}</p>

                  <div className="space-y-2 text-sm text-gray-400 mb-6">
                    <div className="flex justify-between">
                      <span>Established:</span>
                      <span className="text-white">{brand.established}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Country:</span>
                      <span className="text-white">{brand.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Products:</span>
                      <span className="text-white">{brand.productCount} watches</span>
                    </div>
                  </div>

                  <Link href={`/watches?brand=${brand.name.toLowerCase()}`}>
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold">
                      View Collection
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No brands found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
