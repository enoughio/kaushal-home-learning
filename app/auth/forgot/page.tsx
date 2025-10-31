"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react"
import Link from 'next/link'
import { ForgotPasswordRequest, ApiResponse } from '@/lib/types'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const requestData: ForgotPasswordRequest = { email }
      const response = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        setIsEmailSent(true)
      } else {
        // For security reasons, we always show success even if email doesn't exist
        // The API returns success to prevent email enumeration attacks
        setIsEmailSent(true)
      }
    } catch (err) {
      console.error('Forgot password error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600">
            {isEmailSent 
              ? "Check your email for reset instructions" 
              : "Enter your email to receive a reset link"
            }
          </p>
        </div>

        {/* Main Card */}
        <Card className={`shadow-lg border-0 transition-all duration-300 ${
          isEmailSent ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className={`text-xl font-semibold flex items-center gap-2 ${
              isEmailSent ? 'text-green-800' : 'text-gray-900'
            }`}>
              {isEmailSent ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Email Sent Successfully
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5 text-primary" />
                  Forgot Password
                </>
              )}
            </CardTitle>
            <CardDescription className={isEmailSent ? 'text-green-700' : ''}>
              {isEmailSent 
                ? "If an account exists with this email, we've sent password reset instructions"
                : "No worries! Enter your email and we'll send you reset instructions if an account exists"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!isEmailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your registered email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={!email || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending Reset Link...
                    </div>
                  ) : (
                    <>
                      Send Reset Link
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              /* Success State */
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-green-800">Reset link sent!</h3>
                  <p className="text-sm text-green-700">
                    If an account with this email exists, we&apos;ve sent password reset instructions.
                  </p>
   
                </div>

                <div className="space-y-3 pt-4">
                  <div className="space-y-2">
                    <p className="text-xs text-green-600">
                      Didn&apos;t receive the email? Check your spam folder or try again
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="pt-4 border-t border-gray-200">
              <Link href="/auth/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Still having trouble?{' '}
            <a href="#" className="text-primary hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}