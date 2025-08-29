"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, X, Save, ArrowLeft, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { ImageUpload } from "./image-upload"

interface ProductFormData {
  name: string
  description: string
  price: string
  sale_price: string
  sku: string
  stock_quantity: string
  category_id: string
  brand_id: string
  is_active: boolean
  is_featured: boolean
  images: string[]
  specifications: Array<{ name: string; value: string }>
  dimensions: { length?: string; width?: string; height?: string }
  weight: string
}

interface AdminProductFormProps {
  productId?: string
}

interface Category {
  id: string
  name: string
  description?: string
}

interface Brand {
  id: string
  name: string
  description?: string
}

interface InventoryMovement {
  id: string
  movement_type: string
  quantity_change: number
  previous_quantity: number
  new_quantity: number
  created_at: string
  notes?: string
}

export function AdminProductForm({ productId }: AdminProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([])
  const [stockAdjustment, setStockAdjustment] = useState({ quantity: "", notes: "", type: "restock" })
  const [originalStockQuantity, setOriginalStockQuantity] = useState(0)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    sku: "",
    stock_quantity: "",
    category_id: "",
    brand_id: "",
    is_active: true,
    is_featured: false,
    images: [],
    specifications: [{ name: "", value: "" }],
    dimensions: {},
    weight: "",
  })

  useEffect(() => {
    loadCategoriesAndBrands()
  }, [])

  // Load product data if editing
  useEffect(() => {
    if (productId) {
      loadProduct(productId)
      loadInventoryMovements(productId)
    }
  }, [productId])

  const loadCategoriesAndBrands = async () => {
    try {
      // Load categories
      const categoriesResponse = await fetch("/api/categories")
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])
      }

      // Load brands
      const brandsResponse = await fetch("/api/brands")
      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json()
        setBrands(brandsData.brands || [])
      }
    } catch (error) {
      console.error("Error loading categories and brands:", error)
      toast({
        title: "Error",
        description: "Failed to load categories and brands.",
        variant: "destructive",
      })
    }
  }

  const loadProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`)
      if (response.ok) {
        const product = await response.json()
        const stockQty = product.stock_quantity || 0
        setOriginalStockQuantity(stockQty)
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          sale_price: product.sale_price?.toString() || "",
          sku: product.sku || "",
          stock_quantity: stockQty.toString(),
          category_id: product.category_id || "",
          brand_id: product.brand_id || "",
          is_active: product.is_active !== false,
          is_featured: product.is_featured || false,
          images: product.product_images?.map((img: any) => img.url) || [],
          specifications: Object.entries(product.specifications || {}).map(([name, value]) => ({
            name,
            value: value as string,
          })) || [{ name: "", value: "" }],
          dimensions: product.dimensions || {},
          weight: product.weight?.toString() || "",
        })
      }
    } catch (error) {
      console.error("Error loading product:", error)
      toast({
        title: "Error",
        description: "Failed to load product data.",
        variant: "destructive",
      })
    }
  }

  const loadInventoryMovements = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/inventory/movements?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setInventoryMovements(data.movements || [])
      }
    } catch (error) {
      console.error("Error loading inventory movements:", error)
    }
  }

  const handleStockAdjustment = async () => {
    if (!productId || !stockAdjustment.quantity) {
      toast({
        title: "Error",
        description: "Please enter a quantity to adjust.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: Number.parseInt(stockAdjustment.quantity),
          movementType: stockAdjustment.type,
          notes: stockAdjustment.notes || "Manual stock adjustment",
        }),
      })

      if (response.ok) {
        toast({
          title: "Stock Updated",
          description: "Stock quantity has been updated successfully.",
        })
        // Reload product data to get updated stock
        loadProduct(productId)
        loadInventoryMovements(productId)
        setStockAdjustment({ quantity: "", notes: "", type: "restock" })
      } else {
        throw new Error("Failed to update stock")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock quantity.",
        variant: "destructive",
      })
    }
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: "Out of Stock", color: "bg-red-500", icon: AlertTriangle }
    if (quantity <= 5) return { status: "Low Stock", color: "bg-yellow-500", icon: AlertTriangle }
    if (quantity <= 20) return { status: "In Stock", color: "bg-blue-500", icon: Package }
    return { status: "Well Stocked", color: "bg-green-500", icon: TrendingUp }
  }

  const calculateInventoryValue = () => {
    const quantity = Number.parseInt(formData.stock_quantity) || 0
    const price = Number.parseFloat(formData.price) || 0
    return quantity * price
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSpecificationChange = (index: number, field: string, value: string) => {
    const updatedSpecs = [...formData.specifications]
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value }
    setFormData((prev) => ({ ...prev, specifications: updatedSpecs }))
  }

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }],
    }))
  }

  const removeSpecification = (index: number) => {
    if (formData.specifications.length > 1) {
      const updatedSpecs = formData.specifications.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, specifications: updatedSpecs }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.sku || !formData.category_id || !formData.brand_id) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      const productData = {
        ...formData,
        images: formData.images.map((url, index) => ({
          url,
          alt_text: `${formData.name} image ${index + 1}`,
          is_primary: index === 0,
          sort_order: index,
        })),
        specifications: formData.specifications
          .filter((spec) => spec.name && spec.value)
          .reduce((acc, spec) => ({ ...acc, [spec.name]: spec.value }), {}),
      }

      const method = productId ? "PUT" : "POST"
      const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save product")
      }

      toast({
        title: productId ? "Product Updated" : "Product Created",
        description: `${formData.name} has been ${productId ? "updated" : "created"} successfully.`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const currentStock = Number.parseInt(formData.stock_quantity) || 0
  const stockStatus = getStockStatus(currentStock)
  const StatusIcon = stockStatus.icon

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-700 text-black">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Product Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black border-yellow-600/20">
            <CardHeader>
              <CardTitle className="font-serif text-yellow-600">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Submariner Date"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-gray-300">
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="e.g., ROL-SUB-001"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed product description..."
                  rows={4}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">
                    Price ($) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale_price" className="text-gray-300">
                    Sale Price ($)
                  </Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) => handleInputChange("sale_price", e.target.value)}
                    placeholder="0.00"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity" className="text-gray-300">
                    Stock Quantity *
                  </Label>
                  <div className="relative">
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                      placeholder="0"
                      className="bg-gray-900 border-gray-700 text-white pr-10"
                      required
                    />
                    <StatusIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">
                    Category *
                  </Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange("category_id", value)}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-white">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-gray-300">
                    Brand *
                  </Label>
                  <Select value={formData.brand_id} onValueChange={(value) => handleInputChange("brand_id", value)}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id} className="text-white">
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-yellow-600/20">
            <CardHeader>
              <CardTitle className="font-serif text-yellow-600">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => handleInputChange("images", images)}
                maxImages={5}
              />
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card className="bg-black border-yellow-600/20">
            <CardHeader>
              <CardTitle className="font-serif text-yellow-600">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-gray-300">Specification Name</Label>
                    <Input
                      value={spec.name}
                      onChange={(e) => handleSpecificationChange(index, "name", e.target.value)}
                      placeholder="e.g., Case Material"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-gray-300">Value</Label>
                    <Input
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                      placeholder="e.g., Stainless Steel"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  {formData.specifications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addSpecification}
                className="w-full border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-black border-yellow-600/20">
            <CardHeader>
              <CardTitle className="font-serif text-yellow-600 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Current Stock:</span>
                <Badge className={`${stockStatus.color} text-white`}>{currentStock} units</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {stockStatus.status}
                </Badge>
              </div>

              {formData.price && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Inventory Value:</span>
                  <span className="text-yellow-400 font-semibold">${calculateInventoryValue().toLocaleString()}</span>
                </div>
              )}

              {currentStock <= 5 && (
                <Alert className="border-yellow-600/20 bg-yellow-600/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-300">
                    {currentStock === 0 ? "Product is out of stock!" : "Low stock alert - consider restocking soon."}
                  </AlertDescription>
                </Alert>
              )}

              {productId && (
                <>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-3">
                    <Label className="text-gray-300">Quick Stock Adjustment</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={stockAdjustment.quantity}
                        onChange={(e) => setStockAdjustment((prev) => ({ ...prev, quantity: e.target.value }))}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      <Select
                        value={stockAdjustment.type}
                        onValueChange={(value) => setStockAdjustment((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="restock" className="text-white">
                            Restock
                          </SelectItem>
                          <SelectItem value="adjustment" className="text-white">
                            Adjustment
                          </SelectItem>
                          <SelectItem value="return" className="text-white">
                            Return
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      placeholder="Notes (optional)"
                      value={stockAdjustment.notes}
                      onChange={(e) => setStockAdjustment((prev) => ({ ...prev, notes: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    <Button
                      type="button"
                      onClick={handleStockAdjustment}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      Update Stock
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black border-yellow-600/20">
            <CardHeader>
              <CardTitle className="font-serif text-yellow-600">Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
                <Label htmlFor="is_active" className="text-gray-300">
                  Active Product
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                />
                <Label htmlFor="is_featured" className="text-gray-300">
                  Featured Product
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-yellow-600/20">
            <CardHeader>
              <CardTitle className="font-serif text-yellow-600">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-400">
                <p>Status: {formData.is_active ? "Active" : "Draft"}</p>
                <p>Visibility: {formData.is_featured ? "Featured" : "Standard"}</p>
              </div>
              <Separator className="bg-gray-700" />
              <div className="space-y-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                >
                  {isLoading ? "Saving..." : productId ? "Update Product" : "Create Product"}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800"
                >
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {productId && inventoryMovements.length > 0 && (
            <Card className="bg-black border-yellow-600/20">
              <CardHeader>
                <CardTitle className="font-serif text-yellow-600">Recent Stock Movements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {inventoryMovements.slice(0, 5).map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {movement.quantity_change > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        <span className="text-gray-300 capitalize">{movement.movement_type}</span>
                      </div>
                      <div className="text-right">
                        <div className={movement.quantity_change > 0 ? "text-green-400" : "text-red-400"}>
                          {movement.quantity_change > 0 ? "+" : ""}
                          {movement.quantity_change}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(movement.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}
