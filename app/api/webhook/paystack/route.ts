import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import crypto from "crypto"

const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("x-paystack-signature")!

    // Verify webhook signature
    const hash = crypto.createHmac("sha512", webhookSecret).update(body).digest("hex")

    if (hash !== signature) {
      console.error("Webhook signature verification failed")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = createClient()

    switch (event.event) {
      case "charge.success":
        const transaction = event.data

        // Update payment intent status
        await supabase
          .from("payment_intents")
          .update({
            status: "succeeded",
            updated_at: new Date().toISOString(),
          })
          .eq("paystack_reference", transaction.reference)

        // Update order status if order exists
        if (transaction.metadata.orderId) {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              status: "processing",
              updated_at: new Date().toISOString(),
            })
            .eq("id", transaction.metadata.orderId)
        }

        // Record financial transaction
        await supabase.from("financial_transactions").insert({
          type: "payment_received",
          amount: transaction.amount / 100,
          currency: transaction.currency.toUpperCase(),
          paystack_reference: transaction.reference,
          order_id: transaction.metadata.orderId || null,
          status: "completed",
          processed_at: new Date().toISOString(),
        })

        break

      case "charge.failed":
        const failedTransaction = event.data

        await supabase
          .from("payment_intents")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("paystack_reference", failedTransaction.reference)

        if (failedTransaction.metadata.orderId) {
          await supabase
            .from("orders")
            .update({
              payment_status: "failed",
              status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("id", failedTransaction.metadata.orderId)
        }

        break

      case "dispute.create":
        const dispute = event.data

        // Record dispute for financial tracking
        await supabase.from("financial_transactions").insert({
          type: "dispute_created",
          amount: -(dispute.transaction.amount / 100),
          currency: dispute.transaction.currency.toUpperCase(),
          paystack_reference: dispute.transaction.reference,
          status: "pending",
          processed_at: new Date().toISOString(),
          notes: `Dispute reason: ${dispute.reason}`,
        })

        break

      default:
        console.log(`Unhandled event type: ${event.event}`)
    }

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("Webhook processing failed:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
