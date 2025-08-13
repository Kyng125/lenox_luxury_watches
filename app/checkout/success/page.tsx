import type { Metadata } from "next"
import { CheckoutSuccessPage } from "@/components/checkout-success-page"

export const metadata: Metadata = {
  title: "Order Confirmed | Lenox Luxury Watches",
  description: "Your luxury watch order has been confirmed. Thank you for choosing Lenox Luxury Watches.",
}

export default function CheckoutSuccess() {
  return <CheckoutSuccessPage />
}
