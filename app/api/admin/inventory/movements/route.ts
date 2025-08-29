import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: movements, error } = await supabase
      .from("inventory_movements")
      .select(`
        *,
        products(name, sku, brands(name))
      `)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      console.error("Error fetching inventory movements:", error)
      return NextResponse.json({ error: "Failed to fetch inventory movements" }, { status: 500 })
    }

    return NextResponse.json({ movements: movements || [] })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
