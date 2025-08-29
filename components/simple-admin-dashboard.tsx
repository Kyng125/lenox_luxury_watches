"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"

export function SimpleAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem("dashboard-auth")
    if (auth === "authenticated") {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  const handleLogin = () => {
    if (password === "lenox2024") {
      setIsAuthenticated(true)
      setError("")
      localStorage.setItem("dashboard-auth", "authenticated")
      loadData()
    } else {
      setError("Invalid password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("dashboard-auth")
    setProducts([])
    setOrders([])
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // Load products
      const productsRes = await fetch("/api/products")
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      // Load orders
      const ordersRes = await fetch("/api/orders")
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gold">Admin Dashboard</CardTitle>
            <CardDescription className="text-gray-400">Enter password to access admin features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="bg-gray-800 border-gray-700 text-white"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
            <Button onClick={handleLogin} className="w-full bg-gold hover:bg-gold/90 text-black font-semibold">
              Login
            </Button>
            <p className="text-xs text-gray-500 text-center">Demo password: lenox2024</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gold">Lenox Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gold">Loading dashboard data...</div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-gold">₦{totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-white">{totalOrders}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Products</p>
                      <p className="text-2xl font-bold text-white">{totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Orders</p>
                      <p className="text-2xl font-bold text-orange-400">{pendingOrders}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-gold" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="bg-gray-900 border-gray-800">
                <TabsTrigger value="orders" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Products
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gold">Recent Orders</CardTitle>
                    <CardDescription className="text-gray-400">Latest customer orders and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No orders found</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 10).map((order, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-semibold text-white">Order #{order.id || index + 1}</p>
                              <p className="text-sm text-gray-400">
                                {order.customerEmail || "Customer"} • {order.items?.length || 1} items
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gold">₦{(order.total || 0).toLocaleString()}</p>
                              <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                                {order.status || "pending"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gold">Product Inventory</CardTitle>
                    <CardDescription className="text-gray-400">Manage your watch collection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {products.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No products found</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product, index) => (
                          <div key={index} className="bg-gray-800 rounded-lg p-4">
                            <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Eye className="h-8 w-8 text-gray-500" />
                              )}
                            </div>
                            <h3 className="font-semibold text-white mb-1">{product.name || "Unnamed Product"}</h3>
                            <p className="text-gold font-bold">₦{(product.price || 0).toLocaleString()}</p>
                            <p className="text-sm text-gray-400">{product.brand || "Unknown Brand"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
