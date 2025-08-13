import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query.trim()) {
      return NextResponse.json({ results: [] })
    }

    // Search products
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        sale_price,
        brands(name),
        product_images(url, alt_text, is_primary)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq("is_active", true)
      .limit(limit)

    if (error) {
      console.error("Error searching products:", error)
      return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }

    // Search brands
    const { data: brands } = await supabase
      .from("brands")
      .select("id, name, description")
      .ilike("name", `%${query}%`)
      .limit(5)

    return NextResponse.json({
      results: {
        products: products || [],
        brands: brands || [],
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
