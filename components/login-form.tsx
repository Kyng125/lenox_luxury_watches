"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signIn } from "@/lib/auth-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold py-3"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      router.push("/account")
    }
  }, [state, router])

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-800">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600" />
          <span className="font-serif text-2xl font-bold gold-gradient ml-2">LENOX</span>
        </div>
        <CardTitle className="font-serif text-2xl gold-gradient">Welcome Back</CardTitle>
        <p className="text-gray-400">Sign in to your account</p>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded">{state.error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <SubmitButton />

          <div className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-yellow-400 hover:underline">
              Sign up
            </Link>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              Continue as guest
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
