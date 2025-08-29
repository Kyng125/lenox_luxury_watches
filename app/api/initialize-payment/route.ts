import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "ngn", email, metadata = {} } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // In production, this would integrate with actual Paystack API
    const reference = `LLW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Mock successful payment initialization
    return NextResponse.json({
      reference: reference,
      authorization_url: `https://checkout.paystack.com/${reference}`,
      access_code: `access_code_${reference}`,
    })
  } catch (error) {
    console.error("Payment initialization failed:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
