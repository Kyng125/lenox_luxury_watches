import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    let event: any

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = createClient()

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object

        // Update payment intent status
        await supabase
          .from("payment_intents")
          .update({
            status: "succeeded",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        // Update order status if order exists
        if (paymentIntent.metadata.orderId) {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              status: "processing",
              updated_at: new Date().toISOString(),
            })
            .eq("id", paymentIntent.metadata.orderId)
        }

        // Record financial transaction
        await supabase.from("financial_transactions").insert({
          type: "payment_received",
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          stripe_payment_intent_id: paymentIntent.id,
          order_id: paymentIntent.metadata.orderId || null,
          status: "completed",
          processed_at: new Date().toISOString(),
        })

        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object

        await supabase
          .from("payment_intents")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", failedPayment.id)

        if (failedPayment.metadata.orderId) {
          await supabase
            .from("orders")
            .update({
              payment_status: "failed",
              status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("id", failedPayment.metadata.orderId)
        }

        break

      case "charge.dispute.created":
        const dispute = event.data.object

        // Record dispute for financial tracking
        await supabase.from("financial_transactions").insert({
          type: "dispute_created",
          amount: -(dispute.amount / 100),
          currency: dispute.currency.toUpperCase(),
          stripe_charge_id: dispute.charge,
          status: "pending",
          processed_at: new Date().toISOString(),
          notes: `Dispute reason: ${dispute.reason}`,
        })

        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing failed:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
