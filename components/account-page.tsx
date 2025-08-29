"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Package, Settings, LogOut, Edit } from "lucide-react"
import { signOut } from "@/lib/auth-actions"
import { Footer } from "@/components/footer"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// Mock order data - in real app this would come from database
const mockOrders = [
  {
    id: "LLW-20241201-0001",
    date: "2024-12-01",
    status: "delivered",
    total: 12500,
    items: [
      {
        name: "Submariner Date",
        brand: "Rolex",
        image: "/rolex-submariner-main.png",
        price: 12500,
        quantity: 1,
      },
    ],
  },
  {
    id: "LLW-20241115-0002",
    date: "2024-11-15",
    status: "shipped",
    total: 6500,
    items: [
      {
        name: "Speedmaster Professional",
        brand: "Omega",
        image: "/omega-speedmaster-main.png",
        price: 6500,
        quantity: 1,
      },
    ],
  },
]

interface AccountPageProps {
  user: SupabaseUser
}

export function AccountPage({ user }: AccountPageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "processing":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold gold-gradient">My Account</h1>
            <p className="text-gray-400">Welcome back, {user.email}</p>
          </div>
          <form action={signOut}>
            <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-800">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-gray-800">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-serif gold-gradient">Personal Information</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="bg-gray-800 border-gray-700 text-white opacity-60"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold">
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-gray-600 text-gray-300 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="font-serif gold-gradient">Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Member Since</span>
                    <span className="font-medium">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Orders</span>
                    <span className="font-medium">{mockOrders.length}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Spent</span>
                    <span className="font-medium gold-gradient">
                      {formatPrice(mockOrders.reduce((sum, order) => sum + order.total, 0))}
                    </span>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Account Status</span>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Verified</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="font-serif gold-gradient">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-gray-400">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <p className="text-sm font-bold gold-gradient mt-1">{formatPrice(order.total)}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={`${item.brand} ${item.name}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-yellow-400 font-semibold">{item.brand}</p>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-400">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                          View Details
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="font-serif gold-gradient">Email Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-gray-400">Receive notifications about your orders</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-400">New arrivals and exclusive offers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-gray-400">Monthly watch industry insights</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="font-serif gold-gradient">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-600 text-gray-300 bg-transparent"
                  >
                    Change Password
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-600 text-gray-300 bg-transparent"
                  >
                    Two-Factor Authentication
                  </Button>

                  <Separator className="bg-gray-700" />

                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-600 text-red-400 bg-transparent hover:bg-red-500/10"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
