"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, User } from "lucide-react"
import { CartIcon } from "@/components/cart-icon"
import { supabase } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

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

  return (
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
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>

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
              <Link href="/watches" className="text-lg font-medium hover:text-primary transition-colors">
                Watches
              </Link>
              <Link href="/brands" className="text-lg font-medium hover:text-primary transition-colors">
                Brands
              </Link>
              <Link href="/collections" className="text-lg font-medium hover:text-primary transition-colors">
                Collections
              </Link>
              <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-lg font-medium hover:text-primary transition-colors">
                Contact
              </Link>
              <div className="flex items-center space-x-4 pt-4 border-t border-border">
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>

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
  )
}
