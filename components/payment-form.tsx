"use client"
import { useState } from "react"
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

  const handlePayment = async () => {
    if (!email || !name) {
      setError("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Initialize payment
      const response = await fetch("/api/initialize-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          email,
          metadata: {
            ...metadata,
            customer_name: name,
            phone_number: phone,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Payment initialization failed")
      }

      const data = await response.json()

      // Simulate successful payment for development
      setTimeout(() => {
        console.log("[v0] Simulated payment successful:", data.reference)
        setIsProcessing(false)
        onSuccess(data.reference)
      }, 2000)
    } catch (error) {
      console.log("[v0] Payment error:", error)
      setIsProcessing(false)
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      onError(errorMessage)
      setError(errorMessage)
    }
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
                placeholder="+1 (555) 123-4567"
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
            <p className="text-sm text-gray-400">Your payment is processed securely with SSL encryption</p>
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
          `Pay ${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)}`
        )}
      </Button>
    </div>
  )
}
