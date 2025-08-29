import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: inventory, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        sku,
        stock_quantity,
        price,
        is_active,
        brands(name),
        categories(name),
        product_images(url, is_primary)
      `)
      .order("stock_quantity", { ascending: true })

    if (error) {
      console.error("Error fetching inventory:", error)
      return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
    }

    // Get low stock alerts (products with stock <= 5)
    const lowStockItems = inventory?.filter((item) => item.stock_quantity <= 5) || []

    // Get out of stock items
    const outOfStockItems = inventory?.filter((item) => item.stock_quantity === 0) || []

    return NextResponse.json({
      inventory: inventory || [],
      lowStockItems,
      outOfStockItems,
      totalProducts: inventory?.length || 0,
      totalValue: inventory?.reduce((sum, item) => sum + item.price * item.stock_quantity, 0) || 0,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { productId, quantity, movementType, notes } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 })
    }

    const { error } = await supabase.rpc("increase_product_stock", {
      product_id: productId,
      quantity_to_add: quantity,
      movement_type: movementType || "adjustment",
      notes: notes || "Manual stock adjustment",
    })

    if (error) {
      console.error("Error updating stock:", error)
      return NextResponse.json({ error: "Failed to update stock" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
