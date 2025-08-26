import { type NextRequest, NextResponse } from "next/server"
import { paystack, formatAmountForPaystack } from "@/lib/paystack"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "ngn", email, metadata = {} } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Initialize payment with Paystack
    const response = await paystack.transaction.initialize({
      amount: formatAmountForPaystack(amount),
      currency: currency.toUpperCase(),
      email: email,
      metadata: {
        ...metadata,
        source: "lenox-luxury-watches",
      },
      channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
    })

    // Log payment initialization for financial tracking
    const supabase = createClient()
    await supabase.from("payment_intents").insert({
      paystack_reference: response.data.reference,
      amount: amount,
      currency: currency.toUpperCase(),
      status: "initialized",
      metadata: metadata,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      reference: response.data.reference,
      authorization_url: response.data.authorization_url,
      access_code: response.data.access_code,
    })
  } catch (error) {
    console.error("Payment initialization failed:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
