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
import { Plus, X, Save, ArrowLeft } from "lucide-react"
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

export function AdminProductForm({ productId }: AdminProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
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
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          sale_price: product.sale_price?.toString() || "",
          sku: product.sku || "",
          stock_quantity: product.stock_quantity?.toString() || "",
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

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
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
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                    placeholder="0"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
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
        </div>
      </div>
    </form>
  )
}
