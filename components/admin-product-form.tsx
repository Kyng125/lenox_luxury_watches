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
  slug: string
  description: string
  price: string
  salePrice: string
  sku: string
  stock: string
  categoryId: string
  brandId: string
  isActive: boolean
  isFeatured: boolean
  images: string[]
  specifications: Array<{ name: string; value: string }>
}

interface AdminProductFormProps {
  productId?: string
}

// Mock data for categories and brands
const mockCategories = [
  { id: "cat_luxury_swiss", name: "Luxury Swiss" },
  { id: "cat_vintage_classic", name: "Vintage Classic" },
  { id: "cat_modern_sport", name: "Modern Sport" },
  { id: "cat_dress_formal", name: "Dress & Formal" },
]

const mockBrands = [
  { id: "brand_rolex", name: "Rolex" },
  { id: "brand_omega", name: "Omega" },
  { id: "brand_patek", name: "Patek Philippe" },
  { id: "brand_cartier", name: "Cartier" },
  { id: "brand_breitling", name: "Breitling" },
]

export function AdminProductForm({ productId }: AdminProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    sku: "",
    stock: "",
    categoryId: "",
    brandId: "",
    isActive: true,
    isFeatured: false,
    images: [],
    specifications: [{ name: "", value: "" }],
  })

  // Load product data if editing
  useEffect(() => {
    if (productId) {
      loadProduct(productId)
    }
  }, [productId])

  const loadProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`)
      if (response.ok) {
        const product = await response.json()
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || "",
          price: product.price.toString(),
          salePrice: product.salePrice?.toString() || "",
          sku: product.sku,
          stock: product.stock.toString(),
          categoryId: product.categoryId,
          brandId: product.brandId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          images: product.images?.map((img: any) => img.url) || [],
          specifications: product.specifications || [{ name: "", value: "" }],
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

    // Auto-generate slug when name changes
    if (field === "name" && typeof value === "string") {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }))
    }
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
      if (!formData.name || !formData.price || !formData.sku || !formData.categoryId || !formData.brandId) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Prepare data for API
      const productData = {
        ...formData,
        images: formData.images.map((url, index) => ({
          url,
          alt: `${formData.name} image ${index + 1}`,
          isPrimary: index === 0,
        })),
        specifications: formData.specifications.filter((spec) => spec.name && spec.value),
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
        throw new Error("Failed to save product")
      }

      toast({
        title: productId ? "Product Updated" : "Product Created",
        description: `${formData.name} has been ${productId ? "updated" : "created"} successfully.`,
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
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
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Product Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Submariner Date"
                    className="bg-background border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="auto-generated"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed product description..."
                  rows={4}
                  className="bg-background border-border"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className="bg-background border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price ($)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange("salePrice", e.target.value)}
                    placeholder="0.00"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="0"
                    className="bg-background border-border"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="e.g., ROL-SUB-001"
                    className="bg-background border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select value={formData.brandId} onValueChange={(value) => handleInputChange("brandId", value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">Product Images</CardTitle>
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
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Specification Name</Label>
                    <Input
                      value={spec.name}
                      onChange={(e) => handleSpecificationChange(index, "name", e.target.value)}
                      placeholder="e.g., Case Material"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                      placeholder="e.g., Stainless Steel"
                      className="bg-background border-border"
                    />
                  </div>
                  {formData.specifications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                      className="text-red-600 hover:text-red-700"
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
                className="w-full border-border bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Active Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                />
                <Label htmlFor="isFeatured">Featured Product</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Status: {formData.isActive ? "Active" : "Draft"}</p>
                <p>Visibility: {formData.isFeatured ? "Featured" : "Standard"}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                  {isLoading ? "Saving..." : productId ? "Update Product" : "Create Product"}
                </Button>
                <Button asChild variant="outline" className="w-full border-border bg-transparent">
                  <Link href="/admin/products">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
