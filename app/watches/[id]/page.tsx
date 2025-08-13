import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { RelatedProducts } from "@/components/related-products"
import { notFound } from "next/navigation"

// Mock data - in a real app, this would come from your database
const watchData = {
  prod_submariner: {
    id: "prod_submariner",
    name: "Submariner Date",
    brand: "Rolex",
    price: 13150,
    salePrice: null,
    sku: "ROL-SUB-001",
    stock: 5,
    category: "Luxury Swiss",
    isFeatured: true,
    description:
      "The Rolex Submariner Date is a legendary diving watch, waterproof to 300 metres and equipped with a unidirectional rotating bezel. This iconic timepiece combines robust functionality with timeless elegance, making it the perfect companion for both underwater adventures and sophisticated occasions.",
    longDescription:
      "Since its introduction in 1953, the Submariner has become the archetypal divers' watch. The Submariner Date features a date display at 3 o'clock with a Cyclops lens for enhanced readability. The unidirectional rotatable bezel enables divers to monitor their dive time safely. The watch is guaranteed waterproof to a depth of 300 metres (1,000 feet) and is equipped with the Rolex-patented Triplock winding crown, which screws down securely against the case.",
    images: [
      { url: "/luxury-watch.png", alt: "Rolex Submariner Date front view", isPrimary: true },
      { url: "/rolex-submariner-side.png", alt: "Rolex Submariner Date side view", isPrimary: false },
      { url: "/rolex-submariner-back.png", alt: "Rolex Submariner Date back view", isPrimary: false },
      { url: "/rolex-submariner-detail.png", alt: "Rolex Submariner Date detail view", isPrimary: false },
    ],
    specifications: [
      { name: "Case Material", value: "Oystersteel" },
      { name: "Case Diameter", value: "41mm" },
      { name: "Water Resistance", value: "300m (1,000ft)" },
      { name: "Movement", value: "Perpetual, mechanical, self-winding" },
      { name: "Power Reserve", value: "Approximately 70 hours" },
      { name: "Bracelet", value: "Oystersteel Oyster bracelet" },
      { name: "Clasp", value: "Oysterlock safety clasp" },
      { name: "Crystal", value: "Sapphire, Cyclops lens over the date" },
    ],
  },
  prod_speedmaster: {
    id: "prod_speedmaster",
    name: "Speedmaster Professional",
    brand: "Omega",
    price: 6350,
    salePrice: null,
    sku: "OME-SPE-001",
    stock: 8,
    category: "Vintage Classic",
    isFeatured: true,
    description:
      "The legendary Omega Speedmaster Professional - the first watch worn on the moon. Manual winding chronograph movement with hesalite crystal maintains the authentic vintage appeal.",
    longDescription:
      "The OMEGA Speedmaster Professional Moonwatch is one of OMEGA's most famous timepieces. Having been a part of all six lunar missions, the legendary Speedmaster is an iconic piece of horological history. This model features the famous manual-winding OMEGA Calibre 1861 movement, which has been used in the Speedmaster Professional since 1968.",
    images: [
      { url: "/omega-speedmaster-moonwatch.png", alt: "Omega Speedmaster Professional front view", isPrimary: true },
      { url: "/omega-speedmaster-side.png", alt: "Omega Speedmaster Professional side view", isPrimary: false },
      { url: "/omega-speedmaster-back.png", alt: "Omega Speedmaster Professional back view", isPrimary: false },
    ],
    specifications: [
      { name: "Case Material", value: "Stainless Steel" },
      { name: "Case Diameter", value: "42mm" },
      { name: "Water Resistance", value: "50m (165ft)" },
      { name: "Movement", value: "Manual winding chronograph" },
      { name: "Calibre", value: "OMEGA 1861" },
      { name: "Crystal", value: "Hesalite" },
      { name: "Bracelet", value: "Stainless steel bracelet" },
      { name: "Functions", value: "Hours, minutes, small seconds, chronograph" },
    ],
  },
  prod_nautilus: {
    id: "prod_nautilus",
    name: "Nautilus 5711/1A",
    brand: "Patek Philippe",
    price: 34890,
    salePrice: null,
    sku: "PAT-NAU-001",
    stock: 2,
    category: "Luxury Swiss",
    isFeatured: true,
    description:
      "The iconic Patek Philippe Nautilus with its distinctive porthole design and integrated bracelet. A masterpiece of luxury sports watch design.",
    longDescription:
      "Launched in 1976, the Nautilus is Patek Philippe's interpretation of an elegant sports watch. Its case, with a rounded octagonal shape, is inspired by a ship's porthole and features a horizontally embossed dial and integrated bracelet. The Nautilus has become one of the most coveted luxury sports watches in the world.",
    images: [
      { url: "/patek-nautilus-blue.png", alt: "Patek Philippe Nautilus front view", isPrimary: true },
      { url: "/patek-nautilus-side.png", alt: "Patek Philippe Nautilus side view", isPrimary: false },
      { url: "/patek-nautilus-back.png", alt: "Patek Philippe Nautilus back view", isPrimary: false },
    ],
    specifications: [
      { name: "Case Material", value: "Stainless Steel" },
      { name: "Case Diameter", value: "40mm" },
      { name: "Water Resistance", value: "120m (394ft)" },
      { name: "Movement", value: "Self-winding" },
      { name: "Calibre", value: "324 S C" },
      { name: "Power Reserve", value: "Min. 35 - max. 45 hours" },
      { name: "Crystal", value: "Sapphire" },
      { name: "Dial", value: "Blue, horizontally embossed" },
    ],
  },
}

interface PageProps {
  params: {
    id: string
  }
}

export default function WatchDetailPage({ params }: PageProps) {
  const watch = watchData[params.id as keyof typeof watchData]

  if (!watch) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <ProductDetail watch={watch} />
        <RelatedProducts currentWatchId={watch.id} />
      </main>
      <Footer />
    </div>
  )
}
