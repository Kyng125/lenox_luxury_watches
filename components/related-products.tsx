import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const relatedWatches = [
  {
    id: "prod_datejust",
    name: "Datejust 36",
    brand: "Rolex",
    price: 8550,
    image: "/luxury-wristwatch.png",
    category: "Dress & Formal",
  },
  {
    id: "prod_santos",
    name: "Santos de Cartier",
    brand: "Cartier",
    price: 7150,
    salePrice: 6435,
    image: "/placeholder-tszr5.png",
    category: "Dress & Formal",
  },
  {
    id: "prod_navitimer",
    name: "Navitimer B01",
    brand: "Breitling",
    price: 8600,
    image: "/breitling-navitimer-chronograph.png",
    category: "Modern Sport",
  },
]

interface RelatedProductsProps {
  currentWatchId: string
}

export function RelatedProducts({ currentWatchId }: RelatedProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredWatches = relatedWatches.filter((watch) => watch.id !== currentWatchId)

  return (
    <section className="bg-gradient-to-b from-black to-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            You Might Also <span className="gold-gradient">Like</span>
          </h2>
          <p className="text-lg text-muted-foreground">Discover more exceptional timepieces</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWatches.map((watch) => (
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
                  {watch.salePrice && <Badge className="absolute top-3 right-3 bg-red-600 text-white">Sale</Badge>}
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <p className="text-sm text-primary font-semibold">{watch.brand}</p>
                    <h3 className="font-serif text-lg font-semibold">{watch.name}</h3>
                    <p className="text-xs text-muted-foreground">{watch.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {watch.salePrice ? (
                        <>
                          <span className="text-lg font-bold gold-gradient">{formatPrice(watch.salePrice)}</span>
                          <span className="text-sm text-muted-foreground line-through">{formatPrice(watch.price)}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold gold-gradient">{formatPrice(watch.price)}</span>
                      )}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      <Link href={`/watches/${watch.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 bg-transparent"
          >
            <Link href="/watches">View All Watches</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
