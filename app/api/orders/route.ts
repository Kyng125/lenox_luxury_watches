import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const orderData = await request.json()

    const {
      items,
      billingAddress,
      shippingAddress,
      paymentReference,
      subtotal,
      taxAmount,
      shippingAmount,
      totalAmount,
      guestEmail,
      createAccount,
      accountData,
    } = orderData

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Create user account if requested
    let userId = user?.id
    if (createAccount && !user && accountData) {
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email: accountData.email,
        password: accountData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        },
      })

      if (signUpError) {
        console.error("Error creating account:", signUpError)
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
      }

      userId = newUser.user?.id
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId || null,
        guest_email: !userId ? guestEmail : null,
        status: "pending",
        subtotal_amount: subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        billing_address: billingAddress,
        shipping_address: shippingAddress || billingAddress,
        payment_reference: paymentReference,
        payment_status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.salePrice || item.price,
      total_price: (item.salePrice || item.price) * item.quantity,
      product_snapshot: {
        name: item.name,
        brand: item.brand,
        image: item.image,
        sku: item.sku,
      },
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Clear cart after successful order
    if (userId) {
      await supabase.from("cart_items").delete().eq("user_id", userId)
    }

    const { data: updatedOrder } = await supabase
      .from("orders")
      .update({
        status: "processing",
        payment_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)
      .select()
      .single()

    return NextResponse.json({
      success: true,
      order: updatedOrder || {
        ...order,
        status: "processing",
        payment_status: "paid",
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          *,
          products(
            id,
            name,
            sku,
            brands(name),
            product_images(url, alt_text, is_primary)
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
