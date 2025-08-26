"use client"

import { useState, useMemo } from "react"
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

// Mock data - in a real app, this would come from your database
const watches = [
  {
    id: "prod_submariner",
    name: "Submariner Date",
    brand: "Rolex",
    price: 13150,
    salePrice: null,
    image: "/luxury-watch.png",
    category: "Luxury Swiss",
    isFeatured: true,
    stock: 5,
    description: "The Rolex Submariner Date is a legendary diving watch, waterproof to 300 metres.",
  },
  {
    id: "prod_speedmaster",
    name: "Speedmaster Professional",
    brand: "Omega",
    price: 6350,
    salePrice: null,
    image: "/omega-speedmaster-moonwatch.png",
    category: "Vintage Classic",
    isFeatured: true,
    stock: 8,
    description: "The legendary Omega Speedmaster Professional - the first watch worn on the moon.",
  },
  {
    id: "prod_nautilus",
    name: "Nautilus 5711/1A",
    brand: "Patek Philippe",
    price: 34890,
    salePrice: null,
    image: "/patek-nautilus-blue.png",
    category: "Luxury Swiss",
    isFeatured: true,
    stock: 2,
    description: "The iconic Patek Philippe Nautilus with its distinctive porthole design.",
  },
  {
    id: "prod_santos",
    name: "Santos de Cartier",
    brand: "Cartier",
    price: 7150,
    salePrice: 6435,
    image: "/placeholder-tszr5.png",
    category: "Dress & Formal",
    isFeatured: false,
    stock: 6,
    description: "The Santos de Cartier watch, a pioneer among modern timepieces.",
  },
  {
    id: "prod_navitimer",
    name: "Navitimer B01",
    brand: "Breitling",
    price: 8600,
    salePrice: null,
    image: "/breitling-navitimer-chronograph.png",
    category: "Modern Sport",
    isFeatured: false,
    stock: 4,
    description: "The Breitling Navitimer B01 with its iconic circular slide rule.",
  },
  {
    id: "prod_datejust",
    name: "Datejust 36",
    brand: "Rolex",
    price: 8550,
    salePrice: null,
    image: "/luxury-wristwatch.png",
    category: "Dress & Formal",
    isFeatured: false,
    stock: 7,
    description: "The Rolex Datejust 36 - a timeless classic with modern refinements.",
  },
]

const brands = ["All Brands", "Rolex", "Omega", "Patek Philippe", "Cartier", "Breitling"]
const categories = ["All Categories", "Luxury Swiss", "Vintage Classic", "Modern Sport", "Dress & Formal"]
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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredAndSortedWatches = useMemo(() => {
    const filtered = watches.filter((watch) => {
      const matchesSearch =
        watch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.brand.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBrand = selectedBrand === "All Brands" || watch.brand === selectedBrand
      const matchesCategory = selectedCategory === "All Categories" || watch.category === selectedCategory
      const currentPrice = watch.salePrice || watch.price
      const matchesPrice = currentPrice >= selectedPriceRange.min && currentPrice <= selectedPriceRange.max
      const matchesStock = !onlyInStock || watch.stock > 0

      return matchesSearch && matchesBrand && matchesCategory && matchesPrice && matchesStock
    })

    // Sort watches
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.salePrice || a.price) - (b.salePrice || b.price)
        case "price-high":
          return (b.salePrice || b.price) - (a.salePrice || a.price)
        case "name":
          return a.name.localeCompare(b.name)
        case "brand":
          return a.brand.localeCompare(b.brand)
        case "featured":
        default:
          return b.isFeatured ? 1 : -1
      }
    })

    return filtered
  }, [searchQuery, selectedBrand, selectedCategory, selectedPriceRange, sortBy, onlyInStock])

  const handleWishlistToggle = (watch: any) => {
    if (isInWishlist(watch.id)) {
      removeFromWishlist(watch.id)
    } else {
      addToWishlist({
        id: watch.id,
        name: watch.name,
        brand: watch.brand,
        price: watch.price,
        salePrice: watch.salePrice,
        image: watch.image,
      })
    }
  }

  const handleAddToCart = (watch: any) => {
    addItem({
      id: watch.id,
      name: watch.name,
      brand: watch.brand,
      price: watch.price,
      salePrice: watch.salePrice,
      image: watch.image,
      sku: `SKU-${watch.id}`,
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
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
          Showing {filteredAndSortedWatches.length} of {watches.length} watches
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
          {filteredAndSortedWatches.map((watch) => (
            <Card
              key={watch.id}
              className="group bg-card border-border hover:border-primary/50 transition-all duration-300 luxury-shadow hover:watch-glow"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={watch.image || "/placeholder.svg"}
                    alt={`${watch.brand} ${watch.name}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {watch.isFeatured && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Featured</Badge>
                  )}
                  {watch.salePrice && <Badge className="absolute top-3 right-3 bg-red-600 text-white">Sale</Badge>}
                  {watch.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary">Out of Stock</Badge>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant={isInWishlist(watch.id) ? "default" : "secondary"}
                      className="h-8 w-8"
                      onClick={() => handleWishlistToggle(watch)}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(watch.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-sm text-primary font-semibold">{watch.brand}</p>
                    <h3 className="font-serif text-lg font-semibold line-clamp-1">{watch.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{watch.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {watch.salePrice ? (
                        <>
                          <span className="text-lg font-bold gold-gradient">
                            {formatPrice(convertPrice(watch.salePrice))}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(convertPrice(watch.price))}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold gold-gradient">
                          {formatPrice(convertPrice(watch.price))}
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
                        <Link href={`/watches/${watch.id}`}>View</Link>
                      </Button>
                      <Button
                        size="sm"
                        disabled={watch.stock === 0}
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleAddToCart(watch)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedWatches.map((watch) => (
            <Card key={watch.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                    <img
                      src={watch.image || "/placeholder.svg"}
                      alt={`${watch.brand} ${watch.name}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    {watch.isFeatured && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Featured</Badge>
                    )}
                    {watch.salePrice && <Badge className="absolute top-2 right-2 bg-red-600 text-white">Sale</Badge>}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm text-primary font-semibold">{watch.brand}</p>
                      <h3 className="font-serif text-xl font-semibold">{watch.name}</h3>
                      <p className="text-muted-foreground">{watch.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {watch.salePrice ? (
                          <>
                            <span className="text-2xl font-bold gold-gradient">
                              {formatPrice(convertPrice(watch.salePrice))}
                            </span>
                            <span className="text-lg text-muted-foreground line-through">
                              {formatPrice(convertPrice(watch.price))}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold gold-gradient">
                            {formatPrice(convertPrice(watch.price))}
                          </span>
                        )}
                        <Badge variant="outline" className="border-border">
                          {watch.stock > 0 ? `${watch.stock} in stock` : "Out of stock"}
                        </Badge>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleWishlistToggle(watch)}
                          className={isInWishlist(watch.id) ? "text-red-500" : ""}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(watch.id) ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                        >
                          <Link href={`/watches/${watch.id}`}>View Details</Link>
                        </Button>
                        <Button
                          disabled={watch.stock === 0}
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleAddToCart(watch)}
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
          ))}
        </div>
      )}

      {filteredAndSortedWatches.length === 0 && !isLoading && (
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
