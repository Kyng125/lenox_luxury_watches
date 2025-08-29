import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const brand = searchParams.get("brand") || ""

    let query = supabase.from("products").select(`
        *,
        brands(id, name, description),
        categories(id, name, description),
        product_images(id, url, alt_text, is_primary, sort_order)
      `)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq("category_id", category)
    }

    if (brand) {
      query = query.eq("brand_id", brand)
    }

    // Apply sorting and pagination
    query = query.order("created_at", { ascending: false })
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase.from("products").select("*", { count: "exact", head: true })

    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        pages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "price", "sku", "category_id", "brand_id"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const productData = {
      name: body.name,
      description: body.description || "",
      price: Number.parseFloat(body.price),
      sale_price: body.sale_price ? Number.parseFloat(body.sale_price) : null,
      sku: body.sku,
      stock_quantity: Number.parseInt(body.stock_quantity || "0"),
      category_id: body.category_id,
      brand_id: body.brand_id,
      is_active: body.is_active !== false,
      is_featured: body.is_featured || false,
      specifications: body.specifications || {},
      dimensions: body.dimensions || {},
      weight: body.weight ? Number.parseFloat(body.weight) : null,
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert(productData)
      .select(`
        *,
        brands(id, name, description),
        categories(id, name, description)
      `)
      .single()

    if (error) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    if (body.images && Array.isArray(body.images)) {
      const imagePromises = body.images.map((image: any, index: number) =>
        supabase.from("product_images").insert({
          product_id: product.id,
          url: image.url,
          alt_text: image.alt_text || product.name,
          is_primary: index === 0 || image.is_primary,
          sort_order: index,
        }),
      )

      await Promise.all(imagePromises)
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
