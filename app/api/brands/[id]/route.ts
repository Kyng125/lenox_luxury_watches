import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { name, description, logo_url, country, established } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 })
    }

    const { data: brand, error } = await supabase
      .from("brands")
      .update({
        name,
        description,
        logo_url,
        country,
        established: established ? Number.parseInt(established) : null,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating brand:", error)
      return NextResponse.json({ error: "Failed to update brand" }, { status: 500 })
    }

    return NextResponse.json({ brand })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Check if brand has products
    const { data: products, error: checkError } = await supabase
      .from("products")
      .select("id")
      .eq("brand_id", params.id)
      .limit(1)

    if (checkError) {
      console.error("Error checking brand products:", checkError)
      return NextResponse.json({ error: "Failed to check brand usage" }, { status: 500 })
    }

    if (products && products.length > 0) {
      return NextResponse.json({ error: "Cannot delete brand with existing products" }, { status: 400 })
    }

    const { error } = await supabase.from("brands").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting brand:", error)
      return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
