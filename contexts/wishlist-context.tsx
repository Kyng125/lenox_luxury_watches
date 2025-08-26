"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

interface WishlistItem {
  id: string
  name: string
  brand: string
  price: number
  salePrice?: number | null
  image: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
      }
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items, mounted])

  const addToWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((wishlistItem) => wishlistItem.id === item.id)) {
        return prev
      }
      toast({
        title: "Added to Wishlist",
        description: `${item.brand} ${item.name} has been added to your wishlist.`,
      })
      return [...prev, item]
    })
  }

  const removeFromWishlist = (id: string) => {
    setItems((prev) => {
      const item = prev.find((item) => item.id === id)
      if (item) {
        toast({
          title: "Removed from Wishlist",
          description: `${item.brand} ${item.name} has been removed from your wishlist.`,
        })
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setItems([])
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    })
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
