import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const brand = searchParams.get("brand") || ""
    const category = searchParams.get("category") || ""
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : null
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : null
    const sortBy = searchParams.get("sortBy") || "created_at"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const featured = searchParams.get("featured") === "true"

    // Build query
    let query = supabase
      .from("products")
      .select(`
        *,
        brands(name, description),
        categories(name, description),
        product_images(url, alt_text, is_primary, sort_order)
      `)
      .eq("is_active", true)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (brand) {
      query = query.eq("brands.name", brand)
    }

    if (category) {
      query = query.eq("categories.name", category)
    }

    if (minPrice !== null) {
      query = query.gte("price", minPrice)
    }

    if (maxPrice !== null) {
      query = query.lte("price", maxPrice)
    }

    if (featured) {
      query = query.eq("is_featured", true)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
