"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export function CartIcon() {
  const { state } = useCart()

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className="relative">
        <ShoppingBag className="h-5 w-5" />
        {state.itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
            {state.itemCount > 99 ? "99+" : state.itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
