import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { name, description, slug } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const { data: category, error } = await supabase
      .from("categories")
      .update({
        name,
        description,
        slug: generatedSlug,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating category:", error)
      return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Check if category has products
    const { data: products, error: checkError } = await supabase
      .from("products")
      .select("id")
      .eq("category_id", params.id)
      .limit(1)

    if (checkError) {
      console.error("Error checking category products:", checkError)
      return NextResponse.json({ error: "Failed to check category usage" }, { status: 500 })
    }

    if (products && products.length > 0) {
      return NextResponse.json({ error: "Cannot delete category with existing products" }, { status: 400 })
    }

    const { error } = await supabase.from("categories").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting category:", error)
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
