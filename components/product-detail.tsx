"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingBag, Share2, Shield, Truck, RotateCcw, Star } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"

interface Watch {
  id: string
  name: string
  brand: string
  price: number
  salePrice?: number | null
  sku: string
  stock: number
  category: string
  isFeatured: boolean
  description: string
  longDescription: string
  images: Array<{
    url: string
    alt: string
    isPrimary: boolean
  }>
  specifications: Array<{
    name: string
    value: string
  }>
}

interface ProductDetailProps {
  watch: Watch
}

export function ProductDetail({ watch }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    addItem({
      id: watch.id,
      name: watch.name,
      brand: watch.brand,
      price: watch.price,
      salePrice: watch.salePrice,
      image: watch.images[0]?.url || "/placeholder.svg",
      sku: watch.sku,
    })
    toast({
      title: "Added to Cart",
      description: `${watch.brand} ${watch.name} has been added to your cart.`,
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${watch.brand} ${watch.name} ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${watch.brand} ${watch.name}`,
        text: watch.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Product link has been copied to your clipboard.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <a href="/" className="hover:text-primary transition-colors">
          Home
        </a>
        <span>/</span>
        <a href="/watches" className="hover:text-primary transition-colors">
          Watches
        </a>
        <span>/</span>
        <span className="text-foreground">{watch.brand}</span>
        <span>/</span>
        <span className="text-foreground">{watch.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
            <img
              src={watch.images[selectedImageIndex]?.url || "/placeholder.svg"}
              alt={watch.images[selectedImageIndex]?.alt}
              className="w-full h-full object-cover"
            />
            {watch.isFeatured && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
            )}
            {watch.salePrice && <Badge className="absolute top-4 right-4 bg-red-600 text-white">Sale</Badge>}
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {watch.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index ? "border-primary" : "border-border hover:border-primary/50"
                }`}
              >
                <img src={image.url || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-primary font-semibold mb-2">{watch.brand}</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">{watch.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.9) • 127 reviews</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">{watch.description}</p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {watch.salePrice ? (
                <>
                  <span className="text-3xl font-bold gold-gradient">{formatPrice(watch.salePrice)}</span>
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(watch.price)}</span>
                  <Badge className="bg-red-600 text-white">Save {formatPrice(watch.price - watch.salePrice)}</Badge>
                </>
              ) : (
                <span className="text-3xl font-bold gold-gradient">{formatPrice(watch.price)}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">SKU: {watch.sku}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${watch.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <span className={watch.stock > 0 ? "text-green-400" : "text-red-400"}>
              {watch.stock > 0 ? `${watch.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={watch.stock === 0}
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleWishlist}
                variant="outline"
                size="lg"
                className={`border-border ${isWishlisted ? "bg-primary text-primary-foreground" : "bg-transparent"}`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button onClick={handleShare} variant="outline" size="lg" className="border-border bg-transparent">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="lg" className="w-full border-primary text-primary bg-transparent">
              Request Authentication Certificate
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Authenticity</p>
                <p className="text-xs text-muted-foreground">Guaranteed genuine</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Insured delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">Full refund policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-serif text-xl font-semibold mb-4">About This Watch</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{watch.longDescription}</p>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Premium Swiss craftsmanship</li>
                    <li>• Precision mechanical movement</li>
                    <li>• Scratch-resistant sapphire crystal</li>
                    <li>• Water-resistant construction</li>
                    <li>• Luxury presentation box included</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">What's Included</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Original watch with bracelet/strap</li>
                    <li>• Manufacturer warranty card</li>
                    <li>• Instruction manual</li>
                    <li>• Luxury presentation box</li>
                    <li>• Certificate of authenticity</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-serif text-xl font-semibold mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {watch.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                  >
                    <span className="font-medium">{spec.name}</span>
                    <span className="text-muted-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-semibold">Customer Reviews</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.9 out of 5 (127 reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Sample Reviews */}
                <div className="border-b border-border pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="font-semibold text-sm">James Wilson</span>
                    <span className="text-xs text-muted-foreground">Verified Purchase</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Absolutely stunning timepiece. The craftsmanship is exceptional and it feels incredibly solid on
                    the wrist. Worth every penny."
                  </p>
                  <span className="text-xs text-muted-foreground">2 weeks ago</span>
                </div>

                <div className="border-b border-border pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="font-semibold text-sm">Michael Chen</span>
                    <span className="text-xs text-muted-foreground">Verified Purchase</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Fast shipping, excellent packaging, and the watch exceeded my expectations. Lenox provides
                    outstanding service."
                  </p>
                  <span className="text-xs text-muted-foreground">1 month ago</span>
                </div>

                <Button variant="outline" className="w-full border-primary text-primary bg-transparent">
                  View All Reviews
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
