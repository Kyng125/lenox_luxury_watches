"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, Crown } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        })
        router.push("/admin/login")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-serif text-xl font-bold">Lenox Admin</h1>
                <p className="text-xs text-muted-foreground">Luxury Watches</p>
              </div>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-muted transition-colors"
                      >
                        <item.icon className="h-6 w-6 shrink-0 text-primary" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start gap-x-3 text-sm font-semibold"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  Sign out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-card">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-serif text-xl font-bold">Lenox Admin</h1>
                <p className="text-xs text-muted-foreground">Luxury Watches</p>
              </div>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col mt-8">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-muted transition-colors"
                      >
                        <item.icon className="h-6 w-6 shrink-0 text-primary" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start gap-x-3 text-sm font-semibold"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  Sign out
                </Button>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
