import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        brands(name, description, logo_url),
        categories(name, description),
        product_images(url, alt_text, is_primary, sort_order)
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get related products from the same brand or category
    const { data: relatedProducts } = await supabase
      .from("products")
      .select(`
        *,
        brands(name),
        product_images(url, alt_text, is_primary)
      `)
      .or(`brand_id.eq.${product.brand_id},category_id.eq.${product.category_id}`)
      .neq("id", id)
      .eq("is_active", true)
      .limit(4)

    return NextResponse.json({
      product,
      relatedProducts: relatedProducts || [],
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
