import { type NextRequest, NextResponse } from "next/server"
import { stripe, formatAmountForStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd", metadata = {} } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        source: "lenox-luxury-watches",
      },
    })

    // Log payment intent creation for financial tracking
    const supabase = createClient()
    await supabase.from("payment_intents").insert({
      stripe_payment_intent_id: paymentIntent.id,
      amount: amount,
      currency: currency.toUpperCase(),
      status: "created",
      metadata: metadata,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Payment intent creation failed:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
