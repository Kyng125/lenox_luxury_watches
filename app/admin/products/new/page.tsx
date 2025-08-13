import { verifyAdminSession } from "@/lib/auth"
import { AdminProductForm } from "@/components/admin-product-form"

export default async function NewProductPage() {
  await verifyAdminSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new luxury watch listing</p>
      </div>
      <AdminProductForm />
    </div>
  )
}
