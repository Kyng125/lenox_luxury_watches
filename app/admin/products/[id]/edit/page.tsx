import { verifyAdminSession } from "@/lib/auth"
import { AdminProductForm } from "@/components/admin-product-form"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await verifyAdminSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product information</p>
      </div>
      <AdminProductForm productId={params.id} />
    </div>
  )
}
