"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { useCurrency } from "@/contexts/currency-context"
import Link from "next/link"

export function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const { formatPrice, convertPrice } = useCurrency()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      salePrice: item.salePrice,
      image: item.image,
      sku: `SKU-${item.id}`,
    })
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-serif text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-6">Save your favorite luxury timepieces for later</p>
          <Link href="/watches">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Browse Watches
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">{items.length} saved watches</p>
        </div>
        <Button
          variant="outline"
          onClick={clearWishlist}
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="group bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={`${item.brand} ${item.name}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <p className="text-sm text-primary font-semibold">{item.brand}</p>
                  <h3 className="font-serif text-lg font-semibold line-clamp-1">{item.name}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.salePrice ? (
                      <>
                        <span className="text-lg font-bold gold-gradient">
                          {formatPrice(convertPrice(item.salePrice))}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(convertPrice(item.price))}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold gold-gradient">{formatPrice(convertPrice(item.price))}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      <Link href={`/watches/${item.id}`}>View</Link>
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleAddToCart(item)}>
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
