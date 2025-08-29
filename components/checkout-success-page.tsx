"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import { Footer } from "@/components/footer"
import Link from "next/link"

export function CheckoutSuccessPage() {
  const orderNumber =
    "LLW-" +
    new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    "-" +
    Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="font-serif text-4xl font-bold mb-4 gold-gradient">Order Confirmed!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Thank you for your purchase. Your luxury timepiece is on its way.
          </p>

          {/* Order Details */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl font-bold mb-2 gold-gradient">Order #{orderNumber}</h2>
                <p className="text-gray-400">
                  Placed on{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full mb-3">
                    <Mail className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Confirmation Sent</h3>
                  <p className="text-sm text-gray-400">Order confirmation email sent to your inbox</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full mb-3">
                    <Package className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Processing</h3>
                  <p className="text-sm text-gray-400">Your order is being prepared for shipment</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full mb-3">
                    <Truck className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Shipping</h3>
                  <p className="text-sm text-gray-400">Estimated delivery in 5-7 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
            <h3 className="font-serif text-xl font-bold mb-4 gold-gradient">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">
                  You'll receive a shipping confirmation email with tracking information once your order ships.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">
                  Your timepiece will be carefully packaged and insured for safe delivery.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">
                  Each watch comes with a certificate of authenticity and manufacturer warranty.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/watches">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold"
              >
                Continue Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 mb-4">Need help with your order?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <span>📧 support@lenoxwatches.com</span>
              <span>📞 +1 (555) 123-4567</span>
              <span>🕒 Mon-Fri 9AM-6PM EST</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
