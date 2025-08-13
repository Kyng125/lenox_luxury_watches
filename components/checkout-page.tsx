"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Truck, Shield, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CheckoutFormData {
  // Contact Information
  email: string
  phone: string

  // Billing Address
  billingFirstName: string
  billingLastName: string
  billingCompany: string
  billingAddress1: string
  billingAddress2: string
  billingCity: string
  billingState: string
  billingZip: string
  billingCountry: string

  // Shipping Address
  shippingFirstName: string
  shippingLastName: string
  shippingCompany: string
  shippingAddress1: string
  shippingAddress2: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingCountry: string

  // Options
  sameAsShipping: boolean
  createAccount: boolean
  password: string
  confirmPassword: string

  // Payment
  paymentMethod: string
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
}

const initialFormData: CheckoutFormData = {
  email: "",
  phone: "",
  billingFirstName: "",
  billingLastName: "",
  billingCompany: "",
  billingAddress1: "",
  billingAddress2: "",
  billingCity: "",
  billingState: "",
  billingZip: "",
  billingCountry: "United States",
  shippingFirstName: "",
  shippingLastName: "",
  shippingCompany: "",
  shippingAddress1: "",
  shippingAddress2: "",
  shippingCity: "",
  shippingState: "",
  shippingZip: "",
  shippingCountry: "United States",
  sameAsShipping: true,
  createAccount: false,
  password: "",
  confirmPassword: "",
  paymentMethod: "credit-card",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardName: "",
}

