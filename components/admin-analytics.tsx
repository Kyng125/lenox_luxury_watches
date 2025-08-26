"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Download, BarChart3 } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  orders: {
    current: number
    previous: number
    growth: number
  }
  customers: {
    current: number
    previous: number
    growth: number
  }
  avgOrderValue: {
    current: number
    previous: number
    growth: number
  }
  topProducts: Array<{
    name: string
    brand: string
    sales: number
    revenue: number
  }>
  salesByCountry: Array<{
    country: string
    sales: number
    revenue: number
  }>
  revenueByMonth: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

// Mock analytics data
const mockAnalytics: AnalyticsData = {
  revenue: { current: 2847650, previous: 2456780, growth: 15.9 },
  orders: { current: 156, previous: 142, growth: 9.9 },
  customers: { current: 89, previous: 76, growth: 17.1 },
  avgOrderValue: { current: 18254, previous: 17304, growth: 5.5 },
  topProducts: [
    { name: "Submariner Date", brand: "Rolex", sales: 23, revenue: 302450 },
    { name: "Nautilus 5711/1A", brand: "Patek Philippe", sales: 8, revenue: 279120 },
    { name: "Speedmaster Professional", brand: "Omega", sales: 18, revenue: 114300 },
    { name: "Royal Oak", brand: "Audemars Piguet", sales: 12, revenue: 156000 },
    { name: "Daytona", brand: "Rolex", sales: 15, revenue: 225000 },
  ],
  salesByCountry: [
    { country: "Nigeria", sales: 89, revenue: 1623450 },
    { country: "United States", sales: 34, revenue: 678900 },
    { country: "United Kingdom", sales: 18, revenue: 345600 },
    { country: "Canada", sales: 12, revenue: 156700 },
    { country: "Australia", sales: 8, revenue: 123000 },
  ],
  revenueByMonth: [
    { month: "Jan", revenue: 234500, orders: 12 },
    { month: "Feb", revenue: 345600, orders: 18 },
    { month: "Mar", revenue: 456700, orders: 24 },
    { month: "Apr", revenue: 567800, orders: 31 },
    { month: "May", revenue: 678900, orders: 38 },
    { month: "Jun", revenue: 564200, orders: 33 },
  ],
}

export function AdminAnalytics() {
  const { formatPrice, convertPrice } = useCurrency()
  const [timeRange, setTimeRange] = useState("30d")
  const [analytics] = useState<AnalyticsData>(mockAnalytics)

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0
    return (
      <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {Math.abs(growth).toFixed(1)}%
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(convertPrice(analytics.revenue.current))}</div>
            <div className="flex items-center justify-between">
              {formatGrowth(analytics.revenue.growth)}
              <p className="text-xs text-muted-foreground">vs last period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.orders.current}</div>
            <div className="flex items-center justify-between">
              {formatGrowth(analytics.orders.growth)}
              <p className="text-xs text-muted-foreground">vs last period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customers.current}</div>
            <div className="flex items-center justify-between">
              {formatGrowth(analytics.customers.growth)}
              <p className="text-xs text-muted-foreground">vs last period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(convertPrice(analytics.avgOrderValue.current))}</div>
            <div className="flex items-center justify-between">
              {formatGrowth(analytics.avgOrderValue.growth)}
              <p className="text-xs text-muted-foreground">vs last period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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

        {/* Sales by Country */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Sales by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.salesByCountry.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{country.country}</p>
                      <p className="text-sm text-muted-foreground">{country.sales} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatPrice(convertPrice(country.revenue))}</p>
                    <p className="text-sm text-muted-foreground">
                      {((country.revenue / analytics.revenue.current) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.revenueByMonth.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {month.month}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{formatPrice(convertPrice(month.revenue))}</p>
                    <p className="text-sm text-muted-foreground">{month.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {formatPrice(convertPrice(month.revenue / month.orders))} avg
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
