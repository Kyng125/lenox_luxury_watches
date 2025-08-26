"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, AlertCircle, Plus, Eye } from "lucide-react"
import Link from "next/link"
import { useCurrency } from "@/contexts/currency-context"

// Mock data - in production, this would come from your database
const dashboardStats = {
  totalProducts: 47,
  totalOrders: 156,
  totalRevenue: 2847650,
  totalCustomers: 89,
  lowStockProducts: 5,
  pendingOrders: 12,
  monthlyGrowth: 15.3,
  topSellingProducts: [
    { id: "prod_submariner", name: "Submariner Date", brand: "Rolex", sales: 23, revenue: 302450 },
    { id: "prod_speedmaster", name: "Speedmaster Professional", brand: "Omega", sales: 18, revenue: 114300 },
    { id: "prod_nautilus", name: "Nautilus 5711/1A", brand: "Patek Philippe", sales: 8, revenue: 279120 },
  ],
  recentOrders: [
    { id: "ord_001", customer: "John Smith", total: 13150, status: "pending", date: "2024-01-15" },
    { id: "ord_002", customer: "Sarah Johnson", total: 6350, status: "confirmed", date: "2024-01-15" },
    { id: "ord_003", customer: "Michael Chen", total: 34890, status: "shipped", date: "2024-01-14" },
  ],
}

export function AdminDashboard() {
  const { formatPrice, convertPrice } = useCurrency()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your luxury watch inventory and orders</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-primary text-primary bg-transparent">
            <Link href="/admin/analytics">
              <Eye className="h-4 w-4 mr-2" />
              View Analytics
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">{dashboardStats.lowStockProducts} low stock</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-500">{dashboardStats.pendingOrders} pending</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(convertPrice(dashboardStats.totalRevenue))}</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{dashboardStats.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Top Selling Products</CardTitle>
            <CardDescription>Best performing watches this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{product.brand}</p>
                      <p className="text-sm text-muted-foreground">{product.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{product.sales} sold</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(convertPrice(product.revenue))}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold text-sm">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatPrice(convertPrice(order.total))}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          order.status === "pending"
                            ? "secondary"
                            : order.status === "confirmed"
                              ? "default"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(order.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full mt-4 border-primary text-primary bg-transparent">
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 border-border bg-transparent">
              <Link href="/admin/products" className="flex flex-col items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                <span className="font-semibold">Manage Products</span>
                <span className="text-xs text-muted-foreground">Add, edit, or remove watches</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 border-border bg-transparent">
              <Link href="/admin/orders" className="flex flex-col items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <span className="font-semibold">View Orders</span>
                <span className="text-xs text-muted-foreground">Process customer orders</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 border-border bg-transparent">
              <Link href="/admin/analytics" className="flex flex-col items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="font-semibold">Analytics</span>
                <span className="text-xs text-muted-foreground">View business insights</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 border-border bg-transparent">
              <Link href="/admin/inventory" className="flex flex-col items-center gap-2">
                <AlertCircle className="h-6 w-6 text-primary" />
                <span className="font-semibold">Check Inventory</span>
                <span className="text-xs text-muted-foreground">Monitor stock levels</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
