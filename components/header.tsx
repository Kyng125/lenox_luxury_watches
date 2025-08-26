"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Search, User, Heart } from "lucide-react"
import { CartIcon } from "@/components/cart-icon"
import { CurrencySelector } from "@/components/currency-selector"
import { SearchModal } from "@/components/search-modal"
import { useWishlist } from "@/contexts/wishlist-context"
import { supabase } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const { items: wishlistItems } = useWishlist()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600" />
            <span className="font-serif text-2xl font-bold gold-gradient">LENOX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/watches" className="text-sm font-medium hover:text-primary transition-colors">
              Watches
            </Link>
            <Link href="/brands" className="text-sm font-medium hover:text-primary transition-colors">
              Brands
            </Link>
            <Link href="/collections" className="text-sm font-medium hover:text-primary transition-colors">
              Collections
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="relative group">
              <Search className="h-4 w-4" />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ⌘K
              </div>
            </Button>

            <CurrencySelector variant="compact" />

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-4 w-4" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <Link href="/account">
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <CartIcon />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-black border-border">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/watches"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Watches
                </Link>
                <Link
                  href="/brands"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Brands
                </Link>
                <Link
                  href="/collections"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Collections
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>

                <div className="pt-4 border-t border-border">
                  <CurrencySelector variant="full" />
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-border">
                  <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                    <Search className="h-4 w-4" />
                  </Button>

                  <Link href="/wishlist">
                    <Button variant="ghost" size="icon" className="relative">
                      <Heart className="h-4 w-4" />
                      {wishlistItems.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                          {wishlistItems.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  {user ? (
                    <Link href="/account">
                      <Button variant="ghost" size="icon" className="relative">
                        <User className="h-4 w-4" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/login">
                      <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}

                  <CartIcon />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