export function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData)
  const [isProcessing, setIsProcessing] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const shipping = state.total > 1000 ? 0 : 50
  const tax = state.total * 0.08
  const finalTotal = state.total + shipping + tax

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-copy billing to shipping if same address is checked
    if (formData.sameAsShipping && field.startsWith("billing")) {
      const shippingField = field.replace("billing", "shipping") as keyof CheckoutFormData
      if (shippingField in formData) {
        setFormData((prev) => ({
          ...prev,
          [shippingField]: value,
        }))
      }
    }
  }

  const handleSameAsShippingChange = (checked: boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, sameAsShipping: checked }

      if (checked) {
        // Copy billing to shipping
        updated.shippingFirstName = prev.billingFirstName
        updated.shippingLastName = prev.billingLastName
        updated.shippingCompany = prev.billingCompany
        updated.shippingAddress1 = prev.billingAddress1
        updated.shippingAddress2 = prev.billingAddress2
        updated.shippingCity = prev.billingCity
        updated.shippingState = prev.billingState
        updated.shippingZip = prev.billingZip
        updated.shippingCountry = prev.billingCountry
      }

      return updated
    })
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.email &&
          formData.billingFirstName &&
          formData.billingLastName &&
          formData.billingAddress1 &&
          formData.billingCity &&
          formData.billingState &&
          formData.billingZip
        )
      case 2:
        if (formData.sameAsShipping) return true
        return !!(
          formData.shippingFirstName &&
          formData.shippingLastName &&
          formData.shippingAddress1 &&
          formData.shippingCity &&
          formData.shippingState &&
          formData.shippingZip
        )
      case 3:
        return !!(formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardName)
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmitOrder = async () => {
    if (!validateStep(3)) return

    setIsProcessing(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart and redirect to success page
      clearCart()
      router.push("/checkout/success")
    } catch (error) {
      console.error("Order processing failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-serif text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some luxury timepieces to continue</p>
          <Link href="/watches">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Shop Watches
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, title: "Contact & Billing", icon: "👤" },
    { number: 2, title: "Shipping", icon: "🚚" },
    { number: 3, title: "Payment", icon: "💳" },
    { number: 4, title: "Review", icon: "✅" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="font-serif text-3xl font-bold gold-gradient">Secure Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-500 text-black"
                      : "border-gray-600 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.number ? "text-white" : "text-gray-400"}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${currentStep > step.number ? "bg-yellow-500" : "bg-gray-600"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                {/* Step 1: Contact & Billing */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold mb-4 gold-gradient">Contact Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    <div>
                      <h3 className="font-serif text-xl font-bold mb-4 gold-gradient">Billing Address</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingFirstName">First Name *</Label>
                            <Input
                              id="billingFirstName"
                              value={formData.billingFirstName}
                              onChange={(e) => handleInputChange("billingFirstName", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingLastName">Last Name *</Label>
                            <Input
                              id="billingLastName"
                              value={formData.billingLastName}
                              onChange={(e) => handleInputChange("billingLastName", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="billingCompany">Company (Optional)</Label>
                          <Input
                            id="billingCompany"
                            value={formData.billingCompany}
                            onChange={(e) => handleInputChange("billingCompany", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="billingAddress1">Address Line 1 *</Label>
                          <Input
                            id="billingAddress1"
                            value={formData.billingAddress1}
                            onChange={(e) => handleInputChange("billingAddress1", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="billingAddress2">Address Line 2 (Optional)</Label>
                          <Input
                            id="billingAddress2"
                            value={formData.billingAddress2}
                            onChange={(e) => handleInputChange("billingAddress2", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="billingCity">City *</Label>
                            <Input
                              id="billingCity"
                              value={formData.billingCity}
                              onChange={(e) => handleInputChange("billingCity", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingState">State *</Label>
                            <Input
                              id="billingState"
                              value={formData.billingState}
                              onChange={(e) => handleInputChange("billingState", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingZip">ZIP Code *</Label>
                            <Input
                              id="billingZip"
                              value={formData.billingZip}
                              onChange={(e) => handleInputChange("billingZip", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="createAccount"
                          checked={formData.createAccount}
                          onCheckedChange={(checked) => handleInputChange("createAccount", checked as boolean)}
                        />
                        <Label htmlFor="createAccount" className="text-sm">
                          Create an account for order tracking and exclusive offers
                        </Label>
                      </div>

                      {formData.createAccount && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                          <div>
                            <Label htmlFor="password">Password *</Label>
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) => handleInputChange("password", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-bold mb-4 gold-gradient">Shipping Address</h2>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sameAsShipping"
                        checked={formData.sameAsShipping}
                        onCheckedChange={handleSameAsShippingChange}
                      />
                      <Label htmlFor="sameAsShipping" className="text-sm">
                        Same as billing address
                      </Label>
                    </div>

                    {!formData.sameAsShipping && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="shippingFirstName">First Name *</Label>
                            <Input
                              id="shippingFirstName"
                              value={formData.shippingFirstName}
                              onChange={(e) => handleInputChange("shippingFirstName", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="shippingLastName">Last Name *</Label>
                            <Input
                              id="shippingLastName"
                              value={formData.shippingLastName}
                              onChange={(e) => handleInputChange("shippingLastName", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="shippingCompany">Company (Optional)</Label>
                          <Input
                            id="shippingCompany"
                            value={formData.shippingCompany}
                            onChange={(e) => handleInputChange("shippingCompany", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="shippingAddress1">Address Line 1 *</Label>
                          <Input
                            id="shippingAddress1"
                            value={formData.shippingAddress1}
                            onChange={(e) => handleInputChange("shippingAddress1", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="shippingAddress2">Address Line 2 (Optional)</Label>
                          <Input
                            id="shippingAddress2"
                            value={formData.shippingAddress2}
                            onChange={(e) => handleInputChange("shippingAddress2", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="shippingCity">City *</Label>
                            <Input
                              id="shippingCity"
                              value={formData.shippingCity}
                              onChange={(e) => handleInputChange("shippingCity", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="shippingState">State *</Label>
                            <Input
                              id="shippingState"
                              value={formData.shippingState}
                              onChange={(e) => handleInputChange("shippingState", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="shippingZip">ZIP Code *</Label>
                            <Input
                              id="shippingZip"
                              value={formData.shippingZip}
                              onChange={(e) => handleInputChange("shippingZip", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Truck className="h-5 w-5 text-yellow-400" />
                        <h3 className="font-semibold">Shipping Options</h3>
                      </div>
                      <RadioGroup defaultValue="standard" className="space-y-3">
                        <div className="flex items-center space-x-2 p-3 border border-gray-700 rounded-lg">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Standard Shipping</p>
                                <p className="text-sm text-gray-400">5-7 business days</p>
                              </div>
                              <p className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border border-gray-700 rounded-lg">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Express Shipping</p>
                                <p className="text-sm text-gray-400">2-3 business days</p>
                              </div>
                              <p className="font-medium">$25.00</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border border-gray-700 rounded-lg">
                          <RadioGroupItem value="overnight" id="overnight" />
                          <Label htmlFor="overnight" className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Overnight Shipping</p>
                                <p className="text-sm text-gray-400">Next business day</p>
                              </div>
                              <p className="font-medium">$50.00</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-bold mb-4 gold-gradient">Payment Information</h2>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="h-5 w-5 text-yellow-400" />
                        <h3 className="font-semibold">Payment Method</h3>
                      </div>

                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleInputChange("paymentMethod", value)}
                      >
                        <div className="flex items-center space-x-2 p-3 border border-gray-700 rounded-lg">
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card" className="flex-1">
                            <div className="flex items-center gap-2">
                              <span>Credit Card</span>
                              <div className="flex gap-1">
                                <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center text-white font-bold">
                                  V
                                </div>
                                <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center text-white font-bold">
                                  M
                                </div>
                                <div className="w-8 h-5 bg-blue-800 rounded text-xs flex items-center justify-center text-white font-bold">
                                  A
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.paymentMethod === "credit-card" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardName">Name on Card *</Label>
                          <Input
                            id="cardName"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange("cardName", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange("cvv", e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="font-medium">Secure Payment</p>
                          <p className="text-sm text-gray-400">Your payment information is encrypted and secure</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-bold mb-4 gold-gradient">Review Your Order</h2>

                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Contact Information</h3>
                        <p className="text-gray-300">{formData.email}</p>
                        {formData.phone && <p className="text-gray-300">{formData.phone}</p>}
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Billing Address</h3>
                        <p className="text-gray-300">
                          {formData.billingFirstName} {formData.billingLastName}
                          <br />
                          {formData.billingAddress1}
                          <br />
                          {formData.billingAddress2 && (
                            <>
                              {formData.billingAddress2}
                              <br />
                            </>
                          )}
                          {formData.billingCity}, {formData.billingState} {formData.billingZip}
                        </p>
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <p className="text-gray-300">
                          {formData.sameAsShipping ? (
                            <>Same as billing address</>
                          ) : (
                            <>
                              {formData.shippingFirstName} {formData.shippingLastName}
                              <br />
                              {formData.shippingAddress1}
                              <br />
                              {formData.shippingAddress2 && (
                                <>
                                  {formData.shippingAddress2}
                                  <br />
                                </>
                              )}
                              {formData.shippingCity}, {formData.shippingState} {formData.shippingZip}
                            </>
                          )}
                        </p>
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Payment Method</h3>
                        <p className="text-gray-300">Credit Card ending in {formData.cardNumber.slice(-4)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-700">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="border-gray-600 text-gray-300 bg-transparent"
                    >
                      Previous
                    </Button>
                  )}

                  <div className="ml-auto">
                    {currentStep < 4 ? (
                      <Button
                        onClick={handleNextStep}
                        disabled={!validateStep(currentStep)}
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitOrder}
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold"
                      >
                        {isProcessing ? "Processing..." : "Place Order"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="font-serif gold-gradient">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={`${item.brand} ${item.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-yellow-400 font-semibold">{item.brand}</p>
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="text-xs">
                            Qty: {item.quantity}
                          </Badge>
                          <p className="text-sm font-bold">
                            {formatPrice((item.salePrice || item.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-700" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(state.total)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? <span className="text-green-400">Free</span> : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="gold-gradient">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span className="text-sm">SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Insured Shipping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm">Authenticity Guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
