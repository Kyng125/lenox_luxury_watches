"use client"
import { useState } from "react"
import { usePaystackPayment } from "react-paystack"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, Shield } from "lucide-react"

interface PaymentFormProps {
  amount: number
  currency: string
  onSuccess: (reference: string) => void
  onError: (error: string) => void
  metadata?: Record<string, string>
  customerEmail: string
  customerName?: string
  customerPhone?: string
}

export function PaymentForm({
  amount,
  currency,
  onSuccess,
  onError,
  metadata = {},
  customerEmail,
  customerName = "",
  customerPhone = "",
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState(customerEmail)
  const [name, setName] = useState(customerName)
  const [phone, setPhone] = useState(customerPhone)

  const config = {
    reference: `LLW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: email,
    amount: Math.round(amount * 100), // Convert to kobo
    currency: currency.toUpperCase(),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    metadata: {
      ...metadata,
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: name,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: phone,
        },
      ],
    },
    channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
  }

  const initializePayment = usePaystackPayment(config)

  const handlePayment = () => {
    if (!email || !name) {
      setError("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    setError(null)

    initializePayment({
      onSuccess: (response) => {
        console.log("[v0] Paystack payment successful:", response)
        setIsProcessing(false)
        onSuccess(response.reference)
      },
      onClose: () => {
        console.log("[v0] Paystack payment closed")
        setIsProcessing(false)
        setError("Payment was cancelled")
      },
      onError: (error) => {
        console.log("[v0] Paystack payment error:", error)
        setIsProcessing(false)
        onError(error.message || "Payment failed")
        setError(error.message || "Payment failed")
      },
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Payment Details</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-white">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>

          {error && (
            <Alert className="mt-4 border-red-500 bg-red-950/20">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-5 w-5 text-green-400" />
          <div>
            <p className="font-medium text-white">Secure Payment</p>
            <p className="text-sm text-gray-400">Your payment is processed securely by Paystack</p>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isProcessing || !email || !name}
        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ${new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: currency.toUpperCase(),
          }).format(amount)}`
        )}
      </Button>
    </div>
  )
}
