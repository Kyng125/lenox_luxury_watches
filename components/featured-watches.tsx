"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { ShoppingBag } from "lucide-react"

const featuredWatches = [
  {
    id: "1",
    name: "Submariner Date",
    brand: "Rolex",
    price: 13150,
    salePrice: null,
    image: "/luxury-watch.png",
    badge: "Bestseller",
    sku: "ROL-SUB-001",
  },
  {
    id: "2",
    name: "Speedmaster Professional",
    brand: "Omega",
    price: 6350,
    salePrice: null,
    image: "/omega-speedmaster-moonwatch.png",
    badge: "Heritage",
    sku: "OME-SPE-001",
  },
  {
    id: "3",
    name: "Nautilus 5711/1A",
    brand: "Patek Philippe",
    price: 34890,
    salePrice: null,
    image: "/patek-nautilus-blue.png",
    badge: "Exclusive",
    sku: "PAT-NAU-001",
  },
]

export function FeaturedWatches() {
  const { addItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (watch: (typeof featuredWatches)[0]) => {
    addItem({
      id: watch.id,
      name: watch.name,
      brand: watch.brand,
      price: watch.price,
      salePrice: watch.salePrice,
      image: watch.image,
      sku: watch.sku,
    })
  }

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gold-gradient">Timepieces</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked selections from the world's most prestigious watchmakers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredWatches.map((watch) => (
            <Card
              key={watch.id}
              className="group bg-card border-border hover:border-primary/50 transition-all duration-300 luxury-shadow hover:watch-glow"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={watch.image || "/placeholder.svg"}
                    alt={`${watch.brand} ${watch.name}`}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{watch.badge}</Badge>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-primary font-semibold">{watch.brand}</p>
                    <h3 className="font-serif text-xl font-semibold">{watch.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold gold-gradient">{formatPrice(watch.price)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      <Link href={`/watches/${watch.id}`}>View Details</Link>
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(watch)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 bg-transparent"
          >
            <Link href="/watches">View All Watches</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
