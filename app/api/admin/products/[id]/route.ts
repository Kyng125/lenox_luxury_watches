import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        brands(id, name, description, logo_url),
        categories(id, name, description),
        product_images(id, url, alt_text, is_primary, sort_order)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id } = params

    const updateData = {
      name: body.name,
      description: body.description,
      price: Number.parseFloat(body.price),
      sale_price: body.sale_price ? Number.parseFloat(body.sale_price) : null,
      sku: body.sku,
      stock_quantity: Number.parseInt(body.stock_quantity || "0"),
      category_id: body.category_id,
      brand_id: body.brand_id,
      is_active: body.is_active,
      is_featured: body.is_featured,
      specifications: body.specifications || {},
      dimensions: body.dimensions || {},
      weight: body.weight ? Number.parseFloat(body.weight) : null,
      updated_at: new Date().toISOString(),
    }

    const { data: product, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        brands(id, name, description),
        categories(id, name, description),
        product_images(id, url, alt_text, is_primary, sort_order)
      `)
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    if (body.images && Array.isArray(body.images)) {
      // Delete existing images
      await supabase.from("product_images").delete().eq("product_id", id)

      // Insert new images
      const imagePromises = body.images.map((image: any, index: number) =>
        supabase.from("product_images").insert({
          product_id: id,
          url: image.url,
          alt_text: image.alt_text || product.name,
          is_primary: index === 0 || image.is_primary,
          sort_order: index,
        }),
      )

      await Promise.all(imagePromises)
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    await supabase.from("product_images").delete().eq("product_id", id)

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
