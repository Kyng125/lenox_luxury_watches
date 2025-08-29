"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useCurrency } from "@/contexts/currency-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { ShoppingBag, Heart } from "lucide-react"

interface FeaturedWatch {
  id: string
  name: string
  price: number
  sale_price?: number
  sku: string
  brands: { name: string }
  product_images: Array<{ url: string; is_primary: boolean }>
}

export function FeaturedWatches() {
  const { addItem } = useCart()
  const { formatPrice, convertPrice } = useCurrency()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [featuredWatches, setFeaturedWatches] = useState<FeaturedWatch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFeaturedWatches()

    const handleFeaturedUpdate = () => {
      loadFeaturedWatches()
    }

    window.addEventListener("featuredProductsUpdated", handleFeaturedUpdate)
    return () => window.removeEventListener("featuredProductsUpdated", handleFeaturedUpdate)
  }, [])

  const loadFeaturedWatches = async () => {
    try {
      const response = await fetch("/api/products?featured=true&limit=3")
      if (response.ok) {
        const data = await response.json()
        setFeaturedWatches(data.products || [])
      }
    } catch (error) {
      console.error("Error loading featured watches:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (watch: FeaturedWatch) => {
    const primaryImage = watch.product_images?.find((img) => img.is_primary)?.url || watch.product_images?.[0]?.url

    addItem({
      id: watch.id,
      name: watch.name,
      brand: watch.brands?.name || "",
      price: watch.price,
      salePrice: watch.sale_price || null,
      image: primaryImage || "/placeholder.svg",
      sku: watch.sku,
    })
  }

  const handleWishlistToggle = (watch: FeaturedWatch) => {
    const primaryImage = watch.product_images?.find((img) => img.is_primary)?.url || watch.product_images?.[0]?.url

    if (isInWishlist(watch.id)) {
      removeFromWishlist(watch.id)
    } else {
      addToWishlist({
        id: watch.id,
        name: watch.name,
        brand: watch.brands?.name || "",
        price: watch.price,
        salePrice: watch.sale_price || null,
        image: primaryImage || "/placeholder.svg",
      })
    }
  }

  if (isLoading) {
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
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-card border-border animate-pulse">
                <CardContent className="p-0">
                  <div className="w-full h-80 bg-gray-700 rounded-t-lg" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-1/3" />
                    <div className="h-6 bg-gray-700 rounded w-2/3" />
                    <div className="h-8 bg-gray-700 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
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
          {featuredWatches.map((watch) => {
            const primaryImage =
              watch.product_images?.find((img) => img.is_primary)?.url || watch.product_images?.[0]?.url

            return (
              <Card
                key={watch.id}
                className="group bg-card border-border hover:border-primary/50 transition-all duration-300 luxury-shadow hover:watch-glow"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={primaryImage || "/placeholder.svg"}
                      alt={`${watch.brands?.name} ${watch.name}`}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant={isInWishlist(watch.id) ? "default" : "secondary"}
                        className="h-8 w-8"
                        onClick={() => handleWishlistToggle(watch)}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(watch.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-primary font-semibold">{watch.brands?.name}</p>
                      <h3 className="font-serif text-xl font-semibold">{watch.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      {watch.sale_price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold gold-gradient">
                            {formatPrice(convertPrice(watch.sale_price))}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(convertPrice(watch.price))}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold gold-gradient">
                          {formatPrice(convertPrice(watch.price))}
                        </span>
                      )}
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
            )
          })}
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
