import { type NextRequest, NextResponse } from "next/server"

// Mock data - in production, this would use Prisma
const mockProducts = [
  {
    id: "1",
    name: "Submariner Date",
    slug: "submariner-date",
    description: "The Rolex Submariner Date is a legendary diving watch.",
    price: 8950.0,
    salePrice: null,
    sku: "ROL-SUB-001",
    stock: 3,
    categoryId: "cat_luxury_swiss",
    brandId: "brand_rolex",
    isActive: true,
    isFeatured: true,
    images: [{ url: "/rolex-submariner.png", alt: "Rolex Submariner", isPrimary: true }],
    specifications: [
      { name: "Case Material", value: "Stainless Steel" },
      { name: "Movement", value: "Automatic" },
      { name: "Water Resistance", value: "300m" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const brand = searchParams.get("brand") || ""

    // Filter products based on search params
    let filteredProducts = mockProducts

    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.sku.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.categoryId === category)
    }

    if (brand) {
      filteredProducts = filteredProducts.filter((product) => product.brandId === brand)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "price", "sku", "categoryId", "brandId"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create new product
    const newProduct = {
      id: Date.now().toString(),
      ...body,
      price: Number.parseFloat(body.price),
      salePrice: body.salePrice ? Number.parseFloat(body.salePrice) : null,
      stock: Number.parseInt(body.stock),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In production, save to database using Prisma
    mockProducts.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
