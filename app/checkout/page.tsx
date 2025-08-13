import type { Metadata } from "next"
import { CheckoutPage } from "@/components/checkout-page"

export const metadata: Metadata = {
  title: "Checkout | Lenox Luxury Watches",
  description: "Complete your luxury watch purchase with our secure checkout process.",
}

export default function Checkout() {
  return <CheckoutPage />
}
