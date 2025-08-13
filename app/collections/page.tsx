import type { Metadata } from "next"
import { CollectionsPage } from "@/components/collections-page"

export const metadata: Metadata = {
  title: "Watch Collections | Lenox Luxury Watches",
  description:
    "Explore our curated watch collections featuring dress watches, sport watches, diving watches, and more luxury timepieces.",
}

export default function Collections() {
  return <CollectionsPage />
}
