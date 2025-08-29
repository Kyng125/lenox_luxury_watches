"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Filter, Grid, List, Heart, ShoppingBag } from "lucide-react"
import { ProductCardSkeleton, ProductListSkeleton } from "@/components/loading-skeleton"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { useCurrency } from "@/contexts/currency-context"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  sale_price?: number
  sku: string
  stock_quantity: number
  is_featured: boolean
  brands: { name: string }
  categories: { name: string }
  product_images: Array<{ url: string; is_primary: boolean }>
}

interface Brand {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

const priceRanges = [
  { label: "All Prices", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Under $10,000", min: 0, max: 10000 },
  { label: "$10,000 - $20,000", min: 10000, max: 20000 },
  { label: "$20,000 - $50,000", min: 20000, max: 50000 },
  { label: "Over $50,000", min: 50000, max: Number.POSITIVE_INFINITY },
]

export function ProductCatalog() {
  const { formatPrice, convertPrice } = useCurrency()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addItem } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [onlyInStock, setOnlyInStock] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsRes, brandsRes, categoriesRes] = await Promise.all([
        fetch("/api/products?limit=50"),
        fetch("/api/brands"),
        fetch("/api/categories"),
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])
      }

      if (brandsRes.ok) {
        const brandsData = await brandsRes.json()
        setBrands(brandsData.brands || [])
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brands?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesBrand = selectedBrand === "All Brands" || product.brands?.name === selectedBrand
      const matchesCategory = selectedCategory === "All Categories" || product.categories?.name === selectedCategory

      const currentPrice = product.sale_price || product.price
      const matchesPrice = currentPrice >= selectedPriceRange.min && currentPrice <= selectedPriceRange.max
      const matchesStock = !onlyInStock || product.stock_quantity > 0

      return matchesSearch && matchesBrand && matchesCategory && matchesPrice && matchesStock
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.sale_price || a.price) - (b.sale_price || b.price)
        case "price-high":
          return (b.sale_price || b.price) - (a.sale_price || a.price)
        case "name":
          return a.name.localeCompare(b.name)
        case "brand":
          return (a.brands?.name || "").localeCompare(b.brands?.name || "")
        case "featured":
        default:
          return b.is_featured ? 1 : -1
      }
    })

    return filtered
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedPriceRange, sortBy, onlyInStock])

  const handleWishlistToggle = (product: Product) => {
    const primaryImage = product.product_images?.find((img) => img.is_primary)?.url || product.product_images?.[0]?.url

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        brand: product.brands?.name || "",
        price: product.price,
        salePrice: product.sale_price || null,
        image: primaryImage || "/placeholder.svg",
      })
    }
  }

  const handleAddToCart = (product: Product) => {
    const primaryImage = product.product_images?.find((img) => img.is_primary)?.url || product.product_images?.[0]?.url

    addItem({
      id: product.id,
      name: product.name,
      brand: product.brands?.name || "",
      price: product.price,
      salePrice: product.sale_price || null,
      image: primaryImage || "/placeholder.svg",
      sku: product.sku,
    })
  }

  return (
    <div className="space-y-8">
      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search watches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-border bg-transparent"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="brand">Brand A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border border-border rounded-md bg-card">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Brand</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Brands">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Price Range</Label>
                <Select
                  value={selectedPriceRange.label}
                  onValueChange={(value) => {
                    const range = priceRanges.find((r) => r.label === value)
                    if (range) setSelectedPriceRange(range)
                  }}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.label} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Availability</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={onlyInStock}
                    onCheckedChange={(checked) => setOnlyInStock(checked as boolean)}
                  />
                  <Label htmlFor="in-stock" className="text-sm">
                    In Stock Only
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredAndSortedProducts.length} of {products.length} watches
        </p>
      </div>

      {/* Product Grid/List */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <ProductListSkeleton key={i} />
            ))}
          </div>
        )
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => {
            const primaryImage =
              product.product_images?.find((img) => img.is_primary)?.url || product.product_images?.[0]?.url

            return (
              <Card
                key={product.id}
                className="group bg-card border-border hover:border-primary/50 transition-all duration-300 luxury-shadow hover:watch-glow"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={primaryImage || "/placeholder.svg"}
                      alt={`${product.brands?.name} ${product.name}`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.is_featured && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Featured</Badge>
                    )}
                    {product.sale_price && <Badge className="absolute top-3 right-3 bg-red-600 text-white">Sale</Badge>}
                    {product.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary">Out of Stock</Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant={isInWishlist(product.id) ? "default" : "secondary"}
                        className="h-8 w-8"
                        onClick={() => handleWishlistToggle(product)}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <p className="text-sm text-primary font-semibold">{product.brands?.name}</p>
                      <h3 className="font-serif text-lg font-semibold line-clamp-1">{product.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.sale_price ? (
                          <>
                            <span className="text-lg font-bold gold-gradient">
                              {formatPrice(convertPrice(product.sale_price))}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(convertPrice(product.price))}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold gold-gradient">
                            {formatPrice(convertPrice(product.price))}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                        >
                          <Link href={`/watches/${product.id}`}>View</Link>
                        </Button>
                        <Button
                          size="sm"
                          disabled={product.stock_quantity === 0}
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedProducts.map((product) => {
            const primaryImage =
              product.product_images?.find((img) => img.is_primary)?.url || product.product_images?.[0]?.url

            return (
              <Card key={product.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                      <img
                        src={primaryImage || "/placeholder.svg"}
                        alt={`${product.brands?.name} ${product.name}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      {product.is_featured && (
                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Featured</Badge>
                      )}
                      {product.sale_price && (
                        <Badge className="absolute top-2 right-2 bg-red-600 text-white">Sale</Badge>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-sm text-primary font-semibold">{product.brands?.name}</p>
                        <h3 className="font-serif text-xl font-semibold">{product.name}</h3>
                        <p className="text-muted-foreground">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {product.sale_price ? (
                            <>
                              <span className="text-2xl font-bold gold-gradient">
                                {formatPrice(convertPrice(product.sale_price))}
                              </span>
                              <span className="text-lg text-muted-foreground line-through">
                                {formatPrice(convertPrice(product.price))}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold gold-gradient">
                              {formatPrice(convertPrice(product.price))}
                            </span>
                          )}
                          <Badge variant="outline" className="border-border">
                            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                          </Badge>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleWishlistToggle(product)}
                            className={isInWishlist(product.id) ? "text-red-500" : ""}
                          >
                            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                          >
                            <Link href={`/watches/${product.id}`}>View Details</Link>
                          </Button>
                          <Button
                            disabled={product.stock_quantity === 0}
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredAndSortedProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">No watches found matching your criteria</p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setSelectedBrand("All Brands")
              setSelectedCategory("All Categories")
              setSelectedPriceRange(priceRanges[0])
              setOnlyInStock(false)
            }}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
