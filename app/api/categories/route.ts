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

    return NextResponse.json(categories || [])
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { name, description, image_url } = await request.json()

    console.log("[v0] Received category data:", { name, description, image_url })

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const { data: existingCategory } = await supabase.from("categories").select("id").eq("name", name).single()

    if (existingCategory) {
      return NextResponse.json({ error: "A category with this name already exists" }, { status: 400 })
    }

    const { data: category, error } = await supabase
      .from("categories")
      .insert([
        {
          name,
          description,
          image_url: image_url || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating category:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Category created successfully:", category)
    return NextResponse.json({ category })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
