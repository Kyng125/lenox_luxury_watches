import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const cookieStore = cookies()

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get session ID for guest users
    const sessionId = cookieStore.get("cart-session")?.value

    if (!user && !sessionId) {
      return NextResponse.json({ items: [] })
    }

    let query = supabase.from("cart_items").select(`
        *,
        products(
          *,
          brands(name),
          product_images(url, alt_text, is_primary)
        )
      `)

    if (user) {
      query = query.eq("user_id", user.id)
    } else {
      query = query.eq("session_id", sessionId)
    }

    const { data: cartItems, error } = await query

    if (error) {
      console.error("Error fetching cart:", error)
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
    }

    return NextResponse.json({ items: cartItems || [] })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const cookieStore = cookies()
    const { productId, quantity = 1 } = await request.json()

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Generate session ID for guest users
    let sessionId = cookieStore.get("cart-session")?.value
    if (!user && !sessionId) {
      sessionId = crypto.randomUUID()
    }

    // Check if item already exists in cart
    let existingQuery = supabase.from("cart_items").select("*")

    if (user) {
      existingQuery = existingQuery.eq("user_id", user.id)
    } else {
      existingQuery = existingQuery.eq("session_id", sessionId)
    }

    const { data: existingItem } = await existingQuery.eq("product_id", productId).single()

    let result
    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)
        .select()

      result = { data, error }
    } else {
      // Add new item
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user?.id || null,
          session_id: user ? null : sessionId,
          product_id: productId,
          quantity,
        })
        .select()

      result = { data, error }
    }

    if (result.error) {
      console.error("Error adding to cart:", result.error)
      return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
    }

    // Set session cookie for guest users
    const response = NextResponse.json({ success: true, item: result.data?.[0] })
    if (!user && sessionId) {
      response.cookies.set("cart-session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return response
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { itemId, quantity } = await request.json()

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) {
        console.error("Error removing cart item:", error)
        return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
      }
    } else {
      // Update quantity
      const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId)

      if (error) {
        console.error("Error updating cart item:", error)
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

    if (error) {
      console.error("Error removing cart item:", error)
      return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
