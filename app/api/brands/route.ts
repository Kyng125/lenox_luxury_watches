import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: brands, error } = await supabase
      .from("brands")
      .select(`
        *,
        products(count)
      `)
      .order("name")

    if (error) {
      console.error("Error fetching brands:", error)
      return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 })
    }

    return NextResponse.json({ brands: brands || [] })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { name, description, logo_url } = await request.json()

    console.log("[v0] Received brand data:", { name, description, logo_url })

    if (!name) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 })
    }

    const { data: brand, error } = await supabase
      .from("brands")
      .insert([
        {
          name,
          description,
          logo_url: logo_url || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating brand:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Brand created successfully:", brand)
    return NextResponse.json({ brand })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
