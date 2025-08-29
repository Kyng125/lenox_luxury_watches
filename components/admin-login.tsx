"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (username === "admin" && password === "lenox2024") {
        // Store admin session in localStorage
        localStorage.setItem("admin-authenticated", "true")
        localStorage.setItem("admin-login-time", Date.now().toString())

        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard.",
        })
        router.push("/admin/dashboard")
      } else {
        setError("Invalid credentials")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl">Admin Login</CardTitle>
        <CardDescription>Access the Lenox Luxury Watches admin dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-background border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-background border-border"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo credentials:</p>
          <p>
            Username: <code className="bg-muted px-1 rounded">admin</code>
          </p>
          <p>
            Password: <code className="bg-muted px-1 rounded">lenox2024</code>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
