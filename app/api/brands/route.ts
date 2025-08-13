import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

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
