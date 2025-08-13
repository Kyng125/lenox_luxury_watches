import { type NextRequest, NextResponse } from "next/server"

// Mock data - same as above
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = mockProducts.find((p) => p.id === params.id)

    if (!product) {
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
    const body = await request.json()
    const productIndex = mockProducts.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Update product
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...body,
      price: Number.parseFloat(body.price),
      salePrice: body.salePrice ? Number.parseFloat(body.salePrice) : null,
      stock: Number.parseInt(body.stock),
      updatedAt: new Date().toISOString(),
    }

    mockProducts[productIndex] = updatedProduct

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productIndex = mockProducts.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Remove product
    mockProducts.splice(productIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
