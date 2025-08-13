"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const shipping = state.total > 1000 ? 0 : 50
  const tax = state.total * 0.08
  const finalTotal = state.total + shipping + tax

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Discover our exquisite collection of luxury timepieces</p>
          <Link href="/watches">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Shop Watches
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/watches">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <h1 className="font-serif text-3xl font-bold">Shopping Cart</h1>
        <Badge variant="secondary">{state.itemCount} items</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={`${item.brand} ${item.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-primary font-semibold">{item.brand}</p>
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        {item.salePrice ? (
                          <div className="space-y-1">
                            <p className="font-bold gold-gradient">{formatPrice(item.salePrice * item.quantity)}</p>
                            <p className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold gold-gradient">{formatPrice(item.price * item.quantity)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-destructive border-destructive bg-transparent"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(state.total)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? <span className="text-green-400">Free</span> : formatPrice(shipping)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="gold-gradient">{formatPrice(finalTotal)}</span>
              </div>

              {state.total < 1000 && (
                <p className="text-sm text-muted-foreground">
                  Add {formatPrice(1000 - state.total)} more for free shipping
                </p>
              )}
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-background border-border"
                  />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/checkout">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Proceed to Checkout
            </Button>
          </Link>

          {/* Security Features */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Secure checkout with SSL encryption</p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>• 30-day returns</span>
              <span>• Authenticity guaranteed</span>
              <span>• Insured shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
