import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
      .from("categories")
      .select(`
        *,
        products(count)
      `)
      .order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    return NextResponse.json({ categories: categories || [] })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
      .insert([
        {
          name,
          description,
          slug: generatedSlug,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating category:", error)
      return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
