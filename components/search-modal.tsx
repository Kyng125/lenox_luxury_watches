"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useCurrency } from "@/contexts/currency-context"

interface SearchResult {
  id: string
  name: string
  brand: string
  price: number
  salePrice?: number | null
  image: string
  category: string
}

// Mock search results - in production, this would be an API call
const mockSearchResults: SearchResult[] = [
  {
    id: "prod_submariner",
    name: "Submariner Date",
    brand: "Rolex",
    price: 13150,
    image: "/luxury-watch.png",
    category: "Luxury Swiss",
  },
  {
    id: "prod_speedmaster",
    name: "Speedmaster Professional",
    brand: "Omega",
    price: 6350,
    image: "/omega-speedmaster-moonwatch.png",
    category: "Vintage Classic",
  },
  {
    id: "prod_nautilus",
    name: "Nautilus 5711/1A",
    brand: "Patek Philippe",
    price: 34890,
    image: "/patek-nautilus-blue.png",
    category: "Luxury Swiss",
  },
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { formatPrice, convertPrice } = useCurrency()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to parse recent searches:", error)
      }
    }
  }, [])

  // Search functionality
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    // Simulate API delay
    const timer = setTimeout(() => {
      const filtered = mockSearchResults.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.brand.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recent-searches", JSON.stringify(updated))

      // Close modal and navigate
      onClose()
      // In a real app, you'd navigate to search results page
    }
  }

  const popularSearches = ["Rolex", "Omega", "Patek Philippe", "Luxury Swiss", "Vintage"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl gold-gradient">Search Watches</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for watches, brands, or categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              autoFocus
            />
          </div>

          {/* Search Results */}
          {query.length >= 2 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300">Search Results</h3>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 animate-pulse">
                      <div className="w-12 h-12 bg-gray-700 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-3/4" />
                        <div className="h-3 bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={`/watches/${result.id}`}
                      onClick={() => {
                        handleSearch(query)
                        onClose()
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={result.image || "/placeholder.svg"}
                        alt={`${result.brand} ${result.name}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white">
                          {result.brand} {result.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                          <span className="text-sm font-semibold text-yellow-400">
                            {formatPrice(convertPrice(result.salePrice || result.price))}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No results found for "{query}"</p>
              )}
            </div>
          )}

          {/* Recent Searches */}
          {query.length < 2 && recentSearches.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(search)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {query.length < 2 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(search)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
