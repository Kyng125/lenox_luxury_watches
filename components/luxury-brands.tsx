const brands = [
  { name: "Rolex", logo: "/rolex-logo-gold-on-black.png" },
  { name: "Patek Philippe", logo: "/placeholder-1aqqy.png" },
  { name: "Omega", logo: "/placeholder-3yv1z.png" },
  { name: "Cartier", logo: "/placeholder-kwapb.png" },
  { name: "Breitling", logo: "/placeholder-eyzci.png" },
  { name: "TAG Heuer", logo: "/tag-heuer-logo-gold-on-black.png" },
]

export function LuxuryBrands() {
  return (
    <section className="py-16 bg-black border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Prestigious <span className="gold-gradient">Partners</span>
          </h2>
          <p className="text-muted-foreground">Authorized dealer for the world's finest watch brands</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center p-4 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={`${brand.name} logo`}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
