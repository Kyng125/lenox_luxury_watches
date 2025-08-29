"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Package,
  ShoppingCart,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Star,
  StarOff,
  Tag,
  Building2,
  AlertTriangle,
} from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

export function SimpleAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [showBrandDialog, setShowBrandDialog] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [brandForm, setBrandForm] = useState({ name: "", description: "" })
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" })
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    brand_id: "",
    category_id: "",
    is_featured: false,
    stock_quantity: "", // Added stock quantity field
    images: [],
  })

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
    setFeaturedProducts([])
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // Load products
      const productsRes = await fetch("/api/products")
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(
          Array.isArray(productsData.products)
            ? productsData.products
            : Array.isArray(productsData)
              ? productsData
              : [],
        )
      }

      // Load featured products
      const featuredRes = await fetch("/api/products?featured=true")
      if (featuredRes.ok) {
        const featuredData = await featuredRes.json()
        setFeaturedProducts(Array.isArray(featuredData.products) ? featuredData.products : [])
      }

      // Load orders
      try {
        const ordersRes = await fetch("/api/orders")
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          setOrders(Array.isArray(ordersData) ? ordersData : [])
        }
      } catch (orderError) {
        console.warn("Orders API error:", orderError)
        setOrders([])
      }

      // Load categories
      try {
        const categoriesRes = await fetch("/api/categories")
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        }
      } catch (error) {
        console.warn("Categories API error:", error)
        setCategories([])
      }

      // Load brands
      try {
        const brandsRes = await fetch("/api/brands")
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json()
          setBrands(Array.isArray(brandsData) ? brandsData : [])
        }
      } catch (error) {
        console.warn("Brands API error:", error)
        setBrands([])
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setProducts([])
      setOrders([])
      setFeaturedProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBrand = async () => {
    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandForm),
      })

      if (response.ok) {
        setShowBrandDialog(false)
        setBrandForm({ name: "", description: "" })
        loadData()
      } else {
        console.error("Failed to create brand")
      }
    } catch (error) {
      console.error("Error creating brand:", error)
    }
  }

  const handleUpdateBrand = async (brandId, updates) => {
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        setEditingBrand(null)
        loadData()
      } else {
        console.error("Failed to update brand")
      }
    } catch (error) {
      console.error("Error updating brand:", error)
    }
  }

  const handleDeleteBrand = async (brandId) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        const response = await fetch(`/api/brands/${brandId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          loadData()
        } else {
          const errorData = await response.json()
          alert(errorData.error || "Failed to delete brand")
        }
      } catch (error) {
        console.error("Error deleting brand:", error)
      }
    }
  }

  const handleCreateCategory = async () => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      })

      if (response.ok) {
        setShowCategoryDialog(false)
        setCategoryForm({ name: "", description: "" })
        loadData()
      } else {
        console.error("Failed to create category")
      }
    } catch (error) {
      console.error("Error creating category:", error)
    }
  }

  const handleUpdateCategory = async (categoryId, updates) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        setEditingCategory(null)
        loadData()
      } else {
        console.error("Failed to update category")
      }
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          loadData()
        } else {
          const errorData = await response.json()
          alert(errorData.error || "Failed to delete category")
        }
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
  }

  const handleCreateProduct = async () => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: Number.parseFloat(productForm.price),
          stock_quantity: Number.parseInt(productForm.stock_quantity) || 0, // Added stock quantity parsing
        }),
      })

      if (response.ok) {
        setShowProductDialog(false)
        setProductForm({
          name: "",
          description: "",
          price: "",
          brand_id: "",
          category_id: "",
          is_featured: false,
          stock_quantity: "", // Reset stock quantity
          images: [],
        })
        loadData()
        if (productForm.is_featured) {
          window.dispatchEvent(new CustomEvent("featuredProductsUpdated"))
        }
      } else {
        console.error("Failed to create product")
      }
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  const handleUpdateProduct = async (productId, updates) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        setEditingProduct(null)
        loadData()
        window.dispatchEvent(new CustomEvent("featuredProductsUpdated"))
      } else {
        console.error("Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const handleToggleFeatured = async (productId, currentFeaturedStatus) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !currentFeaturedStatus }),
      })

      if (response.ok) {
        loadData()
        window.dispatchEvent(new CustomEvent("featuredProductsUpdated"))
      } else {
        console.error("Failed to update featured status")
      }
    } catch (error) {
      console.error("Error updating featured status:", error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          loadData()
          window.dispatchEvent(new CustomEvent("featuredProductsUpdated"))
        } else {
          console.error("Failed to delete product")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        loadData()
      } else {
        console.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order:", error)
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

  const totalRevenue = Array.isArray(orders)
    ? orders.reduce((sum, order) => sum + (order.total_amount || order.total || 0), 0)
    : 0
  const totalOrders = Array.isArray(orders) ? orders.length : 0
  const totalProducts = Array.isArray(products) ? products.length : 0
  const pendingOrders = Array.isArray(orders) ? orders.filter((order) => order.status === "pending").length : 0
  const lowStockProducts = Array.isArray(products)
    ? products.filter((product) => (product.stock_quantity || 0) < 5).length
    : 0

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                      <p className="text-gray-400 text-sm">Featured Products</p>
                      <p className="text-2xl font-bold text-gold">{featuredProducts.length}</p>
                    </div>
                    <Star className="h-8 w-8 text-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Low Stock</p>
                      <p className={`text-2xl font-bold ${lowStockProducts > 0 ? "text-red-400" : "text-white"}`}>
                        {lowStockProducts}
                      </p>
                    </div>
                    <AlertTriangle className={`h-8 w-8 ${lowStockProducts > 0 ? "text-red-400" : "text-gold"}`} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="bg-gray-900 border-gray-800">
                <TabsTrigger value="orders" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Order Management
                </TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Product Management
                </TabsTrigger>
                <TabsTrigger value="featured" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Featured Products
                </TabsTrigger>
                <TabsTrigger value="brands" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Brand Management
                </TabsTrigger>
                <TabsTrigger value="categories" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Category Management
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gold">Order Management</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage customer orders and update status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(orders) && orders.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No orders found</p>
                    ) : (
                      <div className="space-y-4">
                        {Array.isArray(orders) &&
                          orders.map((order, index) => (
                            <div
                              key={order.id || index}
                              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-white">Order #{order.id || index + 1}</p>
                                <p className="text-sm text-gray-400">
                                  {order.customer_email || order.customerEmail || "Customer"} •{" "}
                                  {order.items?.length || 1} items
                                </p>
                                <p className="text-xs text-gray-500">
                                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Recent"}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-semibold text-gold">
                                    ₦{(order.total_amount || order.total || 0).toLocaleString()}
                                  </p>
                                  <Select
                                    value={order.status || "pending"}
                                    onValueChange={(newStatus) => handleUpdateOrderStatus(order.id, newStatus)}
                                  >
                                    <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-gold">Product Management</CardTitle>
                      <CardDescription className="text-gray-400">Manage your watch collection</CardDescription>
                    </div>
                    <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gold hover:bg-gold/90 text-black">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-gold">Add New Product</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Create a new luxury watch product
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                              id="name"
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={productForm.description}
                              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="price">Price (₦)</Label>
                              <Input
                                id="price"
                                type="number"
                                value={productForm.price}
                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div>
                              <Label htmlFor="stock">Stock Quantity</Label>
                              <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={productForm.stock_quantity}
                                onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div>
                              <Label htmlFor="brand">Brand</Label>
                              <Select
                                value={productForm.brand_id}
                                onValueChange={(value) => setProductForm({ ...productForm, brand_id: value })}
                              >
                                <SelectTrigger className="bg-gray-800 border-gray-700">
                                  <SelectValue placeholder="Select brand" />
                                </SelectTrigger>
                                <SelectContent>
                                  {brands.map((brand) => (
                                    <SelectItem key={brand.id} value={brand.id.toString()}>
                                      {brand.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={productForm.category_id}
                              onValueChange={(value) => setProductForm({ ...productForm, category_id: value })}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="featured"
                              checked={productForm.is_featured}
                              onCheckedChange={(checked) => setProductForm({ ...productForm, is_featured: checked })}
                            />
                            <Label htmlFor="featured" className="text-sm font-medium">
                              Mark as Featured Product
                            </Label>
                          </div>
                          <div>
                            <Label>Product Images</Label>
                            <ImageUpload
                              images={productForm.images}
                              onImagesChange={(images) => setProductForm({ ...productForm, images })}
                              maxImages={5}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowProductDialog(false)}
                              className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleCreateProduct} className="bg-gold hover:bg-gold/90 text-black">
                              Create Product
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(products) && products.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No products found</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.isArray(products) &&
                          products.map((product, index) => (
                            <div key={product.id || index} className="bg-gray-800 rounded-lg p-4 relative">
                              {product.is_featured && (
                                <Badge className="absolute top-2 right-2 bg-gold text-black">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              {(product.stock_quantity || 0) < 5 && (
                                <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Low Stock
                                </Badge>
                              )}
                              <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                                {product.product_images?.[0]?.url || product.images?.[0] || product.image_url ? (
                                  <img
                                    src={
                                      product.product_images?.[0]?.url ||
                                      product.images?.[0] ||
                                      product.image_url ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Eye className="h-8 w-8 text-gray-500" />
                                )}
                              </div>
                              <h3 className="font-semibold text-white mb-1">{product.name || "Unnamed Product"}</h3>
                              <p className="text-gold font-bold">₦{(product.price || 0).toLocaleString()}</p>
                              <p className="text-sm text-gray-400">
                                {product.brands?.name || product.brand?.name || product.brand || "Unknown Brand"}
                              </p>
                              <p
                                className={`text-xs ${(product.stock_quantity || 0) < 5 ? "text-red-400" : "text-gray-500"}`}
                              >
                                Stock: {product.stock_quantity || 0} units
                              </p>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                                  className={`border-gold text-gold hover:bg-gold hover:text-black ${
                                    product.is_featured ? "bg-gold text-black" : ""
                                  }`}
                                >
                                  {product.is_featured ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingProduct(product)}
                                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-700"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="border-red-700 text-red-400 hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="featured" className="space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gold">Featured Products Management</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage products displayed in the Featured Timepieces section on your homepage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {featuredProducts.length === 0 ? (
                      <div className="text-center py-12">
                        <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-2">No featured products yet</p>
                        <p className="text-gray-500 text-sm mb-4">
                          Go to Product Management and mark products as featured to display them here
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product) => (
                          <div key={product.id} className="bg-gray-800 rounded-lg p-4 relative">
                            <Badge className="absolute top-2 right-2 bg-gold text-black">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                            <div className="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                              {product.product_images?.[0]?.url ? (
                                <img
                                  src={product.product_images[0].url || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Eye className="h-12 w-12 text-gray-500" />
                              )}
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                              <p className="text-gold font-bold text-xl">₦{product.price.toLocaleString()}</p>
                              <p className="text-sm text-gray-400">{product.brands?.name}</p>
                              <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleFeatured(product.id, true)}
                                className="flex-1 border-red-700 text-red-400 hover:bg-red-900/20"
                              >
                                <StarOff className="h-3 w-3 mr-1" />
                                Remove Featured
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">How Featured Products Work</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Featured products appear in the "Featured Timepieces" section on your homepage</li>
                        <li>• Only the first 3 featured products are displayed to maintain visual appeal</li>
                        <li>• Changes made here instantly reflect on your live website</li>
                        <li>• Use the star button in Product Management to add/remove featured status</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="brands" className="space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-gold">Brand Management</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage watch brands for product categorization
                      </CardDescription>
                    </div>
                    <Dialog open={showBrandDialog} onOpenChange={setShowBrandDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gold hover:bg-gold/90 text-black">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Brand
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-800 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-gold">Add New Brand</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Create a new luxury watch brand
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="brandName">Brand Name</Label>
                            <Input
                              id="brandName"
                              value={brandForm.name}
                              onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                              className="bg-gray-800 border-gray-700"
                              placeholder="e.g., Rolex, Omega, Patek Philippe"
                            />
                          </div>
                          <div>
                            <Label htmlFor="brandDescription">Description</Label>
                            <Textarea
                              id="brandDescription"
                              value={brandForm.description}
                              onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                              className="bg-gray-800 border-gray-700"
                              placeholder="Brief description of the brand..."
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowBrandDialog(false)}
                              className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleCreateBrand} className="bg-gold hover:bg-gold/90 text-black">
                              Create Brand
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {brands.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        No brands found. Add your first brand to get started.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {brands.map((brand) => (
                          <div key={brand.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <Building2 className="h-6 w-6 text-gold" />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingBrand(brand)}
                                  className="border-gray-700 text-gray-300 hover:bg-gray-700"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteBrand(brand.id)}
                                  className="border-red-700 text-red-400 hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <h3 className="font-semibold text-white text-lg mb-1">{brand.name}</h3>
                            <p className="text-sm text-gray-400 mb-2">{brand.description}</p>
                            <p className="text-xs text-gray-500">
                              Products:{" "}
                              {products.filter((p) => p.brand_id === brand.id || p.brands?.id === brand.id).length}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-gold">Category Management</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage product categories for better organization
                      </CardDescription>
                    </div>
                    <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gold hover:bg-gold/90 text-black">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-800 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-gold">Add New Category</DialogTitle>
                          <DialogDescription className="text-gray-400">Create a new product category</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="categoryName">Category Name</Label>
                            <Input
                              id="categoryName"
                              value={categoryForm.name}
                              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                              className="bg-gray-800 border-gray-700"
                              placeholder="e.g., Dress Watches, Sports Watches, Chronographs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="categoryDescription">Description</Label>
                            <Textarea
                              id="categoryDescription"
                              value={categoryForm.description}
                              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                              className="bg-gray-800 border-gray-700"
                              placeholder="Brief description of the category..."
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowCategoryDialog(false)}
                              className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleCreateCategory} className="bg-gold hover:bg-gold/90 text-black">
                              Create Category
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {categories.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        No categories found. Add your first category to get started.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                          <div key={category.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <Tag className="h-6 w-6 text-gold" />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingCategory(category)}
                                  className="border-gray-700 text-gray-300 hover:bg-gray-700"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="border-red-700 text-red-400 hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <h3 className="font-semibold text-white text-lg mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-400 mb-2">{category.description}</p>
                            <p className="text-xs text-gray-500">
                              Products:{" "}
                              {
                                products.filter(
                                  (p) => p.category_id === category.id || p.categories?.id === category.id,
                                ).length
                              }
                            </p>
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
