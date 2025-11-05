"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthService } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface LoginFormProps {
  onSwitchToRegisterAction: () => void
}

export function LoginForm({ onSwitchToRegisterAction }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = await AuthService.login(email, password)

      // Redirect based on role and profile completion
      if (!user.profileComplete) {
        router.push("/profile-setup")
      } else {
        switch (user.role) {
          case "student":
            router.push("/student")
            break
          case "teacher":
            router.push("/teacher")
            break
          case "admin":
            router.push("/admin")
            break
        }
      }
    } catch (_err) {
      console.error(_err)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your Kaushaly account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input"
            />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={onSwitchToRegisterAction} className="text-muted-foreground">
            Don&apos;t have an account? Sign up
          </Button>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Demo accounts:</p>
          <p>Admin: admin@kaushaly.com</p>
          <p>Student: student@example.com</p>
          <p>Teacher: teacher@example.com</p>
          <p>Password: any</p>
        </div>
      </CardContent>
    </Card>
  )
}
